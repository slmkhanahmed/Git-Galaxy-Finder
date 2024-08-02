import React, { useState, useEffect } from 'react';
import './content.css';
import './a.tsx';

// Polling interval in milliseconds
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
        setPolling(false); // Stop polling
      } else {
        setDataNotAvailable(true);
      }

      if (storedSearchQuery) {
        setSearchQuery(storedSearchQuery);
      }
    };

    // Initial data check
    checkData();

    // Set up polling to check for data availability
    const intervalId = setInterval(() => {
      if (polling) {
        checkData();
      } else {
        clearInterval(intervalId); // Clear interval when data is loaded
      }
    }, POLLING_INTERVAL);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [polling]);

  useEffect(() => {
    if (dataLoaded && searchQuery) {
      // Filter the repos based on the search query
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = repos.filter(repo =>
        (repo.text && repo.text.toLowerCase().includes(lowerCaseQuery)) ||
        (repo.type === 'link' && repo.href && repo.href.toLowerCase().includes(lowerCaseQuery))
      );
      setFilteredRepos(filtered);
    } else if (dataLoaded) {
      setFilteredRepos([]); // Clear the display if search query is empty
    }
  }, [searchQuery, repos, dataLoaded]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Save the search query to localStorage
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
          disabled={!dataLoaded} // Disable input if data is not loaded
        />
        <button type="submit" disabled={!dataLoaded}>Search</button>
      </form>

      {dataNotAvailable ? (
        <p>No data available in localStorage. Please ensure that 'githubLinks' data is stored correctly.</p>
      ) : (
        <>
          {/* Hide the repos div if there is no search query or data is not loaded */}
          {dataLoaded && searchQuery && filteredRepos.length > 0 && (
            <div className='repos'>
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
          )}
          {dataLoaded && searchQuery && filteredRepos.length === 0 && (
            <p>No repositories match the search criteria.</p>
          )}
        </>
      )}
    </div>
  );
}
