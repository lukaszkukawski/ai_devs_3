"use client";

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

function SolutionComponent() {
    
    const [names, setNames] = useState<string[]>(["RAFAL","BARBARA","ALEKSANDER","ANDRZEJ"]);
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

    async function pushNames() {
        try {
            setLoadingPushNames(true);
            const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_S03E04_PEOPLE;
            if (!endpoint) {
                throw new Error('Environment variable NEXT_PUBLIC_ENDPOINT_S03E04_PEOPLE is not defined');
            }
            
            const citiesResponses: string[] = cities;
            console.log("names", names);

            for (const name of names) {
                console.log("name", name);
                try {
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        body: JSON.stringify({
                            "apikey": process.env.NEXT_PUBLIC_AI_DEVS_API_KEY,
                            "query": name
                        })
                    });
                    const data = await response.json();
                    if (data.message && data.message.includes('RESTRICTED')) {
                        continue;
                    }
                    const citiesFromResponse = data.message.split(' '); // Podział miast na tablicę

                    
                    for (const city of citiesFromResponse) {
                        if (!citiesResponses.includes(city)) { // Sprawdzenie, czy miasto już istnieje
                            citiesResponses.push(city); // Dodanie miasta do tablicy
                        }
                    }
                    const existingEntry = namesCities.find(entry => entry.name === name);
                    if (existingEntry) {
                        citiesFromResponse.forEach(city => {
                            if (!existingEntry.cities.includes(city)) {
                                existingEntry.cities.push(city);
                            }
                        });
                    } else {
                        namesCities.push({ name, cities: citiesFromResponse });
                    }
                     setNamesCities([...namesCities]);
                } catch (error) {
                    console.error('Error fetching city data:', error);
                }
            }
            setCities(citiesResponses);
            setLoadingPushNames(false);
        } catch (error) {
            console.error('Error sending post data:', error);
            setPostResult({ error: 'Błąd wysyłania danych' });
        } finally {
            setLoadingPushNames(false);
        }
    }

    async function pushCities() {
        try {
            setLoadingPusCities(true);
            const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_S03E04_PLACES;
            if (!endpoint) {
                throw new Error('Environment variable NEXT_PUBLIC_ENDPOINT_S03E04_PLACES is not defined');
            }
            
            const namesResponses: string[] = names;
    
            for (const cityName of cities) { // Pętla po imionach
                try {
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        body: JSON.stringify({
                            "apikey": process.env.NEXT_PUBLIC_AI_DEVS_API_KEY,
                            "query": cityName
                        })
                    });
                    const data = await response.json();
                    if (data.message && data.message.includes('RESTRICTED')) {
                        break;
                    }
                    const namesFromResponse = data.message.split(' '); // Podział miast na tablicę

                    for (let name of namesFromResponse) {
                        name = name.replace("Ł", "L")
                        if (!namesResponses.includes(name)) { // Sprawdzenie, czy miasto już istnieje
                            namesResponses.push(name); // Dodanie miasta do tablicy
                        }
                        const existingEntry = namesCities.find(entry => entry.name === name);
                        if (existingEntry) {
                            if (!existingEntry.cities.includes(cityName)) {
                                existingEntry.cities.push(cityName);
                            }
                        } else {
                            namesCities.push({ name, cities: [cityName] });
                        }
                        setNamesCities([...namesCities]);
                    }
                } catch (error) {
                    console.error('Error fetching city data:', error);
                }
            }
            setNames(namesResponses);
            setLoadingPusCities(false);
        } catch (error) {
            console.error('Error sending post data:', error);
            setPostResult({ error: 'Błąd wysyłania danych' });
        } finally {
            setLoadingPusCities(false);
        }
    }

    function generateAnswear() {
        const answearBarba = namesCities.find(nameCities => nameCities.name === "BARBARA");
        setAnswear(answearBarba?.cities[0]);
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
                    "task":"loop",
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
            <Button variant="contained" onClick={pushNames} disabled={loadingPushNames}>
                {loadingPushNames ? <CircularProgress size={24} /> : 'Wyślij imiona'}
            </Button>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6">Imiona:</Typography>                                                                                             
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    <TextField
                    multiline
                    fullWidth
                    minRows={4}
                    maxRows={10}
                    value={names}
                    onChange={(e) => setNames(e.target.value.split(","))}
                    variant="outlined"
                />
                </Typography>
            </Paper>

            <br />
            <Button variant="contained" onClick={pushCities} disabled={loadingPusCities}>
                {loadingPusCities ? <CircularProgress size={24} /> : 'Wyślij miasta'}
            </Button>
            <br />
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6">Miasta:</Typography>                                                                                             
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    <TextField
                    multiline
                    fullWidth
                    minRows={4}
                    maxRows={10}
                    value={cities}
                    onChange={(e) => setCities(e.target.value.split(","))}
                    variant="outlined"
                />
                </Typography>
            </Paper>
            <br />
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h6">Miasta:</Typography>                                                                                             
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(namesCities)}
                </Typography>
            </Paper>
            
            <br />
            <Button variant="contained" onClick={generateAnswear} disabled={loadingPusCities}>
                {loadingPusCities ? <CircularProgress size={24} /> : 'Znajdz miasto'}
            </Button>
            <br />
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