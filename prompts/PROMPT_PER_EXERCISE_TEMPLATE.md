# Per-oefening prompt template (gebruik 8×)

Kopieer dit prompt en vul de placeholders in, of laat Codex ze invullen op basis van `exercises/ex0X.json`.

## Prompt
Je genereert/werkt aan **SCORM oefening {EXERCISE_ID}**.

### Oefening metadata
- ID: {EXERCISE_ID}
- Type: {TYPE}  (create_folder | rename | move | delete)
- Instructietekst (bovenaan): {INSTRUCTION_NL}

### Startstructuur (VFS)
Gebruik de `startTree` uit `exercises/{EXERCISE_ID}.json`.

### Toegestane acties
Gebruik `allowedActions` uit config:
- Navigeren altijd OK.
- Alleen de acties die in config staan zijn enabled; alle andere UI elementen blijven zichtbaar maar disabled met foutfeedback.

### Doeltoestand
Gebruik `goal` uit config. Zodra voldaan:
- toon succesfeedback
- SCORM 1.2: score 100, status completed.

### Tips
Gebruik `tips[]` uit config.
Elke klik op “💡 tips” highlight de volgende stap (gele gloed).

### Extra eisen
- UI lookalike OneDrive iPad lijstweergave.
- Contextmenu open via … naast item.
- Disabled clicks → shake + rood + toast tekst.
