'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';

interface TaskLayoutProps {
  title: string;
  content: string;
  solution: string;
}

export default function TaskLayout({ title, content, solution }: TaskLayoutProps) {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: theme.palette.background.default, padding: 2 }}>
      <Typography variant="h4" component="div" gutterBottom sx={{ color: theme.palette.primary.main }}>
        {title}
      </Typography>
      <Accordion sx={{ maxWidth: 800, width: '100%', marginBottom: 2, transition: 'all 0.3s ease', '&:hover': { boxShadow: 3 } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.secondary.main }} />}>
          <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>Treść Zadania</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" color="text.secondary">
            {content}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ maxWidth: 800, width: '100%', transition: 'all 0.3s ease', '&:hover': { boxShadow: 3 } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.secondary.main }} />}>
          <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>Rozwiązanie</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" color="text.secondary">
            {solution}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
} 