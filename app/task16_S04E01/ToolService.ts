import { getRESULT, getTHINKING, genSimpleAnswerFromAiWithSystem, getOpenAI } from '../lib/genSimpleAnswerFromAi';

const openai = await getOpenAI();

export class ToolService {
    actions = ["REPAIR","DARKEN", "BRIGHTEN"];

    constructor(addLog) {

    }

    async getImages(message: string) {
        const response = await genSimpleAnswerFromAiWithSystem(message, `Z treści od usera spróbuj wydobyć linki do zdjęć, zwróc mi te linki w formie tablicy <RESULT>['link1', 'lisnk2', itp]</RESULT>`);

        const result = getRESULT(response || "");
        return result;
    }

    async analyzImage(base64) {

        const messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Spróbuj odczytać zawartość zdjęcia. Zdęcie moe być uszkodzone, bądź nieczytelne. Oceń czy zdjęcie wymaga naprawy lub jakiej korekty, masz mozliwosc wyboru 4 opcji: REPAIR - naprawa zdjęcia zawierającego szumy/glitche, DARKEN - przyciemnienie fotografii, BRIGHTEN - rozjaśnienie fotografii, lub NONE - czyli ze zdjęcia jest wyraźne i jesteś w stanie odczytaj co na nim jest. Najpierw w <THINKING></THINKING> umieść swoją analizę i krok po kroku dlaczego dochodzisz do takiej odpowiedzi, a w <RESULT></RESULT> napisz mi tylko jedno słowo REPAIR, DARKEN, BRIGHTEN lub NONE",
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": `data:image/jpeg;base64,${base64}`
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

        //const result = getRESULT(response);
        return answerFromAI;
    }
}