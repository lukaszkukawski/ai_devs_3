"use client";

import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getOpenAI } from '../lib/genSimpleAnswerFromAi';

function SolutionComponent() {
    const [robotDesc, setRobotDesc] = useState<string>("");
    const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
    const [loadingAI, setLoadingAI] = useState<boolean>(false);
    const [loadingPost, setLoadingPost] = useState<boolean>(false);
    const [answer, setAnswer] = useState<string>("");
    const [postResult, setPostResult] = useState<any>(null);

    async function getRobotDescription() {
        setLoadingFetch(true);
        try {
            const data = await fetch('/api/S02E03');
            const jsonData = await data.json();
            setRobotDesc(jsonData["text"]);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        } finally {
            setLoadingFetch(false);
        }
    }

    async function generateAIAnswers() {
        try {
            setLoadingAI(true);
            const openai = await getOpenAI();
            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: `Zdjecie ma przedstawiać robota, nie dodawaj żadnego tekstu. Opis scenerii oraz samego robota znajduje się tutaj <ROBOTS_DESC> ${robotDesc} </ROBOTS_DESC>`,
                n: 1,
                size: "1024x1024",
                response_format: "url"
            });

            if (response.data && response.data.length > 0) {
                setAnswer(response.data[0].url);
            } else {
                console.error('No image generated');
                setAnswer('Błąd generowania obrazu');
            }
            setLoadingAI(false);
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
                    "task":"robotid",
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
            <Button variant="contained" onClick={getRobotDescription} disabled={loadingFetch}>
                {loadingFetch ? <CircularProgress size={24} /> : 'Pobierz opis robota'}
            </Button>

            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Pobrany opis:</Typography>
                <TextField
                    multiline
                    fullWidth
                    minRows={4}
                    maxRows={10}
                    value={robotDesc}
                    onChange={(e) => setRobotDesc(e.target.value)}
                    variant="outlined"
                />
            </Paper>


            <Button variant="contained" onClick={generateAIAnswers} disabled={loadingAI || robotDesc.length === 0} sx={{ marginTop: 2 }}>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                {loadingAI ? <CircularProgress size={24} /> : 'Generuj zdjęcie'}
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
                {answer && (
                    <Box sx={{ marginTop: 2 }}>
                        <img
                            src={answer}
                            alt="Zdjęcie"
                            style={{ maxWidth: '100%', cursor: 'pointer' }}
                            onClick={() => window.open(answer, '_blank')}
                        />
                    </Box>
                )}
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