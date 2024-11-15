import { NextRequest, NextResponse } from 'next/server';
import type { ChatCompletion, ChatCompletionMessageParam } from "openai/resources/chat/completions";
import fetch from 'node-fetch';
import fs from 'fs';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { join } from 'path';
import { genSimpleAnswerFromAiWithSystem, getOpenAI, genDescriptionImageFromAi, genTranscriptionsAudioFromAi } from '../../lib/genSimpleAnswerFromAi';
import { toFile } from 'openai';
import { describe } from 'node:test';

export type Image = {
    alt: string;
    url: string;
    context: string;
    description: string;
    preview: string;
    base64: string;
    name: string;
};

export type Mp3 = {
    url: string;
    name: string;
    translate: string
}

const openai = await getOpenAI();
const host = process.env['NEXT_PUBLIC_ENDPOINT_HOST_DANE'];

export async function GET(request: NextRequest, { params }) {
    try {
        const filePath = path.join(process.cwd(), 'src/S02E05/article.md');
        const article =fs.readFileSync(filePath, 'utf-8');
        const images = await extractImages(article);

        const processedImages = await Promise.all(images.map(async (image) => {
            return { ...image, description: await genDescriptionImageFromAi(image.base64, image.name)};
        }));
        const describedImages = processedImages.map(({ base64, ...rest }) => rest);
        await writeFile(join(process.cwd(), 'src/S02E05/', 'descriptions.json'), JSON.stringify(describedImages, null, 2));

        const audios = await extractMp3(article);
        console.log("audios", audios);

        const processedMp3 = await Promise.all(audios.map(async (mp3) => {
            const convertedBuffer = fs.readFileSync(mp3.url);
            return { ...mp3, description: await genTranscriptionsAudioFromAi(convertedBuffer, mp3.name)};
        }));
        await writeFile(join(process.cwd(), 'src/S02E05/', 'transcriptions.json'), JSON.stringify(processedMp3, null, 2));

        //console.log("images", images)
        return NextResponse.json({ answear: "TEST" });
    } catch(e){
        console.log('error', e);
        return new NextResponse(JSON.stringify({error: e.message}), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

async function extractImages(article: string): Promise<Image[]> {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const matches = [...article.matchAll(imageRegex)];

    const imagePromises = matches.map(async ([, alt, url]) => {
        try {
            //const url = host + _url;
            const name = url.split('/').pop() || '';
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
            const arrayBuffer = await response.arrayBuffer();
            const base64 = Buffer.from(arrayBuffer).toString('base64');

            return {
                alt,
                url,
                context: '',
                description: '',
                preview: '',
                base64,
                name
            };
        } catch (error) {
            console.error(`Error processing image ${url}:`, error);
        }

        
    });

    const results = await Promise.all(imagePromises);
    return results.filter((link): link is Image => link !== null);
}


async function extractMp3(article: string): Promise<Mp3[]> {
    const mp3Regex = /\[([^\]]*)\]\(([^)]+\.mp3)\)/g;
    const matches = [...article.matchAll(mp3Regex)];

    const mp3Promises = matches.map(async ([, alt, url]) => {
        try {
            //const url = host + _url;
            const name = url.split('/').pop() || '';
            const filePath = path.join(process.cwd(), 'src/S02E05/' + name);
            if (fs.existsSync(filePath)) {
                
                url = filePath;
                // Możesz teraz użyć fileContent według potrzeb
            } else {

                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
            }
            return {
                url,
                translate: '',
                name
            };
        } catch (error) {
            console.error(`Error processing image ${url}:`, error);
        }

        
    });

    const results = await Promise.all(mp3Promises);
    return results.filter((link): link is Mp3 => link !== null);
}
