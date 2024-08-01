import React, { useState, useEffect } from 'react';
import './content.css';
import './a.tsx';

export default function ContentApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const storedSearchQuery = localStorage.getItem('searchQuery');
    const storedRepos = JSON.parse(localStorage.getItem('githubLinks'));

    if (storedSearchQuery) {
      setSearchQuery(storedSearchQuery);
    }
    if (storedRepos) {
      setRepos(storedRepos);
      setFilteredRepos(storedRepos);
      setDataLoaded(true); // Enable the search once data is loaded
    }
  }, []);

  useEffect(() => {
    if (dataLoaded && searchQuery) {
      // Filter the repos based on the search query
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = repos.filter(repo =>
        (repo.text && repo.text.toLowerCase().includes(lowerCaseQuery)) ||
        (repo.type === 'link' && repo.href && repo.href.toLowerCase().includes(lowerCaseQuery))
      );
      setFilteredRepos(filtered);
    } else if (dataLoaded && !searchQuery) {
      setFilteredRepos([]); // Clear the display if search query is empty
    }
  }, [searchQuery, repos, dataLoaded]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Save the search query to localStorage
    localStorage.setItem('searchQuery', e.target.value);
  };

  return (
    <div>
      <form id='searchstar' onSubmit={(e) => e.preventDefault()}>
        <label hidden htmlFor="search">Search:</label>
        <input
          placeholder='Search Stars Repo'
          type="search"
          value={searchQuery}
          onChange={handleSearchChange}
          disabled={!dataLoaded} // Disable input if data is not loaded
        />
        <button type="submit" disabled={!dataLoaded}>Search</button>
      </form>

      <div className='repos'>
        {/* Render filtered repos only if there's a search query */}
        {filteredRepos.map((repo, index) => (
          <div key={index}>
            {repo.type === 'link' ? (
              <a href={repo.href} target="_blank" rel="noopener noreferrer">{repo.text}</a>
            ) : (
              <p>{repo.text}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
