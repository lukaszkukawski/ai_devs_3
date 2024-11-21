const content = `
Musisz pomóc nam namierzyć Barbarę! Zdobyliśmy dostęp do dwóch systemów, które mogą nam w tym pomóc.

Pierwszy z nich to wyszukiwarka członków ruchu oporu. Możemy wyszukiwać ich z użyciem imienia podanego w formie mianownika, a w odpowiedzi otrzymamy listę miejsc, w których ich widziano.

https://XXX/people

Drugi system to wyszukiwarka miejsc odwiedzonych przez konkretne osoby. Podajesz nazwę miasta do sprawdzenia (bez polskich znaków) i w odpowiedzi dowiadujesz się, których z członków ruchu oporu tam widziano.

https://XXX/places

Interfejs dla obu systemów wygląda tak samo. Przyjmuje on zapytanie w formacie JSON jak poniżej:

{
 "apikey":"TWÓJ KLUCZ",
 "query": "IMIE lub MIASTO"
}
Niestety, przy obu systemach ktoś majstrował i dane zwracane przez nie mogą być niekompletne. Musisz jednak poradzić sobie z tym, co masz.

Zdobyliśmy także część notatki na temat Barbary, pochodząca z systemu zbierającego informacje o osobach poszukiwanych.

https://XXX/barbara.txt

Połącz wszystkie dane w jedną całość i uzupełnij brakujące informacje. Kto był współpracownikiem Aleksandra i Barbary? Z kim widział się Rafał? Być może znalezienie informacji na ten temat pozwoli nam wytypować kolejne miejsce, w którym warto poszukać Barbary.

`;

export default content; 