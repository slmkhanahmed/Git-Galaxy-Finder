import React from 'react';
import ReactDOM from 'react-dom/client';
import ContentApp from './ContentApp';
import './a.tsx';

// Function to get the current URL
function getCurrentPath() {
  return window.location.href;
}

// Function to initialize or reinitialize the extension logic
function initial() {
  const currentUrl = getCurrentPath();
  const lastVisitedUrl = localStorage.getItem('lastVisitedUrl');

  // Define the URL pattern to match
  const urlPattern = /https:\/\/github.com\/stars\/.*\/lists\/.*/;

  // Remove local storage data if lastVisitedUrl matches the pattern but currentUrl does not
  if (lastVisitedUrl && urlPattern.test(lastVisitedUrl) && !urlPattern.test(currentUrl)) {
    localStorage.removeItem('githubLinks');
  }
  
  // Update lastVisitedUrl to the current URL if it matches the pattern
  if (urlPattern.test(currentUrl)) {
    localStorage.setItem('lastVisitedUrl', currentUrl);
    fetchAndParseAllPages();
  }


  // Create a new div element and append it to the document's body
  const rootDiv = document.createElement('div');
  rootDiv.id = 'my-extension-root'; // Add an ID for easy reference

  // Render the ContentApp component into the new div
  const root = ReactDOM.createRoot(rootDiv);

  const xeval = new XPathEvaluator();
  const res = xeval.evaluate(`//*[@id="user-list-repositories"]`, document.body);
  const beforeSearch = res.iterateNext();
  const beforeSearchParent = beforeSearch?.parentNode;

  // Insert the rootDiv before the identified element
  if (beforeSearchParent) {
    beforeSearchParent.insertBefore(rootDiv, beforeSearch);
  } else {
    // If the target element is not found, append the rootDiv directly to the body
    document.body.appendChild(rootDiv);
  }

  root.render(<ContentApp />);
}

// Set up a MutationObserver to monitor changes in the URL or relevant DOM elements
function observeUrlChanges() {
  let lastUrl = getCurrentPath();

  const observer = new MutationObserver(() => {
    const newUrl = getCurrentPath();
    if (newUrl !== lastUrl) {
      lastUrl = newUrl;
      initial();
    }
  });

  // Start observing changes to the <body> element
  observer.observe(document.body, { childList: true, subtree: true });

  // Also listen for popstate events to catch browser navigation changes
  window.addEventListener('popstate', () => {
    const newUrl = getCurrentPath();
    if (newUrl !== lastUrl) {
      lastUrl = newUrl;
      initial();
    }
  });
}

// Initialize the extension when the content script is first executed
setTimeout(initial, 1000); // Optional delay to ensure page is fully loaded
observeUrlChanges();
