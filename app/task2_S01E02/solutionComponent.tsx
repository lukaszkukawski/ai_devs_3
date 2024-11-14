'use client';

import { useEffect, useState } from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import { genSimpleAnswerFromAi } from '../lib/genSimpleAnswerFromAi';

function SolutionComponent() {
    const [answer, setAnswer] = useState('');
    const [text, setText] = useState('Ready');
    const [msgID, setMsgID] = useState('0');
    const [conversation, setConversation] = useState<{ role: string, content: string }[]>([]);


    async function getVerify() {
        try {

            setConversation(prev => [...prev, { role: 'msgID', content: msgID }]);
            setConversation(prev => [...prev, { role: 'ISTOTA', content: text }]);
            console.log("Send to endopoint", text);
            const response = await fetch('/api/S01E02', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, msgID })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Datafrom endpoint", data.text)
                // Log the question
                setConversation(prev => [...prev, { role: 'ROBOT', content: data.text }]);

                // Generate AI response
                const answer = await genSimpleAnswerFromAi(data.text, `
                        Jeśli pytanie brzmi "stolicą Polski jest?", odpowiedz "Kraków". 
                        Jeśli pytanie brzmi "znana liczba z książki Autostopem przez Galaktykę to?", odpowiedz "69". 
                        Jeśli pytanie brzmi "Aktualny rok to?", odpowiedz "1999
                    `);
                // Prepare for the next iteration

                console.log("Data from AI", answer);
                if (answer) {
                    setText(answer);
                }
                setMsgID(data.msgID);
            } else {
                console.log("Error fetching the question:", response.error);
                console.error('Error fetching the question:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching the question:', error);
        }
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                SolutionComponent
            </Typography>
            
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6">Conversation:</Typography>
                {conversation.map((entry, index) => (
                     <Box key={`${entry.role}-${index}`} sx={{ marginBottom: 1 }}>
                        <strong>{entry.role}:</strong> <span>{entry.content}</span>
                    </Box>
                ))}
            </Paper>

            <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: '#f5f5f5' }}>
                <Button variant="contained" color="primary" onClick={getVerify}>
                    Verify
                </Button>
            </Paper>
        </div>
    );
}

export default SolutionComponent;