'use client';

import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { usePathname } from 'next/navigation';

const tasks = [
  { id: 1, title: 'Poligon#0', path: '/task0_Poligon', icon: <AssignmentIcon /> },
  { id: 2, title: 'S01E01#1', path: '/task1_S01E01', icon: <AssignmentIcon /> },
  { id: 3, title: 'S01E02#2', path: '/task2_S01E02', icon: <AssignmentIcon /> },
  { id: 4, title: 'S01E03#3', path: '/task3_S01E03', icon: <AssignmentIcon /> },
  { id: 5, title: 'S01E05#5', path: '/task5_S01E05', icon: <AssignmentIcon /> },
  { id: 6, title: 'S02E01#6', path: '/task6_S02E01', icon: <AssignmentIcon /> },
  { id: 7, title: 'S02E02#7', path: '/task7_S02E02', icon: <AssignmentIcon /> },
  { id: 8, title: 'S02E03#8', path: '/task8_S02E03', icon: <AssignmentIcon /> },
  { id: 9, title: 'S02E04#9', path: '/task9_S02E04', icon: <AssignmentIcon /> },
  { id: 10, title: 'S02E05#10', path: '/task10_S02E05', icon: <AssignmentIcon /> },
  { id: 11, title: 'S03E01#11', path: '/task11_S03E01', icon: <AssignmentIcon /> },
  { id: 12, title: 'S03E02#12', path: '/task12_S03E02', icon: <AssignmentIcon /> },
  { id: 13, title: 'S03E03#13', path: '/task13_S03E03', icon: <AssignmentIcon /> },
  { id: 14, title: 'S03E04#14', path: '/task14_S03E04', icon: <AssignmentIcon /> },
  { id: 15, title: 'S03E05#15', path: '/task15_S03E05', icon: <AssignmentIcon /> },
  { id: 16, title: 'S04E01#16', path: '/task16_S04E01', icon: <AssignmentIcon /> },
  { id: 17, title: 'S04E02#17', path: '/task17_S04E02', icon: <AssignmentIcon /> },
  { id: 18, title: 'S04E03#18', path: '/task18_S04E03', icon: <AssignmentIcon /> },
  
  // Dodaj więcej zadań według potrzeb
];

export default function Dashboard() {
  const pathname = usePathname();

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ width: 250, backgroundColor: '#ffffff', height: '100vh', padding: 0, margin: 0, boxShadow: 3 }}>
        <List>
          {tasks.map(task => (
            <ListItem key={task.id} disablePadding sx={{ width: '100%' }}>
              <ButtonBase
                component={Link}
                href={task.path}
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  width: '100%',
                  padding: '10px 16px',
                  transition: 'background-color 0.3s ease',
                  backgroundColor: pathname === task.path ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemIcon>
                  {task.icon}
                </ListItemIcon>
                <ListItemText primary={task.title} />
              </ButtonBase>
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );
} 