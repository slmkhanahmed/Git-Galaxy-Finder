const currentUrl = window.location.href;

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
    const urlPattern = /https:\/\/github.com\/stars\/.*\/lists\/.*/;

    if (urlPattern.test(currentUrl)) {
        try {
            // Fetch the HTML from the first page to determine the total number of repositories
            let text = await fetchWithRetry(currentUrl);
            
            // Parse the HTML using DOMParser
            let parser = new DOMParser();
            let dom = parser.parseFromString(text, 'text/html');

            // Select elements and extract information
            let elements = dom.querySelectorAll('.mb-1 a, .pr-4, .my-3 .color-fg-muted');
            let arr = Array.from(elements);

            // Extract the number of repositories from the first text object
            let repoCount = 0;
            if (arr.length > 0) {
                const repoText = arr[0].textContent?.trim() || '';
                const repoMatch = repoText.match(/(\d+)\s+repositories/i);
                if (repoMatch) {
                    repoCount = parseInt(repoMatch[1].replace(/\./g, ''), 10);
                }
            }

            // Determine the total number of pages
            let totalPages = Math.ceil(repoCount / 30);

            // Initialize an array to store all results
            let allResults = [];

            // Create an array of promises to fetch all pages
            let pagePromises = [];
            for (let page = 1; page <= totalPages; page++) {
                const pageUrl = `${currentUrl}?page=${page}`;
                pagePromises.push(
                    fetchWithRetry(pageUrl).then(text => {
                        let dom = parser.parseFromString(text, 'text/html');
                        let elements = dom.querySelectorAll('.mb-1 a, .pr-4, .my-3 .color-fg-muted');
                        let arr = Array.from(elements);

                        // Ignore the first text element for pages other than the first
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
                        }).filter(result => result.text); // Filter out elements with empty text
                    })
                );
            }

            // Wait for all promises to resolve
            let pageResults = await Promise.all(pagePromises);

            // Flatten the results and store in allResults
            allResults = pageResults.flat();

            // Store all results in local storage in JSON format
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