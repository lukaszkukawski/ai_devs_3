"use client"
import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import OpenAI from "openai";
import {  genSimpleAnswerFromAi } from '../lib/genSimpleAnswerFromAi';

function SolutionComponent() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [result, setResult] = useState('');
    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await fetch('/api/S01E01', {method: 'GET'});
                console.log("response", response)
                if (response.ok) {
                    const data = await response.json();
                    setQuestion(data.question);
                } else {
                    console.error('Error fetching the question:', response.statusText);
                }
                
            } catch (error) {
                console.error('Error fetching the question:', error);
            }
        };

        fetchQuestion();
    }, []);

    const genAsnwerFromAi = async () => {
        const answer = await genSimpleAnswerFromAi(question);
        if (answer) {
            setAnswer(answer);
        }
        // try {
        //     const openai = new OpenAI({
        //         apiKey: process.env['NEXT_PUBLIC_OPENAI_API_KEY'],
        //         dangerouslyAllowBrowser: true
        //     });
        //     const completion = await openai.chat.completions.create({
        //         model: "gpt-4o",
        //         messages: [
        //             {"role": "system", "content": "Odpowiedz tylko na zadane pytanie jednym słowem lub liczbą, bez dodawania dodatkowych informacji"},
        //             {"role": "user", "content": question}
        //         ]
        //     });

        //     setAnswer(completion.choices[0].message.content || '');
        // } catch (error) {
        //     console.error('Error fetching AI response:', error);
        // }
    };

    const sendForm = async () => {
        const response = await fetch('/api/S01E01', {method: 'POST', body: JSON.stringify({answer: answer})});
        if (response.ok) {
            const data = await response.json();
            setResult(data.result);
        } else {
            console.error('Error sending form:', response.statusText);
        }
        console.log("sendForm")
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                SolutionComponent
            </Typography>
            
                <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                    <Typography variant="h6">Question:</Typography>
                    <Typography>{question}</Typography>
                </Paper>

                <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>

                    <Button variant="contained" color="primary" onClick={genAsnwerFromAi}>
                        Get answer
                    </Button>

                    <Typography variant="h6" sx={{ marginTop: 2 }}>AI Response:</Typography>
                    <Typography>{answer}</Typography>
                </Paper>
                <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>

                    <Button variant="contained" color="primary" onClick={sendForm}>
                        Send Form
                    </Button>

                    <Typography variant="h6" sx={{ marginTop: 2 }}>Result:</Typography>
                    <Typography dangerouslySetInnerHTML={{ __html: result }} />
                </Paper>
        </div>
    );
}

export default SolutionComponent;