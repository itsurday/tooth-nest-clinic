// Copies partials/*.html into every page between markers, so shared markup stays identical:
//   <!-- @partial header -->  ...replaced...  <!-- @end header -->
// Also marks the current page's nav link with aria-current="page".
// Run from the repo root after editing a partial: node tools/sync-partials.cjs
// shortcut: a hand-run copy step instead of a build; switch to a real include/build step if the site passes ~15 pages.
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const partials = Object.fromEntries(
  fs.readdirSync(path.join(root, 'partials')).map(f => [path.basename(f, '.html'), fs.readFileSync(path.join(root, 'partials', f), 'utf8')]),
);
const pages = fs.readdirSync(root).filter(f => f.endsWith('.html'));

let failed = false;
for (const page of pages) {
  const file = path.join(root, page);
  const before = fs.readFileSync(file, 'utf8');
  const href = page === 'index.html' ? '/' : `/${page}`;
  const after = before.replace(/<!-- @partial (\w+) -->\n[\s\S]*?<!-- @end \1 -->/g, (match, name) => {
    if (!(name in partials)) { console.error(`${page}: unknown partial "${name}"`); failed = true; return match; }
    let body = partials[name];
    if (name === 'header') body = body.replace(`<a href="${href}">`, `<a href="${href}" aria-current="page">`);
    return `<!-- @partial ${name} -->\n${body}<!-- @end ${name} -->`;
  });
  if (after !== before) { fs.writeFileSync(file, after); console.log(`updated ${page}`); }
}
process.exitCode = failed ? 1 : 0;
