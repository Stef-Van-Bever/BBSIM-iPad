const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const exercisesDir = path.join(root, "exercises");
const distDir = path.join(root, "dist");
const srcDir = path.join(root, "src");
const templateDir = path.join(root, "scorm_template");

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

const launchTemplate = fs.readFileSync(path.join(templateDir, "launch.html.template"), "utf8");
const manifestTemplate = fs.readFileSync(path.join(templateDir, "imsmanifest.xml.template"), "utf8");

const exerciseFiles = fs.readdirSync(exercisesDir).filter(f => f.startsWith("ex") && f.endsWith(".json"));

for (const file of exerciseFiles) {
  const exId = path.basename(file, ".json");
  const config = JSON.parse(fs.readFileSync(path.join(exercisesDir, file), "utf8"));
  const outDir = path.join(distDir, exId);
  const assetsDir = path.join(outDir, "assets");
  const outExercisesDir = path.join(outDir, "exercises");

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(assetsDir, { recursive: true });
  fs.mkdirSync(outExercisesDir, { recursive: true });

  copyRecursive(srcDir, assetsDir);
  fs.mkdirSync(outExercisesDir, { recursive: true });
  fs.copyFileSync(path.join(exercisesDir, file), path.join(outExercisesDir, file));

  const title = config.title || exId;
  const launchHtml = launchTemplate
    .replaceAll("{{EXERCISE_ID}}", exId)
    .replaceAll("{{TITLE}}", title);
  const manifest = manifestTemplate
    .replaceAll("{{EXERCISE_ID}}", exId)
    .replaceAll("{{TITLE}}", title);

  fs.writeFileSync(path.join(outDir, "index.html"), launchHtml, "utf8");
  fs.writeFileSync(path.join(outDir, "imsmanifest.xml"), manifest, "utf8");

  console.log(`Built ${exId} (folder only)`);
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}
