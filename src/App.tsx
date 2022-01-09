import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core';
import { blue, pink } from '@material-ui/core/colors';
import Home from './pages/Home';
import "@fontsource/roboto";

const theme = createTheme({
  palette: {
      primary: blue,
      secondary: pink,
  }
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
    </div>
  );
}

export default App;
