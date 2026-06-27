const fs = require('fs');
const path = require('path');

const root = 'H:\\Kellogg\\webApp-astro\\src\\core';
const typesFile = path.join(root, 'types.ts');

function walk(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else if (/\.(ts|tsx|astro|mjs|js)$/.test(entry.name)) cb(full);
  }
}

function relativeTo(from, to) {
  const rel = path.relative(path.dirname(from), to).replace(/\\/g, '/');
  return rel.startsWith('.') ? rel : './' + rel;
}

const typesImport = relativeTo(typesFile, typesFile).replace(/\.ts$/, '') === 'types'
  ? './types'
  : relativeTo(typesFile, typesFile).replace(/\.ts$/, '');

walk(root, (file) => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  const relTypes = removeExt(relativeTo(file, typesFile));

  content = content.replace(/from\s+['"]\.\.\/types['"]/g, `from '${relTypes}'`);
  content = content.replace(/from\s+['"]\.\.\/types\/([^'"]+)['"]/g, `from '${relTypes}'`);
  content = content.replace(/import\s+type\s+\{[^}]*\}\s+from\s+['"]\.\.\/types['"]/g, `from '${relTypes}'`);

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', path.relative('H:\\Kellogg\\webApp-astro\\src', file));
  }
});

function removeExt(p) {
  return p.replace(/\.(ts|tsx|astro|mjs|js)$/, '');
}
