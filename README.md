# Codex prompt pack — OneDrive iPad SCORM oefeningen

Dit ZIPje bevat:
- `prompts/` → master prompt + schema’s + acceptatiecriteria + repo-structuur
- `exercise_specs/` → 8 korte oefening-briefs
- `config_templates/` → 8 JSON-skeletten die Codex moet invullen/uitwerken
- `reference_ui/` → jouw OneDrive iPad screenshots (stijlreferentie)

## Hoe te gebruiken met Codex (aanpak)
1. Maak een nieuwe repo/folder `onedrive-scorm-simulator/` aan volgens `prompts/REPO_STRUCTURE.md`.
2. Geef Codex eerst `prompts/PROMPT_MASTER.md` (als systeem/hoofdprompt).
3. Geef daarna per oefening:
   - `exercise_specs/ex0X.md`
   - `config_templates/ex0X.json`
   - laat Codex die JSON’s uitwerken (realistische startTree, goal.checks, tips)
4. Laat Codex daarna de code genereren in `src/` + buildscript naar `dist/`.

Tip: laat Codex eerst **1 oefening end-to-end** bouwen (bv. ex01) en pas daarna uitbreiden naar 8.
