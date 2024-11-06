"use client";

import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function SolutionComponent() {
    const [dataArray, setDataArray] = useState<string[]>([]);
    const [postResult, setPostResult] = useState<any>(null);
    const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
    const [loadingPost, setLoadingPost] = useState<boolean>(false);
  
    const fetchData = async () => {
      setLoadingFetch(true);
      try {
        const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_POLIGON_FILE_DANE;
        if (!endpoint) {
            throw new Error('Environment variable NEXT_PUBLIC_ENDPOINT_POLIGON_FILE_DANE is not defined');
        }
        const data = await fetchTextData(endpoint);
        setDataArray(data);
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      } finally {
        setLoadingFetch(false);
      }
    };

    const fetchTextData = async (url: string): Promise<string[]> => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.text();
      return data.split('\n').filter(line => line.trim() !== '');
    };
  
    const sendPostRequest = async () => {
      setLoadingPost(true);
      try {
        const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_POLIGON_VERIFY;
        if (!endpoint) {
            throw new Error('Environment variable NEXT_PUBLIC_ENDPOINT_POLIGON_VERIFY is not defined');
        }
        const result = await postData(endpoint, {
          task: "POLIGON",
          apikey: process.env.NEXT_PUBLIC_AI_DEVS_API_KEY,
          answer: dataArray
        });
        setPostResult(result);
      } catch (error) {
        console.error('There has been a problem with your POST operation:', error);
      } finally {
        setLoadingPost(false);
      }
    };
  
    const postData = async (url: string, payload: object): Promise<any> => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error('POST request failed');
      }
      return response.json();
    };
  
    return (
        <div>
            <h2>Rozwiązanie zadania</h2>
            <Button variant="contained" onClick={fetchData} disabled={loadingFetch}>
            {loadingFetch ? <CircularProgress size={24} /> : 'Pobierz dane'}
            </Button>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Pobrane dane:</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {dataArray ? dataArray.join(', ') : 'Kliknij button aby pobrać dane'}
                </Typography>
            </Paper>

            <Button variant="contained" onClick={sendPostRequest} disabled={loadingPost || dataArray.length === 0} sx={{ marginTop: 2 }}>
            {loadingPost ? <CircularProgress size={24} /> : 'Wyślij dane'}
            </Button>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Wynik POST:</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {postResult ? JSON.stringify(postResult, null, 2) : 'Brak danych'}
                </Typography>
            </Paper>
        </div>
        );
}

export default SolutionComponent;