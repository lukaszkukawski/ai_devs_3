import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function GET(request: NextRequest, { params }) {
    try {
        const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_JSON! + process.env.NEXT_PUBLIC_AI_DEVS_API_KEY! + "/robotid.json";
        if (!endpoint) {
            throw new Error('Environment variable NEXT_PUBLIC_ENDPOINT_POLIGON_FILE_DANE is not defined');
        }
        const response = await fetch(endpoint);
        const { description } = await response.json();
        return NextResponse.json({ text: description });
    } catch (error) {
        return new NextResponse(JSON.stringify({}), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
    }
};
