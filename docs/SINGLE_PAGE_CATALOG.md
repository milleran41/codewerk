# Single-Page Catalog

## Files

- `index.html`: the unchanged original hero structure, search/filter toolbar, footer sections and native details dialog.
- `catalog.css`: catalog, dialog and responsive styles. The original `styles.css` remains for the hero and legacy utilities.
- `catalog.js`: shared previews, translated detail views, local search, filters, gallery and history handling.
- `catalog-copy.js`: independent Russian, English and German editorial text. Does not fetch or parse READMEs.
- `data/projects.json`: identifiers, published status, download/release URLs, local screenshots, gallery, video and installation facts.
- `script.js`: existing translations and feedback/subscription/review/rating/share utilities, with catalog integration.
- `assets/vendor`: pinned local Fuse.js 7.1.0 UMD and Lucide 0.468.0, with licenses. Search does not send queries to an AI or search server.
- The preserved original site now lives independently at https://milleran41.github.io/codewerk-source/ with its original Git history. It is not part of this site's production artifact.
- `publishing-copy.js`: translated availability and optional distribution metadata labels.
- `scripts/build-site.mjs`: dependency-free validation and production packaging using an explicit file list. No private app code, internal documents or backups are included.

## Add or Update a Program

1. Add a project record to `data/projects.json`. Use a stable `id`, `status: "published"`, a screenshot and a verified download URL.
2. Set `order` (lower numbers appear first), `categories` (`windows`, `browser`, `extension`) and multilingual `searchAliases` for names, topics and tasks.
3. Add its editorial record under `projects[id]` in each of `ru`, `en` and `de` in `catalog-copy.js`: `title` if different, `tagline`, `description`, optional `features`, and `sections` as `[heading, paragraph]` pairs.
4. Add local screenshots to `assets/screenshots`. Optional `gallery` entries accept `{src, alt}`; multiple images enable previous/next controls. The app screenshots are shown without cropping.
5. Add `videoUrl` only when a real video exists. It enables an icon-only YouTube button at the right of the program title in the preview, with a translated tooltip, and the existing YouTube action in the detail window. No Store/video placeholders are presented.
6. Use `showRepositoryLink: false` to hide source-code buttons while keeping binary downloads available. `downloadMode: "request"` retains the existing request form.
7. Set `downloadAvailable: false` and `downloadUnavailableReason: "downloadFileMissing"` if a ready-to-run file is unavailable. Use `downloadPackageMissing` for a missing extension package. Do not put a GitHub source archive in `downloadUrl`. A confirmed `storeUrl` adds a Microsoft Store button to the left of the direct download in previews and details when both URLs exist; with only a store URL, it is the download action. Timer's Store listing was supplied by the owner: https://apps.microsoft.com/detail/9MWTDPLL3C5M.
8. Optional metadata: `version`, `updatedAt` (YYYY-MM-DD), `languages` (actual app languages), `licenseType` (`free`, `freemium`, `paid`), and `price: {"amount": 4.99, "currency": "EUR"}`. Use null/empty arrays for unknown values. Metadata appears only inside the details dialog, not on preview cards. Prices are descriptive only; purchases use the supplied store link.

All published programs use the same UI. No separate HTML page is needed. A URL such as `#cookbook` opens the matching dialog and is used by QR/share links.

The initial language is the first supported browser preference, with English as fallback. A valid stored `codewerkLanguage` overrides it. Storage failures do not prevent using the site. Changing language also updates an open detail window.

Closing a dialog preserves the current search, filter and page position. Native dialog behavior provides background inertness and a focus boundary; the close button, Escape, outside click and browser history are supported. Auxiliary share/review/rating dialogs live inside the native modal and have their own keyboard handling.

Search normalizes case, accents and Russian е/ё, searches text across all three languages, and uses Fuse.js for typos. Multiword results are ranked and weak matches are removed relative to the best result. It is a local indexed search, not unrestricted semantic understanding.

## Content and Release Caveats

The long Russian cookbook source draft is preserved in `projects.json` as reference. The new catalog uses shorter, independently written editorial sections in all three languages. The cookbook description is marked as development-version content because published binaries and the newer local project are not confirmed equivalent.

Never label a preview as stable merely because it was published later. On 2026-11-04 the cookbook installer 0.1.3 and portable prerelease 0.0.1 were confirmed available. The newer local desktop project is not the same as these public binaries. Application builds and releases are not changed by this website's workflow.

## Local Preview

Run `node scripts/build-site.mjs`, then serve the generated `dist` directory with a static HTTP server. The public site requires no local server or Node process on a visitor's computer. Resources use relative paths compatible with `/codewerk/`; program details use hash URLs such as `#cookbook`.

## Publish and Roll Back

The official working repository is https://github.com/milleran41/codewerk. Commit approved website changes to `main` and push normally. The `Publish CodeWerk catalog` GitHub Actions workflow validates and deploys `dist` automatically. If validation fails, it does not deploy the failed package. No package installation is required.

For a manual deployment, open Actions > Publish CodeWerk catalog > Run workflow. Choose `catalog` for the current site or `previous-site` to restore the preserved old website to `/codewerk/`. This uses the immutable backup tag `pre-catalog-2026-11-04` and does not rewrite history. Re-running with `catalog` restores the new catalog. This does not affect `/codewerk-source/`.

`docs/download-request-apps-script.js` was retained from the current GitHub revision, including the category-view additions. It documents an external Google Apps Script service and is not deployed or modified automatically by Pages. Google Forms and the rating service remain the existing external services; do not send test submissions to them.

On 2026-11-04, MixLab's configured EXE returned 404 and the calendar URL was a source archive. Their catalog download buttons are disabled; add verified release/store links and enable them after a later check.

The owner subsequently approved routing all six archive download buttons to the corresponding `https://milleran41.github.io/codewerk/#id` detail view. The archive's share text uses that official download page as well. Archive design and other functions stay unchanged. Direct EXE/ZIP actions in this catalog use native file links without `target="_blank"`; store, video and repository links remain separate external actions. Ready-made files remain on their existing GitHub hosting. When updating a file URL, retain a proper downloadable file response; the HTML download attribute alone cannot force a cross-origin server to send an attachment.

## Verification

Check all six programs, typo/alias searches, empty results, combined platform/search filters, all languages and language persistence, direct hash links, close actions and focus return, gallery if supplied, and desktop/mobile overflow. Do not submit test feedback or ratings to production services.
