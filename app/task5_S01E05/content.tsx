const content = `
Musisz przygotować system do cenzury danych agentów. Pobierz dane z pliku:

https://XXX/data/KLUCZ/cenzura.txt

a następnie ocenzuruj imię i nazwisko, wiek, miasto i ulicę z numerem domu tak, aby zastąpić je słowem CENZURA. Odpowiedź wyślij do:

https://XXX/report

w formacie, który znasz już z poligonu. Jeśli potrzebujesz pomocy, zbadaj nagłówki HTTP wysyłane razem z plikiem TXT. Uwaga! Dane w pliku TXT zmieniają się co 60 sekund i mogą być różne dla każdego z agentów w tej samej chwili. Nazwa zadania w API to “CENZURA”.
`;

export default content; 