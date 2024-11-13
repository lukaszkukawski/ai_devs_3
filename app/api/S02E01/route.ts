import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import OpenAI, { toFile } from "openai";

const openai = new OpenAI({
    apiKey: process.env['NEXT_PUBLIC_OPENAI_API_KEY'],
    dangerouslyAllowBrowser: true
});

export async function GET(request: NextRequest) {
    const directory = path.join(process.cwd(), 'src/przesluchania');
    const transcriptions = await transcribeFiles(directory);

    return NextResponse.json({ text: transcriptions });
}

async function transcribeFiles(directory: string) {
    const files = fs.readdirSync(directory);
    let transcriptions = "";

    for (const file of files) {
        const filePath = path.join(directory, file);
        const fileExtension = path.extname(file).toLowerCase();
        let convertedBuffer;

        if (fileExtension === '.m4a') {
            const ffmpeg = require('fluent-ffmpeg');
            const tempFilePath = path.join(directory, 'temp.ogg');

            await new Promise((resolve, reject) => {
                ffmpeg(filePath)
                    .toFormat('ogg')
                    .on('end', () => {
                        convertedBuffer = fs.readFileSync(tempFilePath);
                        fs.unlinkSync(tempFilePath); // Remove temporary file
                        resolve();
                    })
                    .on('error', (err) => {
                        console.error('Error converting file:', err);
                        reject(err);
                    })
                    .save(tempFilePath);
            });
        } else {
            convertedBuffer = fs.readFileSync(filePath);
        }
        try {
            if (convertedBuffer) {
                const transcription = await openai.audio.transcriptions.create({
                    file: await toFile(convertedBuffer, 'speech.mp3'),
                    language: 'pl',
                    model: 'whisper-1',
                });
                transcriptions += " =="  + file + "==\n" + transcription.text + "\n\n";
            } else {
                console.error('convertedBuffer is not generating, error during transcription', );
            }
        } catch (error) {
            console.error(`Transcription error for ${file}:`, error);
            //transcriptions = 'Error during transcription';
        }
    }

    return transcriptions;
}