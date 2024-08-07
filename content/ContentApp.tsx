import React, { useState, useEffect } from 'react';
import './content.css';

const POLLING_INTERVAL = 1000;

export default function ContentApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataNotAvailable, setDataNotAvailable] = useState(true);
  const [polling, setPolling] = useState(true);

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
  }, [searchQuery, repos, dataLoaded]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    localStorage.setItem('searchQuery', query);
  };

  return (
    <div>
      <form id='searchstar' onSubmit={(e) => e.preventDefault()}>
        <label hidden htmlFor="search">Search:</label>
        <input
          id="search"
          placeholder='Search Stars Repo'
          type="search"
          value={searchQuery}
          onChange={handleSearchChange}
          disabled={!dataLoaded}
        />
        <button type="submit" disabled={!dataLoaded}>Search</button>
      </form>

      {dataNotAvailable ? (
        <p>No data available in localStorage. Please ensure that 'githubLinks' data is stored correctly.</p>
      ) : (
        <>
          {dataLoaded && searchQuery && filteredRepos.length > 0 && (
            <div className='repos'>
              {filteredRepos.map((repo, index) => (
                <div className='outerdiv' key={index}>
                  <div className='innerdiv'>
                    <a className='linkrepo' href={repo.link.href} target="_blank" rel="noopener noreferrer">
                      {repo.link.text}
                    </a>
                    {repo.description && <p className='descriptionrepo'>{repo.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
          {dataLoaded && searchQuery && filteredRepos.length === 0 && (
            <p>No repositories match the search criteria.</p>
          )}
        </>
      )}
    </div>
  );
}
