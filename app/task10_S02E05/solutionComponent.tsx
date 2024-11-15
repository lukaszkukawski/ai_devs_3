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
    
    const [taskContext, setTaskContext] = useState<string>("");
    const [taskQuestions, setTaskQuestions] = useState<{}>({});
    const [taskAnswear, setTaskAnswear] = useState<string>("");

    const [loadingGeneratingFiles, setLoadingGeneratingFiles] = useState<boolean>(false);


    const [loadingPost, setLoadingPost] = useState<boolean>(false);    
    const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);
    const [loadingGenerativeAnswear , setLoadingGenerativeAnswaear] = useState<boolean>(false);
    const [postResult, setPostResult] = useState<any>(null);


    async function generateContext() {

        setLoadingGeneratingFiles(true);
        try {
            const data = await fetch('/api/S02E05');
            const jsonData = await data.json();
            setTaskContext("");
            setLoadingGeneratingFiles(false);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    async function getQuestions() {
        setLoadingQuestions(true);
        try {
            const data = await fetch('/api/S02E05-questions');
            const questions = await data.json();
            console.log("questions", questions.text)
            const questionsObject = questions.text.trim().split('\n').reduce((acc, line) => {
                const [key, value] = line.split('=');
                acc[key] = value;
                return acc;
            }, {});
            setTaskQuestions(questionsObject);
            setLoadingQuestions(false);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    async function generateAnswear() {
        setLoadingGenerativeAnswaear(true);
        try {
            const data = await fetch('/api/S02E05-questions', {
                method: 'POST',
                body: JSON.stringify({
                    "q": taskQuestions
                })
                
            });
            const jsonData = await data.json();
            const result = getRESULT(jsonData['answers']);
            const thinking = getTHINKING(jsonData['answers']);
            console.log("jsonData", jsonData)
            console.log("result", result)
            console.log("thinking", thinking)
            setTaskAnswear(result);
            setLoadingGenerativeAnswaear(false);
        } catch(e) {

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
                    "task":"arxiv",
                    "apikey": process.env.NEXT_PUBLIC_AI_DEVS_API_KEY,
                    "answer": JSON.parse(taskAnswear)
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
            <Button variant="contained" onClick={generateContext} disabled={loadingGeneratingFiles}>
                {loadingGeneratingFiles ? <CircularProgress size={24} /> : 'Generuj context'}
            </Button>

            <br />
            <Button variant="contained" onClick={getQuestions} disabled={loadingQuestions} sx={{ marginTop: 2 }}>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                {loadingQuestions ? <CircularProgress size={24} /> : 'Pobierz pytania'}
            </Button>

            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Pytania:</Typography>                                                                                                                                                                                                                                                                                  
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(taskQuestions, null, 2)}
                </Typography>
            </Paper>

            <br />
            <Button variant="contained" onClick={generateAnswear} disabled={loadingGenerativeAnswear} sx={{ marginTop: 2 }}>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                {loadingGenerativeAnswear ? <CircularProgress size={24} /> : 'Generuj odpowiedzi'}
            </Button>

            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Odpowiedzi:</Typography>                                                                                                                                                                                                                                                                                  
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    <TextField
                    multiline
                    fullWidth
                    minRows={4}
                    maxRows={10}
                    value={taskAnswear}
                    onChange={(e) => setTaskAnswear(e.target.value)}
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