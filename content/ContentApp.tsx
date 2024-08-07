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
      const filtered = repos.filter(repo =>
        (repo.text && repo.text.toLowerCase().includes(lowerCaseQuery)) ||
        (repo.type === 'link' && repo.href && repo.href.toLowerCase().includes(lowerCaseQuery))
      );
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
            {filteredRepos.map((repo, index) => {
              // Skip the first text description if it's at index 0
              if (index === 0 && repo.type === 'text') return null;
          
              // Only render if the item is a link
              if (repo.type === 'link') {
                // Find the next text description, if available
                const nextItem = filteredRepos[index + 1];
                const description = nextItem && nextItem.type === 'text' ? nextItem.text : '';
          
                return (
                  <div className='outerdiv' key={index}>
                    <div className='innerdiv'><a className='linkrepo' href={repo.href} target="_blank" rel="noopener noreferrer">{repo.text}</a>
                    {description && <p className='descriptionrepo'>{description}</p>}
                  </div></div>
                );
              }
              return null;
            })}
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
