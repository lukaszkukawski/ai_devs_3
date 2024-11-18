import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { genSimpleAnswerFromAiWithSystem, getRESULT } from '../../lib/genSimpleAnswerFromAi';
import path from 'path';
import { join } from 'path';
import fs from 'fs';


export async function GET(request: NextRequest) {
    const type = request.nextUrl.searchParams.get('type');
    
    console.log("type", type)
    if (type) {
        const response = await generateFacts(type); // Użycie await do obsługi asynchroniczności
        return NextResponse.json({ response });
    }

    return new NextResponse(JSON.stringify({}), {
        status: 500,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

async function generateFacts(type: string) {
    console.log("generateFacts", type);
    const directory = path.join(process.cwd(), 'src/S03E01/' + type);
    const files = fs.readdirSync(directory);
    const factsFilePath = path.join(process.cwd(), `src/S03E01/${type}.txt`);
    const factsContent = fs.readFileSync(factsFilePath, 'utf-8');
    const factsArray = JSON.parse(factsContent);
    if (factsArray.length > 0) {
        return factsArray;
    }
    console.log("files", files);
    for (const file of files) {
        const filePath = path.join(directory, file); 
        console.log("filePath", filePath);
        const fileContent = fs.readFileSync(filePath, 'utf-8'); // Poprawiono: użycie filePath
        const answer = await genSimpleAnswerFromAiWithSystem(fileContent, `Dla każde treści podanej przez usera,  wygeneruj słowa kluczowe w formie mianownika (czyli np. “sportowiec”, a nie “sportowcem”, “sportowców” itp., oraz podaj nazwę osoby której dane słowa kluczowe określają, jeżeli nie ma osoby to nic ne pisz <RESULT>{"person": "Jan Kowalski", "keywords": "sportowiec,naukowiec"}</RESULT>`);
        if (answer) {
            try {
                const result = JSON.parse(getRESULT(answer));
                result.fileName = file; // Dodano: dodanie nazwy pliku do obiektu
                factsArray.push(result);
            } catch(e) {
                console.log("Error parsing answer", e);
            }
        }
    }

    fs.writeFileSync(factsFilePath, JSON.stringify(factsArray, null, 2), 'utf-8');
    return factsArray;
}