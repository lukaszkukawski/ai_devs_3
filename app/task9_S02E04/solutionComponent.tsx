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
    
    const [txtFiles, setTxtFiles] = useState<string[]>([]);
    const [audioFiles, setAudioFiles] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<string[]>([]);

    const [people, setPeople] = useState<string[]>([]);
    const [hardware, setHardware] = useState<string[]>([]);

    const [loadingGeneratingFiles, setLoadingGeneratingFiles] = useState<boolean>(false);
    const [loadingAITxt, setLoadingAITxt] = useState<boolean>(false);
    const [loadingAIMp3, setLoadingAIMp3] = useState<boolean>(false);
    const [loadingAIImg, setLoadingAIImg] = useState<boolean>(false);

    const [responseMap, setResponseMap] = useState<Record<string, string>[]>([]);

    const [loadingPost, setLoadingPost] = useState<boolean>(false);    
    const [postResult, setPostResult] = useState<any>(null);


    async function getFilesList(){

        setLoadingGeneratingFiles(true);
        try {
            const data = await fetch('/api/S02E04');
            const jsonData = await data.json();
            setTxtFiles(jsonData["txtFiles"]);
            setAudioFiles(jsonData["audioFiles"]);
            setImageFiles(jsonData["imageFiles"]);
            setLoadingGeneratingFiles(false);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    async function generateAiTxt() {
        setLoadingAITxt(true);
        txtFiles.forEach(async (file) => {
            const data = await fetch('/api/S02E04', {
                method: 'POST',
                body: JSON.stringify({
                    "file": file,
                    "type": "txt"
                })
            });
            const jsonData = await data.json();
            setAnswear(jsonData['answear'], file);
            setLoadingAITxt(false);
        });
    }

    function setAnswear(answear: any, file: string) {
        setResponseMap(prevMap => [...prevMap, { [file]: answear }]);
        if (answear == "people") {
            setPeople(prev => [...prev, file]);
        } else if (answear == "hardware") {
            setHardware(prev => [...prev, file]);
        }
    }

    function generateAiImg() {
        setLoadingAIImg(true);
        imageFiles.forEach(async (file) => {
            const data = await fetch('/api/S02E04', {
                method: 'POST',
                body: JSON.stringify({
                    "file": file,
                    "type": "img"
                })
            });
            const jsonData = await data.json();
            setAnswear(jsonData['answear'], file);
            setLoadingAIImg(false);
        });
    }

    function generateAiMp3() {
        setLoadingAIMp3(true);
        audioFiles.forEach(async (file) => {
            const data = await fetch('/api/S02E04', {
                method: 'POST',
                body: JSON.stringify({
                    "file": file,
                    "type": "mp3"
                })
            });
            const jsonData = await data.json();
            setAnswear(jsonData['answear'], file);
            setLoadingAIMp3(false);
        });
    }

    async function sendPostData() {
        setLoadingPost(true);
        setLoadingPost(true);
        try {
            const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_REPORT;
            if (!endpoint) {
                throw new Error('Environment variable NEXT_PUBLIC_ENDPOINT_REPORT is not defined');
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    "task":"kategorie",
                    "apikey": process.env.NEXT_PUBLIC_AI_DEVS_API_KEY,
                    "answer": {
                        "people": people.sort(),
                        "hardware": hardware.sort()
                    }
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
            <Button variant="contained" onClick={getFilesList} disabled={loadingGeneratingFiles}>
                {loadingGeneratingFiles ? <CircularProgress size={24} /> : 'Generuje listę plików'}
            </Button>

            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}><b>Pliki txt:</b> {txtFiles.join(', ')}</Typography>
                <hr />
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}><b>Pliki audio:</b> {audioFiles.join(', ')}</Typography>
                <hr />
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}><b>Pliki image:</b> {imageFiles.join(', ')}</Typography>
                <hr />
            </Paper>


            <Button variant="contained" onClick={generateAiTxt} disabled={loadingAITxt || txtFiles.length === 0} sx={{ marginTop: 2 }}>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                {loadingAITxt ? <CircularProgress size={24} /> : 'Zintepretuj pliki tekstowe'}
            </Button>
            <Button variant="contained" onClick={generateAiImg} disabled={loadingAIImg || imageFiles.length === 0} sx={{ marginTop: 2 }}>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                {loadingAIImg ? <CircularProgress size={24} /> : 'Zintepretuj zdjęcia'}
            </Button>
            <Button variant="contained" onClick={generateAiMp3} disabled={loadingAIMp3 || audioFiles.length === 0} sx={{ marginTop: 2 }}>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                {loadingAIMp3 ? <CircularProgress size={24} /> : 'Zintepretuj pliki z mp3'}
            </Button>

            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Odpowiedź od AI:</Typography>                                                                                                                                                                                                                                                                                  
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {responseMap.map((item, index) => (
                        <div key={index}>
                            {Object.keys(item)[0]}: {item[Object.keys(item)[0]]} <br />
                        </div>
                    ))}
                </Typography>
            </Paper>

            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Response dla VERIFY:</Typography>                                                                                                                                                                                                                                                                                  
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    <b>People:</b> {people.sort().join(', ')} <br />
                    <b>Hardware:</b> {hardware.sort().join(', ')} <br />
                </Typography>
            </Paper>
            <Button variant="contained" onClick={sendPostData} disabled={loadingPost || hardware.length === 0 || people.length === 0} sx={{ marginTop: 2 }}>
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