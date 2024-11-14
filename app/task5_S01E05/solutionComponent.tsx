"use client";

import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { genSimpleAnswerFromAiWithSystem } from '../lib/genSimpleAnswerFromAi';

function SolutionComponent() {
    const [dataArray, setDataArray] = useState<string>("");
    const [correctedDataArray, setCorrectedDataArray] = useState<string>("");
    const [postResult, setPostResult] = useState<any>(null);
    const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
    const [loadingCorrect, setLoadingCorrect] = useState<boolean>(false);
    const [loadingAI, setLoadingAI] = useState<boolean>(false);
    const [loadingPost, setLoadingPost] = useState<boolean>(false);
    const [aiConversation, setaiConversation] = useState<string[]>([]);

    const fetchTxtFile = async () => {
        setLoadingFetch(true);
        try {
            const data = await fetch('/api/S01E05');
            const jsonData = await data.json();
            setDataArray(jsonData["text"]);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        } finally {
            setLoadingFetch(false);
        }
    };
    const generateAIAnswers = async () => {
        try {
            const answer = await genSimpleAnswerFromAiWithSystem(dataArray, "Każde zdanie, które otrzymasz, poddaj cenzurze. Zastąp każde wystąpienie imienia, nazwiska, wieku, miasta, ulicy oraz numeru domu słowem 'CENZURA'. Twoim zadaniem jest zamienić wprowadzone dane na słowo 'CENZURA' niezależnie od kontekstu."); // Wywołanie funkcji AI
            setCorrectedDataArray(answer?.replaceAll("CENZURA CENZURA", "CENZURA") || "")
        } catch (error) {
            console.error('Error getting answer from AI:', error);
            return "Błąd uzyskiwania odpowiedzi";
        }
    }

    const generateAIAnswersOLLAMA = async () => {
        setLoadingAI(true);
        try {
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "model": "llama2:7b",
                    "prompt": dataArray,
                    "stream": false,
                    "system": "Zastąp każde wystąpienie imienia, nazwiska, wieku, miasta, ulicy oraz numeru domu słowem 'CENZURA', jeżeli imie i nazwisko jest obok siebie i nie rozdziela żadnek znak umieśc jedno słowo CENZURA, tak samo rób z innym isłowami. Przykład do poddania cenzurze: \"Imię: Paweł, Nazwisko: Zieliński, Miasto: Warszawa, Ulica: Piękna 5, Wiek: 28 lat.\""
                }),
            });

            const result = await response.json();
            //setCorrectedDataArray([result.response]); // Przykład ustawienia wyniku
        } catch (error) {
            console.error('Error generating AI answers:', error);
        } finally {
            setLoadingAI(false);
        }
    };



    const sendPostData = async () => {
        setLoadingPost(true);
        try {
            const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_REPORT;
            if (!endpoint) {
                throw new Error('Environment variable NEXT_PUBLIC_ENDPOINT_REPORT is not defined');
            }
            const response = await fetch(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    "task":"CENZURA",
                    "apikey": process.env.NEXT_PUBLIC_AI_DEVS_API_KEY,
                    "answer": correctedDataArray
                })
                
            });
            console.log("response", response)
            // const result = await response.json();
            // setPostResult(result);

        } catch (error) {
            console.error('Error sending post data:', error);
            setPostResult({ error: 'Błąd wysyłania danych' });
        } finally {
            setLoadingPost(false);
        }
    };

    return (
        <div>
            <h2>Rozwiązanie zadania</h2>
            <Button variant="contained" onClick={fetchTxtFile} disabled={loadingFetch}>
                {loadingFetch ? <CircularProgress size={24} /> : 'Pobierz dane'}
            </Button>

            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Pobrane dane:</Typography>
                <TextField
                    multiline
                    fullWidth
                    minRows={4}
                    maxRows={10}
                    value={dataArray ? dataArray : 'Kliknij button aby pobrać treść pliku'}
                    InputProps={{
                        readOnly: true,
                    }}
                    variant="outlined"                                                                                                              
                />                                                                                                                                                  
            </Paper>


            <Button variant="contained" onClick={generateAIAnswers} disabled={loadingAI || dataArray.length === 0} sx={{ marginTop: 2 }}>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                {loadingAI ? <CircularProgress size={24} /> : 'Zaszyfruj dane'}
            </Button>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Odpowiedź od AI:</Typography>                                                                                                                                                                                                                                                                                  
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {correctedDataArray.length > 0 ? correctedDataArray : 'Brak odpowiedzi'}
                </Typography>
            </Paper>


            <Button variant="contained" onClick={sendPostData} disabled={loadingPost || correctedDataArray.length === 0} sx={{ marginTop: 2 }}>
                {loadingPost ? <CircularProgress size={24} /> : 'Wysyłam rozwiązanie zadania'}
            </Button>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Wynik POST:</Typography>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {postResult ? postResult : 'Brak danych'}
                </Typography>
            </Paper>
        </div>
    );
}

export default SolutionComponent;