const content = `
Uzyskaliśmy dostęp do bazy danych firmy BanAN. Centrala wystawiła dla Ciebie specjalne API, które umożliwi Ci wykonanie niemal dowolnych zapytań wyciągających dane ze wspomnianej bazy. Wiemy, że znajdują się tam tabele o nazwach users, datacenters oraz connections. Niekoniecznie potrzebujesz teraz wszystkich z nich. Twoim zadaniem jest zwrócenie nam numerów ID czynnych datacenter, które zarządzane są przez menadżerów, którzy aktualnie przebywają na urlopie (są nieaktywni). To pozwoli nam lepiej wytypować centra danych bardziej podatne na atak. Nazwa zadania to database.

API do zapytań do bazy danych https://XXX/apidb

Struktura zapytania - w odpowiedzi otrzymasz JSON-a z danymi

{
    "task": "database",
    "apikey": "Twój klucz API",
    "query": "select * from users limit 1"
}


Poza typowymi selectami przydatne mogą być polecenia:

show tables = zwraca listę tabel

show create table NAZWA_TABELI = pokazuje, jak zbudowana jest konkretna tabela


`;

export default content; 