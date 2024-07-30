const currentUrl = window.location.href;
console.log(currentUrl);

async function fetchAndParse() {
    const urlPattern = /https:\/\/github.com\/stars\/.*\/lists\/.*/;

    if (urlPattern.test(currentUrl)) {
        try {
            // Fetch the HTML from the specified URL
            const response = await fetch('https://github.com/stars/adnahmed/lists/tools?page=19');
            const text = await response.text();

            // Parse the HTML using DOMParser
            const parser = new DOMParser();
            const dom = parser.parseFromString(text, 'text/html');

            // Select elements and extract information
            const elements = dom.querySelectorAll('.mb-1 a, .pr-4, .my-3 .color-fg-muted');
            const arr = Array.from(elements);

            // Extract href and text from the elements
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

            // Extract the number of repositories from the first text object
            let repoCount = 0;
            if (results.length > 0 && results[0].type === 'text') {
                const repoText = results[0].text;
                const repoMatch = repoText.match(/(\d+)\s+repositories/i);
                if (repoMatch) {
                    repoCount = parseInt(repoMatch[1].replace(/\./g, ''), 10) + 1;
                }
            }

            // Print results to console
            results.forEach(result => {
                if (result.type === 'link') {
                    console.log(`Link: ${result.href} - ${result.text}`);
                } else {
                    console.log(`Text: ${result.text}`);
                }
            });

            // Store results in local storage in JSON format
            localStorage.setItem('githubLinks', JSON.stringify(results));
            console.log(`Repository count: ${repoCount}`);

            return { results, repoCount };
        } catch (error) {
            console.error('Fetch error:', error);
        }
    } else {
        console.log("URL does not match pattern");
    }
}

fetchAndParse();
