# Acceptatiecriteria (Definition of Done)

## Algemeen
- [ ] Werkt in iPad Safari + Smartschool webview (touch friendly)
- [ ] Geen externe CDN’s; alles in het ZIP
- [ ] UI voelt als OneDrive iPad lijstweergave (tabs, kolommen, …, +)
- [ ] Instructiebalk bovenaan met “💡 tips”
- [ ] Tips highlighten de volgende juiste UI stap (gele gloed)
- [ ] Disabled klik → shake + rode highlight (1s) + toast (2s)

## SCORM 1.2
- [ ] `LMSInitialize("")` op load
- [ ] bij succes: `cmi.core.score.raw=100`, `cmi.core.lesson_status="completed"`, `LMSCommit("")`
- [ ] `LMSFinish("")` bij unload (best effort)

## Oefening-specifiek
- [ ] Alleen de toegestane actie(s) zijn enabled (naast navigatie)
- [ ] Contextmenu kan altijd open; items die niet mogen zijn disabled met foutfeedback
- [ ] Doeltoestand wordt correct gedetecteerd
- [ ] Succesbericht verschijnt exact eenmaal en voorkomt verdere edits (lock state)
