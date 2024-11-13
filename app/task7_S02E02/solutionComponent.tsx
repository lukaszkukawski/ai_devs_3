"use client";

import OpenAI from "openai";
import { Button, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import React, { useState } from 'react';

function SolutionComponent() {
    const [postResult, setPostResult] = useState<string | null>(null);
    const [loadingAI, setLoadingAI] = useState<boolean>(false);
    const openai = new OpenAI({
        apiKey: process.env['NEXT_PUBLIC_OPENAI_API_KEY'],
        dangerouslyAllowBrowser: true
    });

    async function sendImages() {
        setLoadingAI(true);
        const files: (File | undefined)[] = [
            (document.getElementById("file1") as HTMLInputElement)?.files?.[0],
            (document.getElementById("file2") as HTMLInputElement)?.files?.[0],
            (document.getElementById("file3") as HTMLInputElement)?.files?.[0],
        ];
        const prompt = (document.getElementById("prompt") as HTMLInputElement)?.value;

        if (files.some(file => !file) || !prompt) {
            alert("Wybierz wszystkie cztery obrazy i podaj prompt.");
            return;
        }

        try {
            const imagesBase64 = await Promise.all(files.map(file => encodeFileToBase64(file)));
            const messages = [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt,
                        },
                        ...imagesBase64.map(base64Image => ({
                            "type": "image_url",
                            "image_url": {
                                "url": `data:image/jpeg;base64,${base64Image}`
                            }
                        }))
                    ]
                }
            ];

            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: messages
            });

            //const result = await response.json();
            const result = response.choices[0].message.content || ''
            setPostResult(JSON.stringify(result, null, 2));
            setLoadingAI(false);
        } catch (error) {
            setPostResult(`Błąd: ${error.message}`);
        }
    }

    // Funkcja do kodowania plików jako base64
    function encodeFileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string).split(",")[1]);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }


    return (
        <div>
            <h2>Rozwiązanie zadania</h2>

            <Typography variant="h6">Wybierz cztery pliki graficzne z mapami miast:</Typography>
            <form id="upload-form">
                <input type="file" id="file1" accept="image/*" /><br /><br />
                <input type="file" id="file2" accept="image/*" /><br /><br />
                <input type="file" id="file3" accept="image/*" /><br /><br />
                <input type="file" id="file4" accept="image/*" /><br /><br />
                <TextField
                    id="prompt"
                    multiline
                    fullWidth
                    minRows={4}
                    defaultValue="Jesteś ekspertem w dziedzinie geografii, topografii, architektury i historii Polski. Na podstawie wysłanych map z intereptuj do jakich miast odnosi się fragment map z pliku. Dla każdego pliku zwróć nazwę miasta. Przesyłam 4 pliki, 3 z nich odnosie się do jednego miasta, a jeden plik do innego, weź to pod uwagę. Zwracaj uwagę na szczegóły, nazwy ulic i jakies elementy szczególne.
        W szukanym mieście znajdują się albo znajdowały się spichlerze i twierdze, to nie Toruń i nie Bydgoszcz. W tagu <THINKING> umieść krok po kroku w jaki sposób dochodzisz do odpowiedzi. W jaki sposób analizujesz mapy co z nich odczytuje i jakie miasta bierzesz pod uwagę  <RESULT> wypisz plik1 = NAZWA; plik2=Nazwa"
                /><br /><br />
                <Button variant="contained" onClick={sendImages}>
                    {loadingAI ? <CircularProgress size={24} /> : 'Wyślij obrazy'}
                    
                </Button>
            </form>

            <Typography variant="h6">Odpowiedź AI:</Typography>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {postResult ? postResult : 'Brak danych'}
                </Typography>
            </Paper>

        </div>
    );
}

export default SolutionComponent;