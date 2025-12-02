import '@mantine/core/styles.css';
import { createRoot } from 'react-dom/client';
import { App } from './components/App/App';
import { JeopardyHome } from './components/Home/Home';
import React from 'react';
import { createTheme, MantineProvider } from '@mantine/core';
import { AdminApp } from './components/Admin/AdminApp';
import { DisplayApp } from './components/Display/DisplayApp';

const theme = createTheme({
  /** Put your mantine theme override here */
});

const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('game');
const path = window.location.pathname;
const isAdmin = path.startsWith('/admin');
const isDisplay = path.startsWith('/display');
const isHome = !Boolean(gameId) && !isAdmin && !isDisplay;
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <MantineProvider theme={theme} forceColorScheme="dark">
      {isHome ? (
        <JeopardyHome />
      ) : isAdmin ? (
        <AdminApp />
      ) : isDisplay ? (
        <DisplayApp />
      ) : (
        <App />
      )}
    </MantineProvider>
  </React.StrictMode>,
);
