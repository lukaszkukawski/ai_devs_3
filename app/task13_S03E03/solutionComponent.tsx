"use client";

import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getRESULT, getTHINKING, genSimpleAnswerFromAiWithSystem } from '../lib/genSimpleAnswerFromAi';

function SolutionComponent() {
    
    const [loadingGeneratingStructrutes, setLoadingGeneratingStructrutes] = useState<boolean>(false);
    const [loadingTablesNames, setLoadingTablesNames] = useState<boolean>(false);
    const [loadingGeneratingAnswear, setLoadingGeneratingAnswear] = useState<boolean>(false);

    const [tables, setTables] = useState<string[]>([]);
    const [tablesStructur, setTablesStructur] = useState<{name: string, structur:string}[]>([]);
    const [select, setSelect] = useState<string>("");
    const [answear, setAnswear] = useState<string[]>([]);

    const [loadingPost, setLoadingPost] = useState<boolean>(false);    
    const [postResult, setPostResult] = useState<any>(null);
    async function getTables() {
        try {
            const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_API;
            if (!endpoint) {
                throw new Error('Environment variable NEXT_PUBLIC_ENDPOINT_API is not defined');
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    "task":"database",
                    "apikey": process.env.NEXT_PUBLIC_AI_DEVS_API_KEY,
                    "query": "show tables;"
                })
                
            });
            const data = await response.json();
            const tableNames = data.reply.map(item => item.Tables_in_banan);

            setTables(tableNames);
            console.log("tables", tables)

        } catch (error) {
            console.error('Error sending post data:', error);
            setPostResult({ error: 'Błąd wysyłania danych' });
        } finally {
            setLoadingPost(false);
        }
    }

    async function getStructrutes() {
        setLoadingGeneratingStructrutes(true);
        try {
            const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_API;
            if (!endpoint) {
                throw new Error('Environment variable NEXT_PUBLIC_ENDPOINT_API is not defined');
            }

            const structures = await Promise.all(tables.map(async (tableName) => {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    body: JSON.stringify({
                        "task": "database",
                        "apikey": process.env.NEXT_PUBLIC_AI_DEVS_API_KEY,
                        "query": `show create table ${tableName};`
                    })
                });
                const data = await response.json();
                return {
                    name: tableName,
                    structur: data.reply[0]['Create Table']
                };
            }));

            setTablesStructur(structures);
            console.log("setTablesStructur", tablesStructur)
        } catch (error) {
            console.error('Error fetching table structures:', error);
        } finally {
            setLoadingGeneratingStructrutes(false);
        }
    }
    async function generateSelect() {
        const context = `Available database tables and their structures:\n${
            tablesStructur.map(table => 
                `Table: ${table.name}\n${table.structur}\n`
            ).join('\n')
        }`;

        const prompt = `Based on the provided database schema, create a SQL SELECT query that will:
            Find all active datacenters (DC_ID) that are managed by employees who are currently on leave (is_active=0).
            The query should be precise and only return the required information.
            Please provide only the SQL query without any explanation.
            Format example:
            <RESULT>SELECT * FROM table;</RESULT>`;

        const result = await genSimpleAnswerFromAiWithSystem(prompt, context);
        setSelect(getRESULT(result));
        console.log("Generated query:", result);
    }

    async function getAnswear() {
        try {
            const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_API;
            if (!endpoint) {
                throw new Error('Environment variable NEXT_PUBLIC_ENDPOINT_API is not defined');
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    "task":"database",
                    "apikey": process.env.NEXT_PUBLIC_AI_DEVS_API_KEY,
                    "query": select
                })
                
            });
            const data = await response.json();
            setAnswear(data.reply.map(item => item.dc_id))
            console.log("data", data)

        } catch (error) {
            console.error('Error sending post data:', error);
            setPostResult({ error: 'Błąd wysyłania danych' });
        } finally {
            setLoadingPost(false);
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
                    "task":"database",
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
            <Button variant="contained" onClick={getTables} disabled={loadingTablesNames}>
                {loadingTablesNames ? <CircularProgress size={24} /> : 'Pobierz tabele'}
            </Button>

            <br />
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6">Tabele:</Typography>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {tables ? tables.join(",") : 'Brak danych'}
                </Typography>
            </Paper>
            <br />
            <Button variant="contained" onClick={getStructrutes} disabled={loadingGeneratingStructrutes}>
                {loadingGeneratingStructrutes ? <CircularProgress size={24} /> : 'Pobierz strukture'}
            </Button>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6">Tabele:</Typography>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {tables ? JSON.stringify(tablesStructur) : 'Brak danych'}
                </Typography>
            </Paper>
            <br />
            <Button variant="contained" onClick={generateSelect} disabled={loadingGeneratingStructrutes}>
                {loadingGeneratingStructrutes ? <CircularProgress size={24} /> : 'Wygeneruj zapytanie'}
            </Button>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6">Zapytanie:</Typography>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    <TextField
                    multiline
                    fullWidth
                    minRows={4}
                    maxRows={10}
                    value={select}
                    onChange={(e) => setSelect(e.target.value)}
                    variant="outlined"
                />
                </Typography>
            </Paper>
            <br />

            <Button variant="contained" onClick={getAnswear} disabled={loadingGeneratingStructrutes}>
                {loadingGeneratingStructrutes ? <CircularProgress size={24} /> : 'Wygeneruj odpowiedx selecta'}
            </Button>
        
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