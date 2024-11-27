"use client";

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { getRESULT, getTHINKING } from '../lib/genSimpleAnswerFromAi.ts';


function SolutionComponent() {
    const [loadingStart, setLoadingStart] =useState<boolean>(false); 
    const [loadingStatus, setLoadingStatus] =useState<boolean>(false); 
    const [loadingVerifyCode, setLoadingVerifyCode] =useState<boolean>(false); 
    
    const [loadingPost, setLoadingPost] = useState<boolean>(false);
    const [postResult, setPostResult] = useState<any>(null);
    const [verify, setVerify] = useState<string[]>([
        "01=12,100,3,39",
        "02=-41,75,67,-25",
        "03=78,38,65,2",
        "04=5,64,67,30",
        "05=33,-21,16,-72",
        "06=99,17,69,61",
        "07=17,-42,-65,-43",
        "08=57,-83,-54,-43",
        "09=67,-55,-6,-32",
        "10=-20,-23,-2,44"
    ]);
    const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_REPORT;
    const [answear, setAnswear] = useState<string[]>(["01","02","03","04","05","06","07","08","09","10"]);


    async function generateJsonl() {
    
        const data = await fetch('/api/S04E02?type=jsonl');
        // console.log("saveImages2")
        const jsonData = await data.json();
        console.log("saveImages3", jsonData.response)
        await analyzImages(jsonData.response);
    }

    async function startFineTuning() {
    
        const data = await fetch('/api/S04E02?type=finetuning');
        const jsonData = await data.json();

    }

    async function checkStatusFineTuning() {
        setLoadingStatus(true);
        const data = await fetch('/api/S04E02?type=check');
        const jsonData = await data.json();
        console.log("response" +  jsonData.response)
        setLoadingStatus(false);
    }

    async function verifyCode() {
        setLoadingStatus(true);
        let correctCode = [];
        
        for (const code of verify) {
            const [id, actualCode] = code.split('=');
            const data = await fetch(`/api/S04E02?type=verify&question=${actualCode}`);
            const jsonData = await data.json();
            console.log("response" + jsonData.response);
            if (jsonData.response == "correct") {
                correctCode.push(id);
            }
        }
        setAnswear(correctCode);
        setLoadingStatus(false);
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
                    "task":"research",
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
            <Button variant="contained" onClick={generateJsonl} disabled={loadingStart}>
                {loadingStart ? <CircularProgress size={24} /> : 'Generuj dane dla fine-tuned'}
            </Button>
            <br />
            
            <Button variant="contained" onClick={startFineTuning} disabled={loadingStart}>
                {loadingStart ? <CircularProgress size={24} /> : 'Uruchom fine-tuning'}
            </Button>
            <br />
            <Button variant="contained" onClick={checkStatusFineTuning} disabled={loadingStatus}>
                {loadingStatus ? <CircularProgress size={24} /> : 'Sprawdź status'}
            </Button>

            <br />
            <Button variant="contained" onClick={verifyCode} disabled={loadingVerifyCode}>
                {loadingVerifyCode ? <CircularProgress size={24} /> : 'Zweryfikuj kody'}
            </Button>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6">Kody do weryfikacji:</Typography>                                                                                             
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    <TextField
                    multiline
                    fullWidth
                    minRows={4}
                    maxRows={10}
                    value={verify}
                    onChange={(e) => setVerify(e.target.value.split(","))}
                    variant="outlined"
                />
                </Typography>
            </Paper>

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
            <Button variant="contained" onClick={sendPostData} disabled={loadingPost}>
                {loadingPost ? <CircularProgress size={24} /> : 'Wslij odpowiedź'}
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