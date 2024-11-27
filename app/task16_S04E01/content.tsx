const content = `
Centrala posiada uszkodzone zdjęcia odzyskane z aparatu cyfrowego. Istnieje szansa, że na niektórych z nich jest Barbara. Nie wiemy, jak wygląda Barbara. Możesz na żywo porozmawiać z automatem działającym w centrali. Automat nie jest zbyt sprytny, ale może Ci pomóc w poprawieniu jakości zdjęć i w naprawianiu ich. Twoim zadaniem jest przygotowanie rysopisu Barbary.

Automat może dla Ciebie poprawić posiadane zdjęcia. Obsługuje on kilka narzędzi:

naprawa zdjęcia zawierającego szumy/glitche

rozjaśnienie fotografii

przyciemnienie fotografii

Oto polecenia, które rozpoznaje automat:

REPAIR NAZWA_PLIKU

DARKEN NAZWA_PLIKU

BRIGHTEN NAZWA_PLIKU

Gdy będziesz mieć już pewność co do wyglądu Barbary, przygotuj jej rysopis w języku polskim. Uwzględnij wszystkie szczegóły ze zdjęć, które pomogą nam ją rozpoznać.

Zadanie nazywa się photos.

API do obróbki zdjęć działa w sposób opisany poniżej i słucha jak zawsze na /report

{
 "task":"photos",
 "apikey":"TWÓJ KLUCZ API",
 "answer":"START"
}
Słowem “START” rozpoczynasz rozmowę z automatem. Przedstawi Ci on cztery fotografie. Niekoniecznie wszystkie z nich przedstawiają Barbarę i nie wszystkie z nich zawierają istotne dla nas szczegóły. Wydaj automatowi polecenia, mówiąc, na którym zdjęciu powinien wykonać jaką operację.
`;

export default content; 