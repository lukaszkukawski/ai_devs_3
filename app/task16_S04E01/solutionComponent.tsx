"use client";

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { ToolService }  from './ToolService.ts';
import { getRESULT, getTHINKING } from '../lib/genSimpleAnswerFromAi';


function SolutionComponent() {
    const [loadingStart, setLoadingStart] =useState<boolean>(false); 
    const [loadingPost, setLoadingPost] = useState<boolean>(false);
    const [postResult, setPostResult] = useState<any>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [images, setImages] = useState<{url: string, base64: string}[]>([]);
    const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_REPORT;
    const toolService = new ToolService(addLog);
    const [answear, setAnswear] = useState<string[]>([]);
    const actions = {
        "repair": "REPAIR",
        "darken": "DARKEN",
        "brighten": "BRIGHTEN"
    }


    function addLog(message: string) {
        setLogs(prevLogs => [...prevLogs, message]);
    }

    async function start() {
        try {
            setLoadingStart(true);
            const data = await fetch(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    "task":"photos",
                    "apikey": process.env.NEXT_PUBLIC_AI_DEVS_API_KEY,
                    "answer": "START"
                })
            });
            const jsonData = await data.json();
            addLog('Zapytanie START wykonane.');
            addLog(jsonData.message);
            const images = await toolService.getImages(jsonData.message);
            console.log("saveImages")
            await saveImages(images);
            setLoadingStart(false);
        } catch (error) {
            console.error('Error sending post data:', error);
            setPostResult({ error: 'Błąd wysyłania danych' });
        }
    }

    async function saveImages(images: string[]) {
        addLog("Pobieram zdjęcia");
        console.log("saveImages1", images)
        const data = await fetch('/api/S04E01?type=download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ images: images })
        });
        // console.log("saveImages2")
        const jsonData = await data.json();
        console.log("saveImages3", jsonData.response)
        setImages(jsonData.response);
        addLog('Mam tablice zdjęć: ' + JSON.stringify(images));
        await analyzImages(jsonData.response);
    }

    async function analyzImages(images) {
        addLog('Zaczynam analize zdjęć');
        console.log('Zaczynam analize zdjęć', images);
        for (const image of images) {
            analyzImage(image);
        }
    }

    async function analyzImage(image) {
        addLog('Zaczynam analize zdjęcia ' + image.url);
        const reposne = await toolService.analyzImage(image.base64);
        const action = getRESULT(reposne);
        const thinking = getTHINKING(reposne);
        addLog("Dla zdjęcia " +  image + " " + thinking)
        console.log("reposne", reposne)
        console.log("ACION", action);
        const imageName = image.url.replace("src/S04E01/", "").replace("-small", "");
        await executeImages(action.trim() + " " + imageName);
    }

    async function executeImages(action) {
        const data = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify({
                "task": "photos",
                "apikey": process.env.NEXT_PUBLIC_AI_DEVS_API_KEY,
                "answer": action
            })
        });
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
                    "task":"photos",
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
            <Button variant="contained" onClick={start} disabled={loadingStart}>
                {loadingStart ? <CircularProgress size={24} /> : 'Start'}
            </Button>
            <br />
            
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#e0e0e0' }}>
                <Typography variant="h6">Logi:</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {logs.length > 0 ? logs.join('\n ----------------------------------------- \n\n') : 'Brak logów'}
                </Typography>
            </Paper>

            <br />
            <Button variant="contained" onClick={sendPostData} disabled={loadingStart}>
                {loadingStart ? <CircularProgress size={24} /> : 'Wyślij rozwiązanie'}
            </Button>
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