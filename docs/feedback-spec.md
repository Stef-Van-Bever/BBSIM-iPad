# Feedback-spec — OneDrive iPad simulator (SCORM oefeningen) — doelgroep 1e graad (NL)

Dit document beschrijft **gedifferentieerde foutfeedback** voor de OneDrive-iPad-simulator-oefeningen.
Doel: leerlingen krijgen **directe, duidelijke en helpende feedback** zonder frustratie.

## Principes
- **Kort en concreet**: zinnen van max. ±12 woorden.
- **Actietaal**: “tik”, “open”, “kies”, “maak”, “verplaats”, “verwijder”.
- **Mild waar mogelijk**: niet elke fout is “rood/shake”.
- **Altijd oplossingsgericht**: vertel wat er mis is + mini-hint (“kijk naar de mapnaam”, “lees de opdracht”).
- **Consistent**: dezelfde fout → dezelfde stijl/zin.

---

## Feedbacktypes (A–E)

### A — Verkeerde knop (disabled actie)
**Wanneer**
- Leerling tikt op een knop/actie die **zichtbaar maar disabled** is (Zoeken, Delen, Offline, Instellingen, tabs buiten “Mijn bestanden”).
- Leerling kiest in het contextmenu een optie die **niet toegelaten** is voor deze oefening.

**Visueel gedrag**
- **Scherm trilt** kort (±250 ms).
- **Aangeklikte knop** krijgt **rood** (±1000 ms) en **fade** terug.
- **Toast** verschijnt (±2000 ms) en verdwijnt automatisch.

**Toast-tekst (standaard)**
- `❌ Voor deze opdracht heb je deze knop niet nodig`

**Alternatieven (optioneel, roteren)**
- `❌ Deze actie hoort niet bij de opdracht`
- `❌ Probeer een andere knop`

---

### B — Verkeerde plaats (in verkeerde map)
**Wanneer**
- Leerling probeert de juiste actie, maar zit **in een andere map** dan de opdracht vraagt.
- Voorbeelden:
  - Map wordt aangemaakt in verkeerde map.
  - Verwijderen/hernoemen in verkeerde map.
  - Verplaatsen naar verkeerde doelmap.

**Visueel gedrag**
- **Geen schermtrilling** (milder dan type A).
- Highlight **breadcrumb** of **huidige mapnaam** kort in **oranje/geel** (±1000 ms).
- Toast (±2500 ms).

**Toast-tekst (standaard)**
- `⚠️ Je zit niet in de juiste map`

**Extra regel (kleine hulp, 1 seconde later of als tweede regel)**
- `Kijk goed waar je moet zijn`

---

### C — Verkeerd item (niet het juiste bestand / map)
**Wanneer**
- Leerling kiest een ander bestand/map dan degene die in de opdracht staat.
- Voorbeelden:
  - Contextmenu openen op fout item.
  - Hernoemen/verwijderen van fout item.
  - Verplaatsen van fout item.

**Visueel gedrag**
- **Geen schermtrilling** (tenzij actie ook disabled is → type A).
- Highlight van de **rij** van het fout gekozen item in **rood** (±800 ms) met fade.
- Toast (±2500 ms).

**Toast-tekst (standaard)**
- `❌ Dit is niet het juiste bestand`

**Variant voor mappen**
- `❌ Dit is niet de juiste map`

**Extra hulp (optioneel)**
- `Lees de opdracht nog eens`

---

### D — Juiste actie, maar verkeerde naam (spelling/naamgeving)
**Wanneer**
- Leerling maakt een map of hernoemt een item, maar de **naam komt niet overeen** met de doelnaam.
- Belangrijk: dit is vaak een “bijna goed”-fout.

**Visueel gedrag**
- **Geen schermtrilling**.
- Highlight van het **naamveld** in **geel/oranje** (±1200 ms).
- Toast (±3000 ms).

**Toast-tekst (standaard)**
- `✏️ De naam klopt nog niet`

**Extra hulp (tweede regel)**
- `Controleer spelling en hoofdletters`

---

### E — Onvolledige opdracht (je bent nog niet klaar)
**Wanneer**
- Leerling rondt een deelstap correct af, maar er ontbreken nog stappen.
- Voorbeelden:
  - Map “THEMA 1” gemaakt, maar submappen ontbreken.
  - Bestand verplaatst, maar naar verkeerde map of er moet nog een tweede verplaatsing (als oefening dat ooit krijgt).

**Visueel gedrag**
- **Geen schermtrilling**.
- Subtiele highlight van de **instructiebalk** (±900 ms).
- Toast (±2500–3000 ms).

**Toast-tekst (standaard)**
- `👍 Goed begonnen! Je bent nog niet klaar`

**Extra hulp (optioneel)**
- `Kijk wat er nog ontbreekt`

---

## Succesfeedback (VOLTOOID)
**Wanneer**
- Validator bevestigt dat de eindtoestand klopt.

**Visueel gedrag**
- Toast of modal (aanbevolen: modal) met groene check.
- UI wordt “gelocked” (voorkom extra wijzigingen na completion).

**Tekst**
- `✅ Goed gedaan! Je hebt deze opdracht voltooid`

**SCORM 1.2**
- `cmi.core.score.raw = 100`
- `cmi.core.lesson_status = "completed"`
- `LMSCommit("")`

---

## Prioriteit wanneer meerdere fouten tegelijk lijken te gelden
Gebruik deze volgorde:
1. **A** (disabled actie) — altijd eerst
2. **C** (verkeerd item)
3. **B** (verkeerde plaats)
4. **D** (verkeerde naam)
5. **E** (onvolledig)

Voorbeeld: leerling kiest “Delen” in contextmenu op fout bestand → **A**.

---

## Detectieregels (engine guidance)
Deze regels helpen Codex om consistent te detecteren.

### A (disabled)
- clicked element heeft `data-disabled="true"` of action niet in `allowedActions`.

### B (verkeerde plaats)
- actie is toegestaan, maar `currentFolderPath` ≠ `requiredLocation` (uit goal/step).

### C (verkeerd item)
- actie is toegestaan, maar `selectedItem.name` ≠ `expectedItemName` (uit goal/step).

### D (verkeerde naam)
- create/rename uitgevoerd, maar `newName` ≠ `expectedName` (exact match).

### E (onvolledig)
- minstens 1 check in `goal.checks` is true, maar niet allemaal.

---

## Tekstniveau — woordenlijst (aanbevolen)
Gebruik consistente termen:
- “map”, “bestand”, “naam”, “knop”, “drie puntjes (… )”, “verplaatsen”, “verwijderen”
Vermijd:
- “contextmenu”, “modal”, “interface”, “invalid”, “operatie”.

---

## Optioneel: escalatie na herhaalde fouten (voor later)
Niet implementeren zonder beslissing, maar klaar om toe te voegen:
- Na 2× dezelfde fouttype binnen 15s → toon extra hulpzin of highlight de volgende tip.
