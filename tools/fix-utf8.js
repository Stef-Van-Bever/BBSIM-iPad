const fs = require("fs");
const path = require("path");

const roots = ["exercises", "config_templates", "src"];
const exts = new Set([".json", ".js", ".html", ".css", ".md"]);

const mojibakeRe = /ðŸ|â€“|â€™|â€œ|â€|â€¦|Â|Ã/;

function fixText(text) {
  if (!mojibakeRe.test(text)) return text;
  return Buffer.from(text, "latin1").toString("utf8");
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!exts.has(path.extname(entry.name))) continue;
    const original = fs.readFileSync(full, "utf8");
    const fixed = fixText(original);
    if (fixed !== original) {
      fs.writeFileSync(full, fixed, "utf8");
      console.log(`fixed ${full}`);
    }
  }
}

for (const root of roots) {
  const full = path.join(__dirname, "..", root);
  if (fs.existsSync(full)) walk(full);
}
