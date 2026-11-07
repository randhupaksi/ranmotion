# Licensing and third-party notices

This page records how RanMotion is licensed, what the GSAP license requires, how third-party notices are produced, and what to check when dependencies change. It is engineering documentation, not legal advice. The evidence was read on 2026-11-06; read the linked sources again before relying on it later.

## RanMotion's own license

- [LICENSE](../LICENSE) is a custom source-available license. The repository is public so that people can read, clone, run, and learn from it. Publishing, hosting, redistributing, selling, commercial use, and presenting the work as someone else's need the author's written permission.
- It is not an open-source license, because open-source licenses cannot restrict republishing. Do not call the project open source in code, docs, or UI.
- `package.json` points to the file with `"license": "SEE LICENSE IN LICENSE"`, and the package stays `private`. The footer shows "All rights reserved" and links to the license.
- GitHub's Terms of Service let anyone view and fork a public repository. The license acknowledges this (section 2d) and keeps forks under the same terms.
- Pull requests are welcome. Section 5 of the license lets the author use accepted contributions under any license, so a later license change does not need every contributor's consent.
- Replacing or loosening the license is the author's decision, not a cleanup task.

## GSAP

### What RanMotion uses

| Fact                   | Evidence                                                                                                                                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version and modules    | GSAP 3.15.0: core, ScrollTrigger, and MotionPathPlugin. `node_modules/gsap/package.json`, pinned by `package-lock.json`.                                                                             |
| Where it runs          | The app (`import gsap from 'gsap'` in `HomeDemo.tsx` and `ConceptStudy.tsx`) and the preview iframe (`gsap/dist/*.min.js?raw` in `previewDocument.ts`).                                              |
| License named by npm   | `"license": "Standard 'no charge' license: https://gsap.com/standard-license."`                                                                                                                      |
| License named in files | `@license Copyright 2008-2026, GreenSock. All rights reserved. Subject to the terms at https://gsap.com/standard-license` in `gsap-core.js`, `ScrollTrigger.js`, and `MotionPathPlugin.js`.          |
| License name and dates | Standard "No Charge" GSAP License, effective April 30, 2025, last modified May 30, 2025 (read at gsap.com/standard-license on 2026-11-06).                                                           |
| Not MIT                | GSAP's README says "GreenSock's standard "no charge" license can be viewed at https://gsap.com/standard-license". ScanCode LicenseDB lists it as `gsap-standard-no-charge-2025`, "Proprietary Free". |
| Repository contents    | No GSAP file is tracked, and none appears anywhere in `git log --all` (checked 2026-11-06). `node_modules/` is ignored.                                                                              |

### What the license says

