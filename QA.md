# QA Checklist

Deze checklist is bedoeld voor snelle, consistente QA per oefening.

## Basisflow (voor elke oefening)
1. Startstructuur klopt en is realistisch.
2. Navigatie werkt (map openen, terugknop).
3. Verboden acties geven type A feedback.
4. Verkeerde map geeft type B feedback.
5. Verkeerd item geeft type C feedback.
6. Verkeerde naam geeft type D feedback.
7. Juiste stap geeft 0,5s groene bevestiging.
8. Tips tonen enkel de huidige stap, nooit vooruit.
9. Partial feedback (type E) bij deelresultaten.
10. Completion toont succes en SCORM wordt gezet.

## Snelle regressie
1. Ex01 volledig correct doorlopen.
2. Ex02 deelstap correct, check partial feedback.
3. Ex03 1x fout item + 1x correct rename.
4. Ex05 1x fout map + 1x correct move.
5. Ex07 1x fout item + 1x correct delete.

## QA Mode
Gebruik `?qa=1` in de URL om live status te zien:
1. Current path en geselecteerd item.
2. Volgende tiptarget.
3. Checkstatus per goal.
