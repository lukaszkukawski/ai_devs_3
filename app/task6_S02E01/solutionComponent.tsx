"use client";

import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { genSimpleAnswerFromAiWithSystem } from '../lib/genSimpleAnswerFromAi';
import { json } from 'stream/consumers';

function SolutionComponent() {
    const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
    const [loadingAI, setLoadingAI] = useState<boolean>(false);
    const [loadingPost, setLoadingPost] = useState<boolean>(false);
    const [transcriptionText, setTranscriptionText] = useState<string>("");
    const [answer, setAnswer] = useState<string>("");
    const [postResult, setPostResult] = useState<any>(null);

   async  function generateTranscript() {
        setLoadingFetch(true);
        try {
            const data = await fetch('/api/S02E01');
            const jsonData = await data.json();
            setTranscriptionText(jsonData["text"]);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        } finally {
            setLoadingFetch(false);
        }
    }

    async function generateAIAnswers() {
        try {
            const answerFromAI = await genSimpleAnswerFromAiWithSystem("Spróbuj wywnioskować na jakiej ulicy wykłada profesor, z treści systmowej., gdzie wykłada profesor Andrzej Maj, przeanalizuj treść i wywnioskuj, zastanów się przed podaniem odpowiedzi. Podaj mi jedynie nazwę ulicy, Przed podaniem wyniku dodaj: <THINKING></THINKING> Aby potwierdzić poprawność odpowiedz. Użyj następującego formatu odpowiedzi:<RESULT>{\"result\": \"\"}</RESULT>", transcriptionText); 
            try {
                const resultMatch = answerFromAI?.match(/<RESULT>(.*?)<\/RESULT>/);
                console.log("resultMatch", resultMatch)
                if (resultMatch && resultMatch[1]) {

                    const resultJson = JSON.parse(resultMatch[1]);
                    console.log("resultJson.result", resultJson.result)
                    setAnswer(resultJson.result || "");
                } else {
                    setAnswer("");
                }
            } catch(e) {

            }

        } catch (error) {
            console.error('Error getting answer from AI:', error);
            return "Błąd uzyskiwania odpowiedzi";
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
                    "task":"MP3",
                    "apikey": process.env.NEXT_PUBLIC_AI_DEVS_API_KEY,
                    "answer": answer
                })
                
            });
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
            <Button variant="contained" onClick={generateTranscript} disabled={loadingFetch}>
                {loadingFetch ? <CircularProgress size={24} /> : 'Pobierz dane'}
            </Button>

            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Pobrane dane:</Typography>
                <TextField
                    multiline
                    fullWidth
                    minRows={4}
                    maxRows={10}
                    value={JSON.stringify(transcriptionText)}
                    onChange={(e) => setTranscriptionText(e.target.value)}
                    variant="outlined"
                />
            </Paper>


            <Button variant="contained" onClick={generateAIAnswers} disabled={loadingAI || transcriptionText.length === 0} sx={{ marginTop: 2 }}>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                {loadingAI ? <CircularProgress size={24} /> : 'Znajdź dane'}
            </Button>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Odpowiedź od AI:</Typography>                                                                                                                                                                                                                                                                                  
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                <TextField
                    fullWidth
                    minRows={4}
                    maxRows={10}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    variant="outlined"
                />
                </Typography>
            </Paper>


            <Button variant="contained" onClick={sendPostData} disabled={loadingPost || answer.length === 0} sx={{ marginTop: 2 }}>
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