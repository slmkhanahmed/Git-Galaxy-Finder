import ReactDOM from "react-dom/client";
import ContentApp from "./ContentApp";

const urlPattern = /https:\/\/github.com\/stars\/.*\/lists\/.*/;
async function fetchWithRetry(
  url: string,
  options = {},
  retries = 3,
  backoff = 3000,
) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.text();
    } catch (error) {
      console.error(`Fetch error on attempt ${i + 1} for URL: ${url}`, error);
      if (i < retries - 1) {
        console.log(`Retrying in ${backoff / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, backoff));
      } else {
        throw error;
      }
    }
  }
}

async function fetchAndParseAllPages() {
  const currentUrl = window.location.href; // Ensure current URL is up-to-date

  if (urlPattern.test(currentUrl)) {
    try {
      const text = await fetchWithRetry(currentUrl);
      if (!text) return;
      const parser = new DOMParser();
      const dom = parser.parseFromString(text, "text/html");
      const elements = dom.querySelectorAll(
        ".mb-1 a, .pr-4, .my-3 .color-fg-muted",
      );
      const arr = Array.from(elements);

      let repoCount = 0;
      if (arr.length > 0) {
        const repoText = arr[0].textContent?.trim() || "";
        const repoMatch = repoText.match(/(\d+)\s+repositories/i);
        if (repoMatch) {
          repoCount = parseInt(repoMatch[1].replace(/\./g, ""), 10);
        }
      }

      const totalPages = Math.ceil(repoCount / 30);
      let allResults = [];
      const pagePromises = [];
      for (let page = 1; page <= totalPages; page++) {
        const pageUrl = `${currentUrl}?page=${page}`;
        pagePromises.push(
          fetchWithRetry(pageUrl).then((text) => {
            if (!text) return;
            const dom = parser.parseFromString(text, "text/html");
            const elements = dom.querySelectorAll(
              ".mb-1 a, .pr-4, .my-3 .color-fg-muted",
            );
            const arr = Array.from(elements);
            if (page > 1 && arr.length > 0) {
              arr.shift();
            }
            return arr
              .map((e) => {
                if (e instanceof HTMLAnchorElement) {
                  return {
                    type: "link",
                    text: e.innerText,
                    href: e.href,
                  };
                } else {
                  return {
                    type: "text",
                    text: e.textContent?.trim() || "",
                  };
                }
              })
              .filter((result) => result.text);
          }),
        );
      }

      const pageResults = await Promise.all(pagePromises);
      allResults = pageResults.flat();
      localStorage.setItem("githubLinks", JSON.stringify(allResults));

      return { allResults };
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }
}

function getCurrentPath() {
  return window.location.href;
}

function initial() {
  const currentUrl = getCurrentPath();
  const savedUrl = localStorage.getItem("lastVisitedUrl");
  // If the current URL matches the pattern
  if (urlPattern.test(currentUrl)) {
    // Check if the saved URL is different and matches the pattern
    if (savedUrl && savedUrl !== currentUrl) {
      // Clear data if saved URL matches the pattern and is different from current URL
      localStorage.removeItem("githubLinks");
    }

    // Save the new URL as it matches the pattern
    localStorage.setItem("lastVisitedUrl", currentUrl);
    fetchAndParseAllPages(); // Re-fetch data for the new URL
  } else return null;

  const contentDiv = document.createElement("div");
  contentDiv.id = "my-extension-root";
  const root = ReactDOM.createRoot(contentDiv);

  const xeval = new XPathEvaluator();
  let res = xeval.evaluate(`//*[@id="user-list-repositories"]`, document.body);
  const userListRepositories = res.iterateNext();
  const dataHpc = userListRepositories?.parentNode;

  res = xeval.evaluate(`//*[@id="my-extension-root"]`, document.body);

  const previousContent = res.iterateNext();

  if (previousContent) {
    dataHpc?.removeChild(previousContent);
  }

  if (dataHpc) {
    dataHpc.insertBefore(contentDiv, userListRepositories);
  }

  root.render(<ContentApp />);
}

function observeUrlChanges() {
  let lastUrl = getCurrentPath();

  const observer = new MutationObserver(() => {
    const newUrl = getCurrentPath();
    if (newUrl !== lastUrl) {
      lastUrl = newUrl;
      if (urlPattern.test(newUrl)) {
        initial();
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

setTimeout(initial, 1000);
observeUrlChanges();
