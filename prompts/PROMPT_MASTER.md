# Codex master prompt — OneDrive iPad simulator (SCORM 1.2) — 8 oefeningen

## Context
Je bouwt **8 aparte SCORM 1.2 pakketten (ZIP)** die in **Smartschool LMS** draaien op **iPad (Safari + Smartschool webview)**.
Elke oefening simuleert **de OneDrive iPad interface** (lijstweergave) in de browser, in een veilige sandbox (geen echte OneDrive).

**Doelgroep:** leerlingen 1e graad Vlaanderen — beginners  
**UI taal:** Nederlands (BE)  
**Belangrijk:** UI moet zo dicht mogelijk aanvoelen als OneDrive iPad (zie referentie-screenshots in `reference_ui/`).

## Referentie UI (visuele richtlijn)
Gebruik deze screenshots als *stijl- en layoutreferentie* (niet als assets om letterlijk te embedden):
- `reference_ui/onedrive_basic_ui.png` — hoofdscherm “OneDrive / Mijn bestanden”
- `reference_ui/onedrive_+_ui.png` — “Nieuwe toevoegen” sheet (Map / Vastleggen / Uploaden + lijst)
- `reference_ui/onedrive_contextmenu_ui.png` — contextmenu/actie-sheet voor item
- `reference_ui/onedrive_folderpicker_ui.png` — “Verplaatsen naar” folder picker modal

## Functionele oefentypes (4 soorten × 2)
Elke oefening is een eigen SCORM pakket met eigen startstructuur en doel.
1. **Mappen maken** (alleen navigeren + “+” → Map maken)
2. **Hernoemen** (alleen navigeren + “…“ → “Naam van dit bestand wijzigen”)
3. **Verplaatsen** (alleen navigeren + “…“ → Verplaatsen → map-picker)
4. **Verwijderen** (alleen navigeren + “…“ → Verwijderen + confirm)

## Global UX eisen
### Boven de OneDrive UI
- Toon een **instructiebalk** bovenaan met:
  - duidelijke opdrachtzin (1–2 regels max)
  - knop: **“💡 tips”**  
- De OneDrive UI eronder blijft “realistisch” en volledig zichtbaar.

### Tips (hints)
- Bij tik op “💡 tips”: highlight (gele gloed) van de **volgende correcte UI stap**.
- Tips zijn *stapsgewijs*: elke klik toont de volgende stap (max 3–5 stappen).
- Tips mogen niet automatisch klikken; enkel visueel begeleiden.

### Foutfeedback (essentieel)
Wanneer de leerling op een **disabled functie** klikt die niet nodig is voor de oefening:
- het **hele scherm trilt kort** (shake animatie, ~250ms)
- de **aangeklikte knop krijgt 1 seconde rode kleur**, fade terug naar normaal
- toon een toast/bericht: **“❌ Voor deze opdracht heb je deze knop niet nodig”** (verdwijnt na 2s)

### Succesfeedback
Wanneer de eindtoestand klopt:
- toon modal/toast: **“✅ Goed gedaan! Je hebt deze opdracht voltooid”**
- zet SCORM 1.2: `cmi.core.score.raw = 100` en `cmi.core.lesson_status = "completed"` en commit.

## Disabled vs toegestaan
### Altijd beschikbaar
- navigeren: map openen (tap), terugpijl, breadcrumbs
- sorteren (mag, maar hoeft niet voor oplossing)
- contextmenu openen en bekijken mag altijd (via …)

### Altijd tonen, maar disabled met foutfeedback
- Zoeken (zoekbalk)
- Delen
- Offline beschikbaar maken
- Instellingen
- Tabs: Startpagina, Bibliotheken, Gedeeld, Media, Offline (zichtbaar maar disabled)

### Contextmenu opties
- Toon de realistische opties, maar enable alleen wat nodig is voor het oefentype.
- Disabled contextmenu-items moeten dezelfde foutfeedback geven als hierboven.

## Technische eisen
- **SCORM 1.2** compatibel (Smartschool). Geen externe dependencies/CDN.
- Werkt in iPad Safari + webview: gebruik plain HTML/CSS/JS (liefst geen zware frameworks).
- Responsive voor iPad landscape; ondersteunt ook portrait zonder breken.
- Geen fullscreen-API vereisen.
- Geen echte Microsoft/OneDrive branding of logo’s. Wel “lookalike” UI met eigen SVG icons.

## Architectuur (verplicht)
Bouw **1 gedeelde UI/engine codebase** en laat configuratie per oefening bepalen:
- startstructuur (virtueel bestandssysteem)
- toegestane acties
- doeltoestand (validator)
- tekst instructie
- tips-stappen

Output: **8 mappen** (één per oefening) met elk een SCORM ZIP build.

## Virtueel bestandssysteem (VFS)
- Representatie in JS (tree met folders/files).
- Realistische bestandsnamen (schoolcontext), realistische iconen per type (Word/Excel/PDF/Foto).
- Operaties:
  - createFolder(parentId, name)
  - renameItem(itemId, newName)
  - moveItem(itemId, targetFolderId)
  - deleteItem(itemId)
- UI refresh + persist in memory (geen server).

## UI componenten die je moet bouwen
1. **Bestandenlijst view** (folders + files) met kolommen: Naam, Gewijzigd op, Formaat, Selecteren
2. **Top header** met titel “OneDrive” + tabs (disabled behalve Mijn bestanden)
3. **Zoekbalk** (disabled)
4. **Floating + knop** die “Nieuwe toevoegen” sheet opent
5. **Nieuwe toevoegen sheet** (Map/Vastleggen/Uploaden + lijst van filetypes, disabled behalve Map in map-oefeningen)
6. **Contextmenu sheet** (zoals screenshot) geopend via … per item
7. **Rename dialog** (iOS-style) — minimalistisch, maar duidelijk
8. **Delete confirm dialog** (iOS-style)
9. **Folder picker modal** voor Verplaatsen

## Beoordeling (validator)
Elke oefening heeft een **doeltoestand**. Zodra de toestand correct is:
- successfeedback tonen
- SCORM completion + score = 100

## Deliverables
Je werkt in de repository structuur zoals in `prompts/REPO_STRUCTURE.md`.
Je levert:
- `dist/` met 8 SCORM ZIP’s
- broncode in `src/`
- configs in `exercises/`
- een korte `BUILD.md` hoe opnieuw te builden.

---

# Uitvoering voor Codex
1) Lees de repository structuur en bestaande templates.
2) Genereer de shared engine + UI in `src/`.
3) Genereer 8 oefening-configs (realistisch, verschillend).
4) Genereer build script dat 8 SCORM zip’s produceert (één per oefening).
5) Voeg een simpele lokale dev-server instructie toe (optioneel).

**Belangrijk:** gebruik de referentie screenshots alleen als *stijlreferentie*.
