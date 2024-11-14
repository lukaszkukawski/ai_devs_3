import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { genSimpleAnswerFromAiWithSystem, getOpenAI } from '../../lib/genSimpleAnswerFromAi';
import { toFile } from 'openai';

const openai = await getOpenAI();

export async function GET(request: NextRequest, { params }) {
    //Pobiera pliki z katalogu src/pliki_z_fabryki
    //i segreguje i uzupełnia listę plików, txtFiles, audioFiles i imageFiles
    try {
        const directory = path.join(process.cwd(), 'src/pliki_z_fabryki');

        const files = fs.readdirSync(directory);
        let txtFiles = [];
        let audioFiles = [];
        let imageFiles = [];

        for (const file of files) {
            const filePath = path.join(directory, file);
            const fileExtension = path.extname(file).toLowerCase();
            if (fileExtension === '.mp3') {
                audioFiles.push(file);
            } else if (fileExtension === '.txt') {
                txtFiles.push(file);
            } else if (fileExtension === '.png') {
                imageFiles.push(file);
            }
        }
        return NextResponse.json({ txtFiles, audioFiles, imageFiles });
    } catch(e) {
        return new NextResponse(JSON.stringify({}), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export async function POST(request: NextRequest, { params }) {
    const { file, type } = await request.json();
    try {
        const directory = path.join(process.cwd(), 'src/pliki_z_fabryki');
        const filePath = path.join(directory, file);
        let answer;
        if (type === 'txt') {
            answer = await txtFile(filePath);
        } else if (type === 'img') {    
            answer = await imgFile(filePath);
        } else if (type === 'mp3') {
            answer = await mp3File(filePath);
        }
        return NextResponse.json({ answear: answer });
    } catch(e) {
        return new NextResponse(JSON.stringify({error: e.message}), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
async function getAiAnswer(txt: string) {
    const answerFromAI = await genSimpleAnswerFromAiWithSystem(txt, "Jesteś expertem od analizy treści. Przeanalizuj zawartość przesłaną przez usera. Te treści to są części raportów, raporty pochodzą od patrolujący ludzi, zdecyduj czy w treści patrol zauważył obcych ludzi, jakiś intruzów, czy może raportują naprawę maszyn/urządzeń, czy może ani jedno ani drugie, w odpowiedzi umieść jedno ze słów kluczowych people = tylko wtedy jak patrol raportuje że wykrył intruzów bądź ślady wskazują na to że intruz jest i można go zidentyfikować, hardware = w przypadku gdy jest usterka oraz naprawa jakiejś maszyny, aktualizacja to nie naprawa, none = wszystko inne <RESULT>people|hardware|none</RESULT> przed podaniem odpowiedzi dodaj <THINKING></THINKING> Aby potwierdzić poprawność odpowiedzi."); // Wywołanie funkcji AI
    console.log("txt", txt);
    console.log("answerFromAI", answerFromAI);
    try {
        const resultMatch = answerFromAI?.match(/<RESULT>(.*?)<\/RESULT>/);
        console.log("resultMatch", resultMatch)
        if (resultMatch && resultMatch[1]) {
            return resultMatch[1];
        }
    } catch(e) {

    }
}
async function txtFile(filePath: string) {
    //pobierz zawartosc pliku txt
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    console.log("filePath", filePath)
    return getAiAnswer(fileContent);
}

async function imgFile(filePath: string) {
    
    const messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Odczytaj treść ze zdjecia. Następnie Jesteś expertem od analizy treści. Przeanalizuj zawartość przesłaną przez usera. Te treści to są części raportów, raporty pochodzą od patrolujący ludzi, zdecyduj czy w treści patrol zauważył obcych ludzi, jakiś intruzów, czy może raportują naprawę maszyn/urządzeń, czy może ani jedno ani drugie, w odpowiedzi umieść jedno ze słów kluczowych people = tylko wtedy jak patrol raportuje że wykrył intruzów bądź ślady wskazują na to że intruz jest i można go zidentyfikować, hardware = w przypadku gdy jest usterka oraz naprawa jakiejś maszyny, aktualizacja to nie naprawa, none = wszystko inne <RESULT>people|hardware|none</RESULT> przed podaniem odpowiedzi dodaj <THINKING></THINKING> Aby potwierdzić poprawność odpowiedzi.",
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": `data:image/jpeg;base64,${await encodeFileToBase64(filePath)}`
                    }
                }
            ]
        }
    ];
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages
    });
    const answerFromAI = response.choices[0].message.content || '';
    console.log("filePath", filePath);
    console.log("answerFromAI", answerFromAI);
    try {
        const resultMatch = answerFromAI?.match(/<RESULT>(.*?)<\/RESULT>/);
        console.log("resultMatch", resultMatch)
        if (resultMatch && resultMatch[1]) {
            return resultMatch[1];
        }
    } catch(e) {

    }
}

async function mp3File(filePath: string) {
    const convertedBuffer = fs.readFileSync(filePath);
    const transcription = await openai.audio.transcriptions.create({
        file: await toFile(convertedBuffer, 'speech.mp3'),
        language: 'pl',
        model: 'whisper-1',
    });
    console.log("filePath", filePath)
    return getAiAnswer(transcription.text);
}

async function encodeFileToBase64(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) reject(err);
            else resolve(data.toString('base64'));
        });
    });
}
