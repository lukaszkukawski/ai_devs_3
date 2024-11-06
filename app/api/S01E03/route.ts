import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function GET(request: NextRequest, { params }) {
    try {
        const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_JSON! + process.env.NEXT_PUBLIC_AI_DEVS_API_KEY! + "/json.txt";
        if (!endpoint) {
            throw new Error('Environment variable NEXT_PUBLIC_ENDPOINT_POLIGON_FILE_DANE is not defined');
        }
        const data = await fetch(endpoint);
        const jsonData = await data.json();
       
        return new NextResponse(JSON.stringify(jsonData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({}), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
    }
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_REPORT;
        if (!endpoint) {
            throw new Error('Environment variable NEXT_PUBLIC_ENDPOINT_REPORT is not defined');
        }
        const response = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify({
                "task":"JSON",
                "apikey": process.env.NEXT_PUBLIC_AI_DEVS_API_KEY,
                "answer": body
            })
        });
        const text = await response.text();

        // Przykładowa logika przetwarzania danych
        console.log('Received data:', body);

        // Możesz tutaj dodać logikę przetwarzania lub zapisywania danych
        // Na przykład, wysyłanie danych do innego serwera lub zapis w bazie danych

        return new NextResponse(JSON.stringify({ text: text }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error processing POST request:', error);
        return new NextResponse(JSON.stringify({ error: 'Błąd przetwarzania danych' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}