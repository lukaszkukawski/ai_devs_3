import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

export async function GET(request: NextRequest, { params }) {
    try {
        const response = await fetch('https://xyz.ag3nts.org/');
        const text = await response.text();
        const dom = new JSDOM(text);
        const questionElement = dom.window.document.getElementById('human-question');
        const question = questionElement ? questionElement.textContent : 'Question not found';
        return new NextResponse(JSON.stringify({
            question: question?.replace("Question:", "")
        }), {
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

export async function POST(request: NextRequest, { params }) {
    const body = await request.json();
    const { answer } = body;
    const formData = new URLSearchParams();
    formData.append('username', 'tester');
    formData.append('password', '574e112a');
    formData.append('answer', answer);
    //formData.append('apikey', process.env.NEXT_PUBLIC_AI_DEVS_API_KEY || '');
    console.log("formData.toString()", formData.toString())
    const response = await fetch('https://xyz.ag3nts.org/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
    });
    const text = await response.text();
    console.log(text);
    return new NextResponse(JSON.stringify({
        result: text
    }), {
        status: 200,
    });
}