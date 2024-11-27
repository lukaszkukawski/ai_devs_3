import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { getOpenAI } from '../../lib/genSimpleAnswerFromAi';
import path from 'path';
import { join } from 'path';
import fs from 'fs';

const openai = await getOpenAI();

export async function GET(request: NextRequest) {
    const type = request.nextUrl.searchParams.get('type');
    if (type == 'jsonl') {
        const response = await generateJsonl();
        return NextResponse.json({ response });
    } else if (type == 'finetuning') {
        const response = await startFinetuning();
        return NextResponse.json({ response });
    } else if (type == 'verify') {
        const question = request.nextUrl.searchParams.get('question');
        const response = await useFineTunedModel(question || "");
        return NextResponse.json({ response });
    } else if(type == 'check') {
        
        const response = await checkFineTuningStatus();
        return NextResponse.json({ response });
    }
    return new NextResponse(JSON.stringify({}), {
        status: 500,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

async function generateJsonl() {
    const correctFilePath = path.join(process.cwd(), 'src/S04E02/correct.txt');
    const incorrectFilePath = path.join(process.cwd(), 'src/S04E02/incorrect.txt');
    const outputFilePath = path.join(process.cwd(), 'src/S04E02/finetuning.jsonl');

    const correctData = fs.readFileSync(correctFilePath, 'utf-8').split('\n').filter(Boolean);
    const incorrectData = fs.readFileSync(incorrectFilePath, 'utf-8').split('\n').filter(Boolean);

    const jsonlData = [];

    correctData.forEach(line => {
        jsonlData.push({
            messages: [
                { "role": "system", "content": "Zweryfikuj poprawność danych" },
                { "role": "user", "content": line },
                { "role": "assistant", "content": "correct" }
            ]
        });
    });

    incorrectData.forEach(line => {
        jsonlData.push({
            messages: [
                { "role": "system", "content": "Zweryfikuj poprawność danych" },
                { "role": "user", "content": line },
                { "role": "assistant", "content": "incorrect" }
            ]
        });
    });

    const jsonlString = jsonlData.map(entry => JSON.stringify(entry)).join('\n');
    fs.writeFileSync(outputFilePath, jsonlString, 'utf-8');

    return jsonlData;
}

async function startFinetuning() {
    try {
        // Prześlij plik do OpenAI
        const fileResponse = await openai.files.create({
            file: fs.createReadStream(path.join(process.cwd(), 'src/S04E02/finetuning.jsonl')),
            purpose: 'fine-tune'
        });

        console.log('File response:', fileResponse);
        if (!fileResponse || !fileResponse.id) {
            throw new Error('Invalid file response from OpenAI');
        }

        const fileId = fileResponse.id;

        // Rozpocznij fine-tuning
        const fineTuneResponse = await openai.fineTuning.jobs.create({
            training_file: fileId,
            model: 'gpt-4o-mini-2024-07-18'
        });

        const fineTunedModelId = fineTuneResponse.id;
        const modelIdFilePath = path.join(process.cwd(), 'src/S04E02/finetuning_ID_model.txt');
        fs.writeFileSync(modelIdFilePath, fineTunedModelId, 'utf-8');

        console.log("fineTuneResponse", fineTuneResponse);

        return fineTuneResponse;
    } catch (error) {
        console.error('Error during fine-tuning:', error);
        throw error;
    }
}

async function useFineTunedModel(prompt: string) {
    try {
        const modelIdFilePath = path.join(process.cwd(), 'src/S04E02/finetuning_ID_model.txt');
        const fineTunedModelId = fs.readFileSync(modelIdFilePath, 'utf-8').trim();

        const response = await openai.completions.create({
            model: fineTunedModelId,
            prompt: prompt,
            max_tokens: 150
        });

        return response.data.choices[0].text;
    } catch (error) {
        console.error('Error using fine-tuned model:', error);
        throw error;
    }
}

async function checkFineTuningStatus() {
    try {
        let message = "";
        const modelIdFilePath = path.join(process.cwd(), 'src/S04E02/finetuning_ID_model.txt');
        const fineTuneId = fs.readFileSync(modelIdFilePath, 'utf-8').trim();

        const fineTuneStatusResponse = await openai.fineTuning.jobs.retrieve(fineTuneId);
        console.log('Fine-tuning status:', fineTuneStatusResponse.status);

        console.log("fineTuneStatusResponse", fineTuneStatusResponse)
        if (fineTuneStatusResponse.status === 'succeeded'){
            message = 'Fine-tuning completed successfully.'
        } else if (fineTuneStatusResponse.status === 'failed') {
            message = 'Fine-tuning failed.';
        } else {
            message = 'Fine-tuning is still in progress.';
        }
        return message;
    } catch (error) {
        console.error('Error checking fine-tuning status:', error);
    }
}