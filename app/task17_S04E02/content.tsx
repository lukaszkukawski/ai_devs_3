const content = `
Pobierz próbkę wyników badań, które otrzymaliśmy i na podstawie danych referencyjnych (poprawnych i niepoprawnych) zdecyduj, którym wynikom możemy zaufać. 
Wyślij do centrali w standardowy sposób tylko dwucyfrowe identyfikatory (są na początku linii z każdą próbką) poprawnych badań. 
Pomiń te, które wykryjesz jako sfałszowane. Wierzymy, że w 2024 roku w wykryciu takich anomalii może pomóc Ci technika zwana fine-tuningiem modeli językowych. 
Możesz jednak to zadanie wykonać w dowolny sposób, który doprowadzi Cię do rozwiązania. Nazwa zadania do raportu to ‘research’. 
https://XXX/dane/lab_data.zip

Oczekiwany format raportu w polu ‘answer’ (same dwucyfrowe wartości!).

[
  'identyfikator-01',
  'identyfikator-02',
  'identyfikator-03',
  'identyfikator-0N',
]
`;

export default content; 