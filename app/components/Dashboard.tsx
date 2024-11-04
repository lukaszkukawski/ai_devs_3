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
  { id: 1, title: 'Poligon#1', path: '/task_1_Poligon', icon: <AssignmentIcon /> },
  { id: 2, title: 'S01E01#2', path: '/task2_S01E01', icon: <AssignmentIcon /> },
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