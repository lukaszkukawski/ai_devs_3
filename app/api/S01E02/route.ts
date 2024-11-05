import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const body = await request.json();
    const { text, msgID } = body;

    const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_XYZ_VERIFY;
    if (!endpoint) {
        throw new Error('Environment variable NEXT_PUBLIC_ENDPOINT_XYZ_VERIFY is not defined');
    }
    const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({
            text: text,
            msgID: msgID
        })
    });

    const data = await response.json();
    console.log("data", data);

    if (data.code === -100) {
        return new NextResponse(JSON.stringify({
            error: data.message
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    return new NextResponse(JSON.stringify({
        text: data.text,
        msgID: data.msgID
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}