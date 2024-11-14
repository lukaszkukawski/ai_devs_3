const content = `
Zdobyliśmy dostęp do danych z fabryki, którą nam wskazałeś. Są to raporty dzienne kilku działających tam oddziałów. 
Część z nich to zwykłe raporty techniczne, a część to raporty związane z bezpieczeństwem. 
Pozyskane dane są w różnych formatach i nie wszystkie zawierają użyteczne dane. 
Wydobądź dla nas proszę tylko notatki zawierające informacje o schwytanych ludziach lub o śladach ich obecności oraz o naprawionych usterkach hardwarowych (pomiń te związane z softem oraz pomiń katalog z faktami). 
Raport wyślij do zadania “kategorie” w formie jak poniżej. Pliki powinny być posortowane alfabetycznie.

Oto dane źródłowe: https://XXXX/dane/XXX.zip

{
  "people": ["plik1.txt", "plik2.mp3", "plikN.png"],
  "hardware": ["plik4.txt", "plik5.png", "plik6.mp3"],
}
`;

export default content; 