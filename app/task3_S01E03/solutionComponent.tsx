"use client";

import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { genSimpleAnswerFromAi } from '../lib/genSimpleAnswerFromAi';

function SolutionComponent() {
    const [dataArray, setDataArray] = useState<string[]>([]);
    const [incorrectData, setIncorrectData] = useState<string[]>([]);
    const [postResult, setPostResult] = useState<any>(null);
    const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
    const [loadingCorrect, setLoadingCorrect] = useState<boolean>(false);
    const [loadingAI, setLoadingAI] = useState<boolean>(false);
    const [loadingPost, setLoadingPost] = useState<boolean>(false);
    const [aiConversation, setaiConversation] = useState<string[]>([]);

    const fetchJSON = async () => {
        setLoadingFetch(true);
        try {
            const data = await fetch('/api/S01E03');
            const jsonData = await data.json();
            setDataArray(jsonData["test-data"]);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        } finally {
            setLoadingFetch(false);
        }
    };

    const correctData = () => {
        setLoadingCorrect(true);
        const correctedData = dataArray.map((item: any) => {
            const [num1, num2] = item.question.split(' + ').map(Number);
            if (num1 + num2 !== item.answer) {
                console.log('Błąd question:', item.question);
                console.log('Błąd answer:', item.answer);
                item.answer = num1 + num2; // Poprawienie wyniku
                return item;
            }
            return null;
        }).filter(item => item !== null);

        setIncorrectData(correctedData);
        setLoadingCorrect(false);
    };

    const generateAIAnswers = async () => {
        setLoadingAI(true);
        try {
            const updatedData = await Promise.all(dataArray.map(async (item: any) => {
                if (item.test && item.test.q) {
                    item.test.a = await getAnswerFromAI(item.test.q); // Uzyskanie odpowiedzi od AI
                    setaiConversation(prev => [...prev, `Question: ${item.test.q} \n\n\r Answer: ${item.test.a}`]);
                }
                return item;
            }));
    
            setDataArray(updatedData);
        } catch (error) {
            console.error('Error generating AI answers:', error);
        } finally {
            setLoadingAI(false);
        }
    };

    const getAnswerFromAI = async (question: string): Promise<string> => {
        try {
            const answer = await genSimpleAnswerFromAi(question); // Wywołanie funkcji AI
            return answer || "";
        } catch (error) {
            console.error('Error getting answer from AI:', error);
            return "Błąd uzyskiwania odpowiedzi";
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
                    "task":"JSON",
                    "apikey": process.env.NEXT_PUBLIC_AI_DEVS_API_KEY,
                    "answer": {
                        "apikey": process.env.NEXT_PUBLIC_AI_DEVS_API_KEY,
                        "description": "This is simple calibration data used for testing purposes. Do not use it in production environment!",
                        "copyright": "Copyright (C) 2238 by BanAN Technologies Inc.",
                        "test-data": dataArray
                    }
                })
            });
            setPostResult(response);
            // const response = await fetch('/api/S01E03', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(dataArray),
            // });
    
            // if (!response.ok) {
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }
    
            // const result = await response.text();
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
            <Button variant="contained" onClick={fetchJSON} disabled={loadingFetch}>
                {loadingFetch ? <CircularProgress size={24} /> : 'Pobierz dane'}
            </Button>

            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Pobrane dane:</Typography>
                <TextField
                    multiline
                    fullWidth
                    minRows={4}
                    maxRows={10}
                    value={dataArray ? JSON.stringify(dataArray, null, 2) : 'Kliknij button aby pobrać JSONA'}
                    InputProps={{
                        readOnly: true,
                    }}
                    variant="outlined"
                />
            </Paper>

            <Button variant="contained" onClick={correctData} disabled={loadingCorrect || dataArray.length === 0} sx={{ marginTop: 2 }}>
                {loadingCorrect ? <CircularProgress size={24} /> : 'Popraw dane programistycznie'}
            </Button>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Niepoprawne dane:</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {incorrectData.length > 0 ? JSON.stringify(incorrectData, null, 2) : 'Brak niepoprawnych danych'}
                </Typography>
            </Paper>

            <Button variant="contained" onClick={generateAIAnswers} disabled={loadingAI || incorrectData.length === 0} sx={{ marginTop: 2 }}>
                {loadingAI ? <CircularProgress size={24} /> : 'Generuj odpowiedzi za pomocąAI'}
            </Button>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Konwersacje z AI:</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {aiConversation.length > 0 ? JSON.stringify(aiConversation, null, 2) : 'Brak niepoprawnych danych'}
                </Typography>
            </Paper>


            <Button variant="contained" onClick={sendPostData} disabled={loadingPost || aiConversation.length === 0} sx={{ marginTop: 2 }}>
                {loadingPost ? <CircularProgress size={24} /> : 'Wysyłam rozwiązanie zadania'}
            </Button>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Wynik POST:</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {postResult ? JSON.stringify(postResult, null, 2) : 'Brak danych'}
                </Typography>
            </Paper>
        </div>
    );
}

export default SolutionComponent;