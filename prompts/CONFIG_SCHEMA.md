# Config schema (exercises/ex0X.json)

Doel: alle oefeningen zijn data-gedreven zodat de UI/engine herbruikbaar is.

## JSON structuur

```json
{
  "id": "ex01",
  "title": "Mappen maken 1",
  "type": "create_folder",
  "instruction": "Maak in de map "02 - PROJECTEN" een nieuwe map met de naam "WISKUNDE".",
  "ui": {
    "language": "nl-BE",
    "startLocation": "mijn_bestanden",
    "listView": true
  },
  "startTree": {
    "rootId": "root",
    "items": [
      { "id": "f1", "kind": "folder", "name": "01 - LESOPDRACHT", "parentId": "root", "modified": "2024-08-29", "size": "349,3 MB" },
      { "id": "f2", "kind": "folder", "name": "02 - PROJECTEN", "parentId": "root", "modified": "2023-09-28", "size": "2,05 GB" },
      { "id": "file1", "kind": "file", "name": "planning.docx", "parentId": "f2", "modified": "2025-01-10", "size": "42 KB", "fileType": "word" }
    ]
  },
  "allowedActions": {
    "createFolder": true,
    "rename": false,
    "move": false,
    "delete": false
  },
  "goal": {
    "type": "create_folder",
    "checks": [
      { "op": "folderExists", "parentName": "02 - PROJECTEN", "name": "WISKUNDE" }
    ]
  },
  "tips": [
    { "target": "tabMijnBestanden", "text": "Je zit al in Mijn bestanden. Goed!" },
    { "target": "folderRow:02 - PROJECTEN", "text": "Open eerst de map 02 - PROJECTEN." },
    { "target": "fabPlus", "text": "Tik op de blauwe + knop om iets nieuws toe te voegen." },
    { "target": "sheetNewAdd:Map", "text": "Kies Map." },
    { "target": "dialogNewFolder:nameInput", "text": "Typ de naam en bevestig." }
  ]
}
```

## Target selectors (tips)
Voor de `target` velden verwacht de UI engine een selector key:
- `tabMijnBestanden`
- `fabPlus`
- `searchBar`
- `folderRow:<NAME>`
- `fileRow:<NAME>`
- `itemMore:<NAME>` (… knop bij item)
- `contextAction:Verplaatsen`
- `contextAction:NaamWijzigen`
- `contextAction:Verwijderen`
- `folderPickerRow:<NAME>`
- `dialogNewFolder:nameInput`
- `dialogRename:nameInput`
- `dialogConfirm:delete`

Codex moet in de UI code zorgen dat deze targets bestaan.

## Goal checks (validator)
Ondersteun minimaal:
- `folderExists(parentName, name)`
- `fileRenamed(oldName, newName)`
- `folderRenamed(oldName, newName)`
- `itemMoved(itemName, fromParentName?, toParentName)`
- `itemDeleted(itemName, parentName?)`

Validator mag op naam matchen (case-sensitive tenzij anders gespecificeerd).
