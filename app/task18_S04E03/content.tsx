const content = `
Zadanie: Wiemy już, że oprogramowanie do fabryk i magazynów robotów realizuje firma SoftoAI. Firm tego typu jest znacznie więcej. 
Centrala poprosiła Cię numerze piąty o przygotowanie uniwersalnego mechanizmu do poszukiwania informacji na takich stronach. 
Aby sprawdzić, czy Twój mechanizm działa zgodnie z oczekiwaniami, odpowiedz proszę na pytania centrali:

https://XXX/data/TUTAJ-KLUCZ/softo.json

Wszystkie informacje znajdziesz na stronie firmy SoftoAI:

https://XXX.XXX.org

Odpowiedzi wyślij do /report, w polu ‘answer’, w takiej samej formie, w jakiej centrala udostępniła pytania. Nazwa zadania to softo.

Oczekiwany format odpowiedzi:

{
    "01": "zwięzła i konkretna odpowiedź na pierwsze pytanie",
    "02": "zwięzła i konkretna odpowiedź na drugie pytanie",
    "03": "zwięzła i konkretna odpowiedź na trzecie pytanie"
}

`;

export default content; 