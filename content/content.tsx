import React from 'react';
import ReactDOM from 'react-dom/client';
import ContentApp from './ContentApp';

async function fetchWithRetry(url, options = {}, retries = 3, backoff = 3000) {
    for (let i = 0; i < retries; i++) {
        try {
            let response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.text();
        } catch (error) {
            console.error(`Fetch error on attempt ${i + 1} for URL: ${url}`, error);
            if (i < retries - 1) {
                console.log(`Retrying in ${backoff / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, backoff));
            } else {
                throw error;
            }
        }
    }
}

async function fetchAndParseAllPages() {
    const currentUrl = window.location.href; // Ensure current URL is up-to-date
    const urlPattern = /https:\/\/github.com\/stars\/.*\/lists\/.*/;

    if (urlPattern.test(currentUrl)) {
        try {
            let text = await fetchWithRetry(currentUrl);
            let parser = new DOMParser();
            let dom = parser.parseFromString(text, 'text/html');
            let elements = dom.querySelectorAll('.mb-1 a, .pr-4, .my-3 .color-fg-muted');
            let arr = Array.from(elements);
            
            let repoCount = 0;
            if (arr.length > 0) {
                const repoText = arr[0].textContent?.trim() || '';
                const repoMatch = repoText.match(/(\d+)\s+repositories/i);
                if (repoMatch) {
                    repoCount = parseInt(repoMatch[1].replace(/\./g, ''), 10);
                }
            }

            let totalPages = Math.ceil(repoCount / 30);
            let allResults = [];
            let pagePromises = [];
            for (let page = 1; page <= totalPages; page++) {
                const pageUrl = `${currentUrl}?page=${page}`;
                pagePromises.push(
                    fetchWithRetry(pageUrl).then(text => {
                        let dom = parser.parseFromString(text, 'text/html');
                        let elements = dom.querySelectorAll('.mb-1 a, .pr-4, .my-3 .color-fg-muted');
                        let arr = Array.from(elements);
                        if (page > 1 && arr.length > 0) {
                            arr.shift();
                        }
                        return arr.map(e => {
                            if (e instanceof HTMLAnchorElement) {
                                return {
                                    type: 'link',
                                    text: e.innerText,
                                    href: e.href
                                };
                            } else {
                                return {
                                    type: 'text',
                                    text: e.textContent?.trim() || ''
                                };
                            }
                        }).filter(result => result.text);
                    })
                );
            }

            let pageResults = await Promise.all(pagePromises);
            allResults = pageResults.flat();
            localStorage.setItem('githubLinks', JSON.stringify(allResults));

            console.log(`Total repository count: ${repoCount}`);
            console.log(`Total pages processed: ${totalPages}`);

            return { allResults, repoCount, totalPages };
        } catch (error) {
            console.error('Fetch error:', error);
        }
    } else {
        console.log("URL does not match pattern");
    }
}

fetchAndParseAllPages();

function getCurrentPath() {
  return window.location.href;
}

function initial() {
  const currentUrl = getCurrentPath();
  const lastVisitedUrl = localStorage.getItem('lastVisitedUrl');

  const urlPattern = /https:\/\/github.com\/stars\/.*\/lists\/.*/;

  if (lastVisitedUrl && urlPattern.test(lastVisitedUrl) && !urlPattern.test(currentUrl)) {
    localStorage.removeItem('githubLinks');
  }

  if (urlPattern.test(currentUrl)) {
    localStorage.setItem('lastVisitedUrl', currentUrl);
    fetchAndParseAllPages(); // Re-fetch data for the new URL
  }

  const rootDiv = document.createElement('div');
  rootDiv.id = 'my-extension-root';

  const root = ReactDOM.createRoot(rootDiv);

  const xeval = new XPathEvaluator();
  const res = xeval.evaluate(`//*[@id="user-list-repositories"]`, document.body);
  const beforeSearch = res.iterateNext();
  const beforeSearchParent = beforeSearch?.parentNode;

  if (beforeSearchParent) {
    beforeSearchParent.insertBefore(rootDiv, beforeSearch);
  } else {
    document.body.appendChild(rootDiv);
  }

  root.render(<ContentApp />);
}

function observeUrlChanges() {
  let lastUrl = getCurrentPath();

  const observer = new MutationObserver(() => {
    const newUrl = getCurrentPath();
    if (newUrl !== lastUrl) {
      lastUrl = newUrl;
      initial();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('popstate', () => {
    const newUrl = getCurrentPath();
    if (newUrl !== lastUrl) {
      lastUrl = newUrl;
      initial();
    }
  });
}

setTimeout(initial, 1000);
observeUrlChanges();
