import Image from "next/image";
import styles from "./page.module.css";
import Button from '@mui/material/Button';
import Dashboard from './components/Dashboard';
import Box from '@mui/material/Box';

export default function Home() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>
          <h1>Witaj w aplikacji!</h1>
          <Button variant="contained">Kliknij mnie</Button>
        </div>
      </Box>
    </Box>
  );
}
