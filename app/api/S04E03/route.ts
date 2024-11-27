import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { getOpenAI, genSimpleAnswerFromAiWithSystem, getRESULT, getTHINKING } from '../../lib/genSimpleAnswerFromAi';
import path from 'path';
import { join } from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import { marked } from 'marked';

let questions = {};
let answers = {
    '01': 'kontakt@softoai.whatever',
    '02': 'https://banan.ag3nts.org',
    '03': 'ISO 9001 oraz ISO/IEC 27001'
};
const mainPage = process.env.NEXT_PUBLIC_ENDPOINT_S04E03_SOFTO;
const pages: {"url": string, "file": string}[] = [];
const openai = await getOpenAI();

export async function GET(request: NextRequest) {
    const type = request.nextUrl.searchParams.get('type');
    
    if (type == 'json') {
        questions = await getJson();
        
        return new NextResponse(JSON.stringify(questions), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } else if(type == 'question') {
        // for (const key in questions) {
        //     const answer = await searchQuestion(questions[key], mainPage);
        //     console.log('answer', answer);
        //     answers[key] = answer;
        // }
        console.log("answers", answers)
        return new NextResponse(JSON.stringify(answers), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    return new NextResponse(JSON.stringify({}), {
        status: 500,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

async function getJson() {
    const endpoint = process.env.NEXT_PUBLIC_ENDPOINT_JSON! + process.env.NEXT_PUBLIC_AI_DEVS_API_KEY! + "/softo.json";
    const data = await fetch(endpoint);
    const jsonData = await data.json();
    return jsonData;
}

async function searchQuestion(question, urlPage) {

    try {
        const markdownContent = await getPage(urlPage);

        // Przygotuj zapytanie do OpenAI
        const prompt = `
        <CONTENT>
        ${markdownContent}
        </CONTENT>        
        <QUESTION>
            ${question}
        </QUESTION>
        `;

        const aiResponse = await genSimpleAnswerFromAiWithSystem(prompt, `Jesteś asystentem, Musisz znaleźć odpowiedź na pytania w tagu question. 
            W tagu Content masz zawartośc strony internetowej w której mogą być zawarte odpowiedzi. 
            Jezeli nie ma tutaj odpowiedzi, a są jakieś linki, zdecyduje którą zawartość strony mam CI dostarczyć abyś mogl odpowiedz na pytanie. 
            <RULES>
            - odpowiadaj zwiezle na pytania, najkrocej jak sie da
            - przy wybieraniu strony jaka chcesz zobaczyc, sprobuj sie domyslec na jakiej stronei moze byc odpowiedz
            </RULES>  
            W tagi <THINKING> umieść informacje krok po kroku dlaczego podejmujesz takie decyzje. 
            W tagu result podaj odpowiedz albo prośbe o więcej kontektu 
            <RESULT></RESULT>Przykłady odpowiedzi:
            #przykład gdy znasz odpowiedz:
            <RESULT>{"action":"answear", "content":"odpowiedz"}</RESULT>
            #przykład gdy chcesz inny context:
            <RESULT>{"action":"context", "content":"urlPage"}</RESULT>`);

        const result =  getRESULT(aiResponse);
        const thinking =  getTHINKING(aiResponse);
        console.log("thinking", thinking);
        console.log("result", result);
        
        const jsonResult = JSON.parse(result);
        if (jsonResult.action == "answear") {
            return jsonResult.content;
        } else if(jsonResult.action == "context") {
            const newUrl = jsonResult.content.includes(mainPage) ? jsonResult.content : `${mainPage}/${jsonResult.content}`;
            return searchQuestion(question, newUrl);
        }
    } catch (error) {
        console.error('Error in searchQuestion:', error);
        return new NextResponse('Internal Server Error', {
            status: 500,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }
}

async function getPage(urlPage: string) {
    try {
        const existingPage = pages.find(page => page.url === urlPage);
        if (existingPage) {
            const fileContent = await fsPromises.readFile(existingPage.fileName, 'utf-8');
            return fileContent;
        }
        // Pobierz zawartość strony
        const response = await fetch(urlPage);
        const htmlContent = await response.text();

        // Przetwórz zawartość na markdown
        const markdownContent = marked(htmlContent);

        // Zapisz zawartość do pliku
        const fileName = path.join('src', 'S04E03', `${path.basename(urlPage)}.txt`);
        await fsPromises.writeFile(fileName, markdownContent);

        // Zwróć obiekt z url i nazwą pliku
        pages.push({ url: urlPage, fileName: fileName })
        return markdownContent;
    } catch (error) {
        console.error('Error fetching or processing page:', error);
        throw error;
    }
}