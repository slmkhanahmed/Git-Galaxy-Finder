# Git Galaxy Finder

Search repositories by name or description within a GitHub Stars list, right on the list page.

## Install in Firefox

1. Open the [official Git Galaxy Finder listing on Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/git-star/) in Firefox and choose **Add to Firefox**. Review the GitHub site-access permission when prompted.
2. Open a named GitHub Stars list, such as `https://github.com/stars/USERNAME/lists/LIST-NAME`. Sign in on GitHub itself if the list requires it.
3. Type in the search box on the list page, then select a repository from the results.

Mozilla lists the store add-on for Firefox on desktop and Android. The instructions below are for testing a local checkout in desktop Firefox, not installing the signed store version.

## Build and test this checkout

With Node.js and npm installed, run these commands from the repository root:

```sh
npm ci
npm run build -- --no-autoinstall
```

Parcel builds the extension into `dist/`. In a separate desktop Firefox test profile, open `about:debugging` → **This Firefox** → **Load Temporary Add-on**, then choose `dist/manifest.json`. It appears as `gehance` in this checkout. The temporary add-on is removed when Firefox restarts. See [Mozilla’s temporary-install guide](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/).

Use `npm start -- --no-autoinstall` for watch mode. After changes build, reload the temporary add-on from **This Firefox**.

## Data in this checkout

The search script reads repository links and descriptions from GitHub’s list pages. It stores the parsed results, last list URL, search text, and theme in the browser’s GitHub site storage (`localStorage`). The search doesn’t require a personal access token or its own OAuth login. The development toolbar popup’s sign-in button is a placeholder; use the search on a named GitHub list instead.
