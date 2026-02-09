# Repository structuur voor Codex

> Doel: Codex werkt in deze folder en genereert broncode + 8 SCORM packages.

## Aanbevolen structuur

```
onedrive-scorm-simulator/
  README.md
  BUILD.md
  package.json               (optioneel: alleen als je een build-script gebruikt)
  dist/                      (output: 8 SCORM zip’s)
    ex01_map_1.zip
    ex02_map_2.zip
    ex03_rename_file.zip
    ex04_rename_folder.zip
    ex05_move_root.zip
    ex06_move_nested.zip
    ex07_delete_root.zip
    ex08_delete_nested.zip

  src/                       (gedeelde codebase)
    index.html               (app shell)
    app.css
    app.js                   (router + init)
    scorm12.js               (SCORM 1.2 wrapper)
    vfs.js                   (virtueel bestandssysteem)
    ui/
      components.js          (sheet/modal/toast)
      icons/                 (eigen SVG iconen)
      styles.css             (OneDrive lookalike tokens)
    exercises/
      loader.js              (laadt exercise config)

  exercises/                 (8 oefening-configs)
    ex01.json
    ex02.json
    ...
    ex08.json

  scorm_template/            (SCORM skeleton om te kopiëren per oefening)
    imsmanifest.xml.template
    launch.html.template     (laadt src + juiste config)
    scormdriver.js           (optioneel, als je een driver gebruikt)

  tools/
    build.js                 (maakt 8 output folders + zip)
    zip.js                   (helper)
```

## Belangrijke keuzes
- **Geen CDN**: bundel alles lokaal.
- **Per oefening**: een eigen `launch.html` + `imsmanifest.xml` die de juiste config laadt.
- Shared code (`src/`) wordt **gekopieerd** of **gepackaged** in elke oefening outputmap zodat elk ZIP zelfstandig is.

## Minimale SCORM 1.2 bestanden per oefening (in de ZIP)
```
/ (root)
  imsmanifest.xml
  index.html        (launch)
  assets/...        (js/css/svg)
```

## Mapping config → oefening
- `index.html` leest `window.EXERCISE_ID` of `?ex=ex01` en laadt `exercises/ex01.json`.
- Validator gebruikt config `goal` om completion te bepalen.
