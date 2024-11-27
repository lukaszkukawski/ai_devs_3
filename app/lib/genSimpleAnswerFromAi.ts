import OpenAI, { toFile } from "openai";

export const getOpenAI = async () => {
    const openai = new OpenAI({
        apiKey: process.env['NEXT_PUBLIC_OPENAI_API_KEY'],
        dangerouslyAllowBrowser: true
    });
    return openai;
}

export const  genSimpleAnswerFromAi = async (question: string, content: string = "") => {
    try {
        const openai = await getOpenAI();
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {"role": "system", "content": "Odpowiedz tylko na zadane pytanie jednym słowem lub liczbą, bez dodawania dodatkowych informacji " + content}, 
                {"role": "user", "content": question}
            ]
        });
        console.log("Data from AI genSimpleAnswerFromAi", completion.choices[0].message.content);
        return completion.choices[0].message.content || '';
    } catch (error) {
        console.error('Error fetching AI response:', error);
    }
};

export const genSimpleAnswerFromAiWithSystem = async (question: string, content: string) => {
    try {
        //console.log("question", question);
        //console.log("content", content);

        const openai = await getOpenAI();
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {"role": "system", "content": content}, 
                {"role": "user", "content": question}
            ]
        });
        console.log("Data from AI genSimpleAnswerFromAi", completion.choices[0].message.content);
        return completion.choices[0].message.content || '';
    } catch (error) {
        console.error('Error fetching AI response:', error);
    }
};

export const genDescriptionImageFromAi = async (imageBase64: string, imageName: string) => {
    const openai = await getOpenAI();

    const response = await openai.chat.completions.create({ 
        model: "gpt-4o",
        messages: [
            {
                "role": "system",
                "content": `Generate an accurate and comprehensive description of the provided image, incorporating both visual analysis and the given contextual information.
                    <prompt_objective>
                    To produce a detailed, factual description of the image that blends the context provided by the user and the contents of the image.

                    Note: ignore green border.
                    </prompt_objective>
                    <prompt_rules>
                    - ANALYZE the provided image thoroughly, noting all significant visual elements
                    - INCORPORATE the given context into your description, ensuring it aligns with and enhances the visual information
                    - GENERATE a single, cohesive paragraph that describes the image comprehensively
                    - BLEND visual observations seamlessly with the provided contextual information
                    - ENSURE consistency between the visual elements and the given context
                    - PRIORITIZE accuracy and factual information over artistic interpretation
                    - INCLUDE relevant details about style, composition, and notable features of the image
                    - ABSOLUTELY FORBIDDEN to invent details not visible in the image or mentioned in the context
                    - NEVER contradict information provided in the context
                    - UNDER NO CIRCUMSTANCES include personal opinions or subjective interpretations
                    - IF there's a discrepancy between the image and the context, prioritize the visual information and note the inconsistency
                    - MAINTAIN a neutral, descriptive tone throughout the description
                    </prompt_rules>
                    Using the provided image and context, generate a rich, accurate description that captures both the visual essence of the image and the relevant background information. Your description should be informative, cohesive, and enhance the viewer's understanding of the image's content and significance.`
                
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": { 
                            "url": `data:image/jpeg;base64,${imageBase64}` 
                        }
                    },
                    {
                        "type": "text",
                        "text": `Write a description of the image ${imageName}.  A good description briefly describes what is on the image, and uses the context to make it more relevant to the article. The purpose of this description is for summarizing the article, so we need just an essence of the image considering the context, not a detailed description of what is on the image.`
                    }
                ]
            }
        ]
    });
    const result = response.choices[0].message.content || '';
    return result;
};

export const genTranscriptionsAudioFromAi = async (convertedBuffer: Buffer, fileName: string) => {
    const openai = await getOpenAI();
    console.log("response", convertedBuffer)


    const transcription = await openai.audio.transcriptions.create({
        file: await toFile(convertedBuffer, 'speech.mp3'),
        language: 'pl',
        model: 'whisper-1',
    });
    return transcription.text;
}

export const getRESULT = (answerFromAI: string): string => {
    try {
        const resultMatch = answerFromAI?.replace(/\n/g, '').match(/<RESULT>(.*?)<\/RESULT>/);
        //const resultMatch = answerFromAI?.match(/<RESULT>(.*?)<\/RESULT>/);
        if (resultMatch && resultMatch[1]) {
            return resultMatch[1];
        }
        return "";
    } catch(e) {
        return "";
    }
}
export const getTHINKING = (answerFromAI: string): string => {
    try {
        const resultMatch = answerFromAI?.match(/<THINKING>(.*?)<\/THINKING>/);
        if (resultMatch && resultMatch[1]) {
            return resultMatch[1];
        }
        return "";
    } catch(e) {
        return "";
    }
}