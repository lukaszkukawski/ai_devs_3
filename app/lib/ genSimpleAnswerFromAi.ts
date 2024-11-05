import OpenAI from "openai";

export const  genSimpleAnswerFromAi = async (question: string, content: string = "") => {
    try {
        const openai = new OpenAI({
            apiKey: process.env['NEXT_PUBLIC_OPENAI_API_KEY'],
            dangerouslyAllowBrowser: true
        });
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