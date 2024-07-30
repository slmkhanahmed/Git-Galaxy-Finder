const currentUrl = window.location.href;

async function fetchAndParseAllPages() {
    const urlPattern = /https:\/\/github.com\/stars\/.*\/lists\/.*/;

    if (urlPattern.test(currentUrl)) {
        try {
            // Fetch the HTML from the first page to determine the total number of repositories
            let response = await fetch(currentUrl);
            let text = await response.text();

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

            // Loop through each page and extract data
            for (let page = 1; page <= totalPages; page++) {
                const pageUrl = `${currentUrl}?page=${page}`;
                response = await fetch(pageUrl);
                text = await response.text();
                dom = parser.parseFromString(text, 'text/html');
                elements = dom.querySelectorAll('.mb-1 a, .pr-4, .my-3 .color-fg-muted');
                arr = Array.from(elements);

                const results = arr.map(e => {
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

                // Append the results of the current page to allResults
                allResults = allResults.concat(results);
            }

            // Store all results in local storage in JSON format
            localStorage.setItem('githubLinks', JSON.stringify(allResults));

            // Print results to console
            allResults.forEach(result => {
                if (result.type === 'link') {
                    console.log(`Link: ${result.href} - ${result.text}`);
                } else {
                    console.log(`Text: ${result.text}`);
                }
            });

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