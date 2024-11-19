import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { genSimpleAnswerFromAiWithSystem, getRESULT } from '../../lib/genSimpleAnswerFromAi';
import path from 'path';
import { join } from 'path';
import fs from 'fs';
import { OpenAIService } from '@/app/lib/OpenAIService';
import { VectorService } from '@/app/lib/VectorService';
import { TextSplitter } from '@/app/lib/TextService';
import { text } from 'stream/consumers';


const COLLECTION_NAME = "ai_devs";

const openai = new OpenAIService();
const vectorService = new VectorService(openai);
const textSplitter = new TextSplitter();

type Data = {
    date: string,
    text: string,
    file: string,
}
export async function GET(request: NextRequest) {
    const type = request.nextUrl.searchParams.get('type');
    
    console.log("type", type)
    if (type == 'vectors') {
        const response = await generateVectors();
        return NextResponse.json({ response });
    } else if(type == 'answear') {
        const question = request.nextUrl.searchParams.get('question');
        const response = await generateAnswear(question);
        return NextResponse.json({ response });
    }

    return new NextResponse(JSON.stringify({}), {
        status: 500,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

async function initializeData(data: Data[]) {
    const points = await Promise.all(data.map(async ({ date, text, file }) => {
        const doc = await textSplitter.document(text, 'gpt-4o', { date, file });
        return doc;
    }));
    console.log('points', points)
    await vectorService.initializeCollectionWithData(COLLECTION_NAME, points);
}

async function generateVectors() {
    console.log("generateVectors");
    const directory = path.join(process.cwd(), 'src/S03E02/weapons_tests/do-not-share/');
    const files = fs.readdirSync(directory);
    const dataFromFiles: Data[] = [];
    for (const file of files) {
        const filePath = path.join(directory, file); 
        console.log("filePath", filePath);
        console.log("file", file);
        const data = {
            date: file.replace('.txt', '').replaceAll('_', '-'),
            text: fs.readFileSync(filePath, 'utf-8'),
            file: filePath
        };
        dataFromFiles.push(data);
    }

    await initializeData(dataFromFiles);

    return "ok";
}

async function generateAnswear(question: string) {
    const searchResults = await vectorService.performSearch(COLLECTION_NAME, question, {}, 1);
    console.log('searchResults', searchResults);

    return searchResults;
}