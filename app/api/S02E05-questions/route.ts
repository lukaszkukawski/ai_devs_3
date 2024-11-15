import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { genSimpleAnswerFromAiWithSystem, getOpenAI, genDescriptionImageFromAi, genTranscriptionsAudioFromAi } from '../../lib/genSimpleAnswerFromAi';
import path from 'path';
import { join } from 'path';
import fs from 'fs';

export async function GET(request: NextRequest, { params }) {
    try {
        const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_JSON! + process.env.NEXT_PUBLIC_AI_DEVS_API_KEY! + "/arxiv.txt";
        if (!endpoint) {
            throw new Error('Environment variable NEXT_PUBLIC_ENDPOINT_POLIGON_FILE_DANE is not defined');
        }
        const response = await fetch(endpoint);
        const text = await response.text();
        return NextResponse.json({ text });
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
    const { q } = await request.json();
    try {

        const filePath = path.join(process.cwd(), 'src/S02E05/article.md');
        const article = fs.readFileSync(filePath, 'utf-8');

        const descriptionsPath = path.join(process.cwd(), 'src/S02E05/descriptions.json');
        const descriptions = fs.existsSync(descriptionsPath) ? fs.readFileSync(descriptionsPath, 'utf-8') : '';

        const transcriptionsPath = path.join(process.cwd(), 'src/S02E05/transcriptions.json');
        const transcriptions = fs.existsSync(transcriptionsPath) ? fs.readFileSync(transcriptionsPath, 'utf-8') : '';

        const answers = await genSimpleAnswerFromAiWithSystem(`Odpowiedż mi na pytania ${JSON.stringify(q)}, Odpowiedzi niech będa bardzo dokładne, odowaidaj bardzo zwięźle. Najpierw zastanów się w <THINKING></THINKING>, następnie odowiedź w foramcie<RESULT>{"01": "odpowiedz", "02": "odpowiedz" itp}</RESULT>`, "<ARTICLE>" + article + "</ARTICLE><DESCRIPTIONS_IMAGES>" + descriptions + "</DESCRIPTIONS_IMAGES><TRANSCRIPTIONS_MP3>" + transcriptions + "</TRANSCRIPTIONS_MP3>");
        console.log("answers", answers)

        return NextResponse.json({ answers });
    } catch (error) {
        return new NextResponse(JSON.stringify({}), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
    }
};