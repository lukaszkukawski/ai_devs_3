"use client";

import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getRESULT, getTHINKING } from '../lib/genSimpleAnswerFromAi';

function SolutionComponent() {
    
    const [loadingGeneratingVectors, setLoadingGeneratingVectors] = useState<boolean>(false);
    const [loadingGeneratingAnswear, setLoadingGeneratingAnswear] = useState<boolean>(false);

    const [question, setQuestion] = useState<string>("W raporcie, z którego dnia znajduje się wzmianka o kradzieży prototypu broni?");
    const [answear, setAnswear] = useState<string>("");

    const [loadingPost, setLoadingPost] = useState<boolean>(false);    
    const [postResult, setPostResult] = useState<any>(null);


    async function generateVectors() {

        setLoadingGeneratingVectors(true);
        try {
            const data = await fetch('/api/S03E02?type=vectors');
            const jsonData = await data.json();
            setLoadingGeneratingVectors(false);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    async function generateAnswear() {

        setLoadingGeneratingAnswear(true);
        try {
            const data = await fetch('/api/S03E02?type=answear&question=' + question);
            const jsonData = await data.json();
            setAnswear(jsonData.response[0]?.payload?.date);
            setLoadingGeneratingAnswear(false);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

   
    async function sendPostData() {
        setLoadingPost(true);
        try {
            const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_REPORT;
            if (!endpoint) {
                throw new Error('Environment variable NEXT_PUBLIC_ENDPOINT_REPORT is not defined');
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    "task":"wektory",
                    "apikey": process.env.NEXT_PUBLIC_AI_DEVS_API_KEY,
                    "answer": answear
                })
                
            });
            setPostResult(JSON.stringify(response, null, 2));
            console.log("response", response)

        } catch (error) {
            console.error('Error sending post data:', error);
            setPostResult({ error: 'Błąd wysyłania danych' });
        } finally {
            setLoadingPost(false);
        }
    }


    return (
        <div>
            <h2>Rozwiązanie zadania</h2>
            <Button variant="contained" onClick={generateVectors} disabled={loadingGeneratingVectors}>
                {loadingGeneratingVectors ? <CircularProgress size={24} /> : 'Generuj dane dla bazy wektorowej'}
            </Button>


            <br />

            <Button variant="contained" onClick={generateAnswear} disabled={loadingGeneratingAnswear} sx={{ marginTop: 2 }}>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                {loadingGeneratingAnswear ? <CircularProgress size={24} /> : 'Znajdź odpowiedź na pytanie:'}
            </Button>

            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Pytanie:</Typography>                                                                                                                                                                                                                                                                                  
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    <TextField
                    multiline
                    fullWidth
                    minRows={4}
                    maxRows={10}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    variant="outlined"
                />
                </Typography>
            </Paper>

            <br />
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Odpowiedź:</Typography>                                                                                                                                                                                                                                                                                  
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                <TextField
                    multiline
                    fullWidth
                    minRows={4}
                    maxRows={10}
                    value={answear}
                    onChange={(e) => setAnswear(e.target.value)}
                    variant="outlined"
                />
                </Typography>
            </Paper>
            <br />

            <Button variant="contained" onClick={sendPostData} disabled={loadingPost} sx={{ marginTop: 2 }}>
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