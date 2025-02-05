import React, { useState, useEffect } from 'react';
import './content.css';
type Theme = 'dark' | 'light';

const POLLING_INTERVAL = 1000;

export default function ContentApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataNotAvailable, setDataNotAvailable] = useState(true);
  const [polling, setPolling] = useState(true);
// Add theme state
const [theme, setTheme] = useState<Theme>(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) return savedTheme as Theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
});

// Add theme toggle effect
useEffect(() => {
  localStorage.setItem('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
}, [theme]);

const toggleTheme = () => {
  setTheme(prev => prev === 'dark' ? 'light' : 'dark');
};
  useEffect(() => {
    const checkData = () => {
      const storedSearchQuery = localStorage.getItem('searchQuery');
      const storedRepos = JSON.parse(localStorage.getItem('githubLinks'));

      if (storedRepos) {
        setRepos(storedRepos);
        setDataLoaded(true);
        setDataNotAvailable(false);
        setPolling(false);
      } else {
        setDataNotAvailable(true);
      }

      if (storedSearchQuery) {
        setSearchQuery(storedSearchQuery);
      }
    };

    checkData();

    const intervalId = setInterval(() => {
      if (polling) {
        checkData();
      } else {
        clearInterval(intervalId);
      }
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [polling]);

  useEffect(() => {
    if (dataLoaded && searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = [];
      for (let i = 0; i < repos.length; i++) {
        const linkText = repos[i].type === 'link' ? repos[i].text.toLowerCase() : '';
        const descriptionText = repos[i + 1] && repos[i + 1].type === 'text' ? repos[i + 1].text.toLowerCase() : '';

        if (linkText.includes(lowerCaseQuery) || descriptionText.includes(lowerCaseQuery)) {
          filtered.push({
            link: repos[i],
            description: descriptionText ? repos[i + 1].text : ''
          });
        }
      }
      setFilteredRepos(filtered);
    } else if (dataLoaded) {
      setFilteredRepos([]);
    }

    // Show or hide the repo list based on the search query
    const repoListElement = document.getElementById('user-list-repositories');
    if (repoListElement) {
      if (searchQuery.trim() === '') {
        repoListElement.style.display = 'block';
      } else {
        repoListElement.style.display = 'none';
      }
    }
  }, [searchQuery, repos, dataLoaded]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    localStorage.setItem('searchQuery', query);
  };

  return (
    <div data-theme={theme}>
      <form id="searchstar" onSubmit={(e) => e.preventDefault()}>
        <input
          id="search"
          placeholder="Search Stars Repo"
          type="search"
          value={searchQuery}
          onChange={handleSearchChange}
          disabled={!dataLoaded}
        />
        <button type="submit" disabled={!dataLoaded}>
          Search
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle"
          title="Toggle theme"
        >
          {theme === "dark" ? "🌞" : "🌛"}
        </button>
      </form>
  
      {dataNotAvailable ? (
        <div className="data-message">
          No data available in localStorage. Please ensure 'githubLinks' data is stored correctly.
        </div>
      ) : (
        <>
          {dataLoaded && searchQuery && filteredRepos.length > 0 && (
            <div className="repos">
              {filteredRepos.map((repo, index) => (
                <div className="outerdiv" key={index}>
                  <div className="innerdiv">
                    <a
                      className="linkrepo"
                      href={repo.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {repo.link.text}
                    </a>
                    {repo.description && (
                      <p className="descriptionrepo">{repo.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {dataLoaded && searchQuery && filteredRepos.length === 0 && (
            <div className="no-results">
              No repositories match the search criteria.
            </div>
          )}
        </>
      )}
    </div>
  );