Short quotes from [gsap.com/standard-license](https://gsap.com/standard-license):

- **Grant:** "Webflow grants you a non-exclusive, worldwide license to use, reproduce, display, and implement GSAP Products" solely for Permitted Uses.
- **Permitted Uses:** "the implementation and/or use of GSAP Products on any website, web application, or digital interface".
- **Commercial use (FAQ):** "Commercial usage is covered under the standard license", and the formerly members-only plugins "can be used in commercial projects at no charge".
- **Prohibited Uses:** "any implementation and/or use of GSAP Products in tools that allow users to build visual animations without code", tied to competing with Webflow's animation tools. The FAQ says AI-generated code is not a Prohibited Use and asks you to contact GSAP when unsure.
- **Restrictions:** no Prohibited Uses without prior written consent; no reverse engineering "for the purpose of creating Competitive Products"; no removing or altering "proprietary notices or branding from GSAP Products".
- **Ownership and termination:** the intellectual property stays with Webflow, which may terminate the license "in its discretion"; you must then stop using GSAP and destroy copies.
- **Amendments (paraphrased):** Webflow may update the terms by posting them. Continued use counts as acceptance, and if you do not accept a revision you may not use versions released after its effective date. Earlier versions stay under the earlier terms.
- **General (section VI.1):** the license "is incorporated into and subject to Webflow's Terms of Service", and the GSAP License governs when the two conflict, as to your use of GSAP.
- **Not in the text:** a warranty disclaimer, a liability limit, or a governing-law clause. The page also does not address open-source projects, redistribution, education, tutorials, courses, or client work.

### How RanMotion complies

| Requirement                                                  | How RanMotion meets it                                                                                                                                                              | How to verify                                                                                                |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Do not remove or alter proprietary notices or branding       | `vite.config.ts` sets `comments.legal`, so `@license` banners survive minification. The preview embeds GSAP's own minified files unchanged apart from escaping `</script`.          | After a build, `grep -l GreenSock dist/assets/*.js` must list exactly the `gsap-*` and `MotionLab-*` chunks. |
| Use only on a website, web application, or digital interface | RanMotion is a static web application.                                                                                                                                              | Not applicable.                                                                                              |
| No visual, no-code animation builder that competes           | RanMotion teaches GSAP by writing and running code. Its sliders and timeline view change constants in the code or display results; they do not create, store, or export animations. | Reassess before adding drag-to-create, no-code editing, or export features.                                  |
| Credit and pointers                                          | The license does not require credit. The footer links to the GSAP documentation and license, states that RanMotion is independent, and links to the generated third-party notices.  | `SiteLayout.tsx`                                                                                             |
| Version control                                              | `package-lock.json` pins GSAP 3.15.0.                                                                                                                                               | Read the license again before upgrading.                                                                     |

### Residual risks

- **Terms can change.** Webflow may amend the license. The terms read here took effect on April 30, 2025.
- **Broad definition.** "Competitive Products" covers services that let users "create, edit, or manage animations through a visual interface or builder". RanMotion's controls edit code constants and do not build animations, so the risk is low. Features that move toward a builder deserve a fresh look, or a message to GSAP.
- **Education is not addressed.** The license does not mention tutorials or courses. Its prohibition targets no-code animation tools, and a code-based learning site falls outside that on a plain reading. That is an inference, not a statement from GSAP.
- **Old terms.** Pages and articles that describe a paid "Business" tier or fees charged to end users describe superseded terms. `gsap.com/community/licensing` returned 404 on 2026-11-06.

## Third-party notices

- `build.license` in `vite.config.ts` makes every build write `THIRD_PARTY_NOTICES.txt` to the output root. It lists the name, version, SPDX identifier, and license text of each dependency in the bundle: 59 packages on 2026-11-06, including the SIL Open Font License text for the Geist fonts and lucide's ISC and Feather notices.
- Vercel gives static files precedence over the SPA rewrite, so `/THIRD_PARTY_NOTICES.txt` is served as a file, and the footer links to it. The file does not exist under `npm run dev`.
- `comments.legal` also keeps notices such as the React and lucide `@license` banners in the JavaScript.
- Known gaps: the `gsap` package ships no license file, so its entry shows the license URL only; `react-remove-scroll-bar` (MIT) ships no license file either; and Tailwind's CSS banner is not kept in minified CSS. Development-only tools are not listed because they are not shipped.

## Maintenance checklist

- **Upgrading GSAP:** read the current license and its effective date first. After building, confirm `grep -l GreenSock dist/assets/*.js` still lists the `gsap-*` and `MotionLab-*` chunks. Update this page and the README if the terms or versions changed.
- **Adding a dependency:** check its license and confirm it appears in `THIRD_PARTY_NOTICES.txt` after a build. Avoid GPL or AGPL packages in the shipped bundle: they would require distributing the site under their terms, which conflicts with this project's license.
- **Adding a GSAP plugin:** every GSAP plugin is free under the same license, but the preview bundles only the three listed above. Keep file headers intact.
- **Changing build or minification options:** rebuild and repeat the banner check.
- **Before a release:** run `npm run build`, open `dist/THIRD_PARTY_NOTICES.txt`, and confirm the footer license links work on the deployed site.

## Sources read on 2026-11-06

- [GSAP Standard "No Charge" License](https://gsap.com/standard-license)
- [GSAP README on GitHub](https://github.com/greensock/GSAP)
- [ScanCode LicenseDB: gsap-standard-no-charge-2025](https://scancode-licensedb.aboutcode.org/gsap-standard-no-charge-2025.html)
- [Vercel: vercel.json rewrites](https://vercel.com/docs/project-configuration/vercel-json), which give the filesystem precedence over rewrites
- [GitHub Terms of Service](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service), which let others view and fork public repositories
- [Choose a License](https://choosealicense.com/licenses/)
