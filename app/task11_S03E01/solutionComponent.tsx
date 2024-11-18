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
    
    const [loadingGeneratingFacts, setLoadingGeneratingFacts] = useState<boolean>(false);
    const [loadingGeneratingRaports, setLoadingGeneratingRaports] = useState<boolean>(false);

    const [facts, setFacts] = useState<{"person": string, "keywords": string, "fileName": string}[]>([]);
    const [raports, setRaports] = useState<{"person": string, "keywords": string, "fileName": string}[]>([]);
    const [taskAnswear, setTaskAnswear] = useState<{}>({});

    const [loadingPost, setLoadingPost] = useState<boolean>(false);    
    const [loadingGenerativeAnswear , setLoadingGenerativeAnswaear] = useState<boolean>(false);
    const [postResult, setPostResult] = useState<any>(null);


    async function generateFacts() {

        setLoadingGeneratingFacts(true);
        try {
            const data = await fetch('/api/S03E01?type=facts');
            const jsonData = await data.json();
            setFacts(jsonData.response);
            setLoadingGeneratingFacts(false);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    async function generateKeywordsFromRaport() {

        setLoadingGeneratingRaports(true);
        try {
            const data = await fetch('/api/S03E01?type=raports');
            const jsonData = await data.json();
            setRaports(jsonData.response);
            setLoadingGeneratingRaports(false);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    function generateFinalKewords() {
        const keywords = {};
        raports.forEach((raport) => {
            let sektor = raport?.fileName.match(/report-\d{2}-(sektor_[A-Z]\d)/)?.[1] || '';
            const sektors = sektor.split('_');
            let aswear = raport.keywords + "," + sektors[0] + " " + sektors[1];
            let finded = false;
            if (raport.person) {
                facts.map((fact) => {
                    if (fact.person === raport.person) {
                        aswear += "," + raport.person + "," + fact.keywords;
                        finded = true;
                    }
                });
                if (!finded) {
                    aswear += "," + raport.person;
                }
            }
            keywords[raport.fileName] = aswear;
        });
        setTaskAnswear(keywords);
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
                    "task":"dokumenty",
                    "apikey": process.env.NEXT_PUBLIC_AI_DEVS_API_KEY,
                    "answer": taskAnswear
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
            <Button variant="contained" onClick={generateFacts} disabled={loadingGeneratingFacts}>
                {loadingGeneratingFacts ? <CircularProgress size={24} /> : 'Generuj metadane dla facts'}
            </Button>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Facts:</Typography>                                                                                                                                                                                                                                                                                  
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(facts, null, 2)}
                </Typography>
            </Paper>

            <br />
            <Button variant="contained" onClick={generateKeywordsFromRaport} disabled={loadingGeneratingRaports} sx={{ marginTop: 2 }}>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                {loadingGeneratingRaports ? <CircularProgress size={24} /> : 'Generuj metadane dla raportów'}
            </Button>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Raports:</Typography>                                                                                                                                                                                                                                                                                  
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(raports, null, 2)}
                </Typography>
            </Paper>


            <br />
            <Button variant="contained" onClick={generateFinalKewords} disabled={raports.length == 0 || raports.length == 0} sx={{ marginTop: 2 }}>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                {loadingGenerativeAnswear ? <CircularProgress size={24} /> : 'Połącz metadane'}
            </Button>

            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Odpowiedzi:</Typography>                                                                                                                                                                                                                                                                                  
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    <TextField
                    multiline
                    fullWidth
                    minRows={4}
                    maxRows={10}
                    value={JSON.stringify(taskAnswear, null, 2)}
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