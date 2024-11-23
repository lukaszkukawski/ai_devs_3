"use client";

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';


function SolutionComponent() {
    
    const [users, setUsers] = useState<{id: string, username: string, access_level: string, is_active: string, lastlog: string}[]>([]);

    const [namesCities, setNamesCities] = useState<{"name": string, "cities": string[]}[]>([]);

    const [loadingPushNames, setLoadingPushNames] = useState<boolean>(false);
    const [cities, setCities] = useState<string[]>(["KRAKOW","WARSZAWA"]);
    const [loadingPusCities, setLoadingPusCities] = useState<boolean>(false);


    const [loadingGeneratingAnswear, setLoadingGeneratingAnswear] = useState<boolean>(false);

    const [tables, setTables] = useState<string[]>([]);
    const [tablesStructur, setTablesStructur] = useState<{name: string, structur:string}[]>([]);
    
    const [answear, setAnswear] = useState<string[]>([]);

    const [loadingPost, setLoadingPost] = useState<boolean>(false);    
    const [postResult, setPostResult] = useState<any>(null);

    async function getUsers() {
        try {
            setLoadingPushNames(true);
            const data = await fetch('/api/S03E05?type=users');
            const jsonData = await data.json();
            
            setLoadingPushNames(false);
        } catch (error) {
            console.error('Error sending post data:', error);
            setPostResult({ error: 'Błąd wysyłania danych' });
        } finally {
            setLoadingPushNames(false);
        }
    }

    async function getConnections() {
        try {
            setLoadingPushNames(true);
            const data = await fetch('/api/S03E05?type=connections');
            const jsonData = await data.json();
            
            setLoadingPushNames(false);
        } catch (error) {
            console.error('Error sending post data:', error);
            setPostResult({ error: 'Błąd wysyłania danych' });
        } finally {
            setLoadingPushNames(false);
        }
    }
    async function findShortesWay() {
        try {
            setLoadingPushNames(true);
            const data = await fetch('/api/S03E05?type=findShortesWay');
            const jsonData = await data.json();
            setAnswear(jsonData.response);
            setLoadingPushNames(false);
        } catch (error) {
            console.error('Error sending post data:', error);
            setPostResult({ error: 'Błąd wysyłania danych' });
        } finally {
            setLoadingPushNames(false);
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
                    "task":"connections",
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
            <Button variant="contained" onClick={getUsers} disabled={loadingPushNames}>
                {loadingPushNames ? <CircularProgress size={24} /> : 'Pobierz userów'}
            </Button>
            <br />
            <Button variant="contained" onClick={getConnections} disabled={loadingPushNames}>
                {loadingPushNames ? <CircularProgress size={24} /> : 'Pobierz połączenia'}
            </Button>
            <br />
            <Button variant="contained" onClick={findShortesWay} disabled={loadingPushNames}>
                {loadingPushNames ? <CircularProgress size={24} /> : 'Wyszukaj najrótszej drogi'}
            </Button>
            <br />
            <Button variant="contained" onClick={sendPostData} disabled={loadingPost} sx={{ marginTop: 2 }}>
                {loadingPost ? <CircularProgress size={24} /> : 'Wysyłam rozwiązanie zadania'}
            </Button>

            findShortesWay

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