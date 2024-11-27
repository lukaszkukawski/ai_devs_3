"use client";

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { getRESULT, getTHINKING } from '../lib/genSimpleAnswerFromAi.js';

function SolutionComponent() {
    const [loadingGetJson, setLoadingGetJson] =useState<boolean>(false); 
    const [logs, setLogs] = useState<string[]>([]);
    const [question, setQuestion] = useState<Record<string, string>>({});
    const [pages, setPages] = useState<{"url": string, "file": string}[]>([]);

    const [loadingStatus, setLoadingStatus] = useState<boolean>(false); 
    const [loadingVerifyCode, setLoadingVerifyCode] =useState<boolean>(false); 
    
    const [loadingPost, setLoadingPost] = useState<boolean>(false);
    const [postResult, setPostResult] = useState<any>(null);
    
    const [answear, setAnswear] = useState<{}[]>([]);

    function addLog(message: string) {
        setLogs(prevLogs => [message, ...prevLogs]);
    }

    async function getJson() {
        addLog("Pobieram json-a");
        setLoadingGetJson(true);
        const data = await fetch('/api/S04E03?type=json');
        const jsonData = await data.json();
        console.log("getJson", jsonData);
        setQuestion(jsonData);
        addLog("Pytania pobrane => " + JSON.stringify(jsonData));
        searchAnswear();
    }

    async function searchAnswear() {
        addLog("Szukam odpowiedzi");
        const data = await fetch('/api/S04E03?type=question');
        const jsonData = await data.json();
        console.log("Odpowiedzi", jsonData);
        setAnswear(jsonData);
        setLoadingGetJson(false);
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
                    "task":"softo",
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
            <Button variant="contained" onClick={getJson} disabled={loadingGetJson}>
                {loadingGetJson ? <CircularProgress size={24} /> : 'Startuj'}
            </Button>
            <br />
            
        

            <br />
            <Button variant="contained" onClick={sendPostData} disabled={loadingPost}>
                {loadingPost ? <CircularProgress size={24} /> : 'Wslij odpowiedź'}
            </Button>


            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#e0e0e0' }}>
                <Typography variant="h6">Logi:</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {logs.length > 0 ? logs.join('\n ----------------------------------------- \n\n') : 'Brak logów'}
                </Typography>
            </Paper>


        </div>
    );
}

export default SolutionComponent;