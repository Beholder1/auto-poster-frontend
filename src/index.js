import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {CssBaseline, ThemeProvider} from "@mui/material";
import {theme} from "./theme";
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <CssBaseline/>
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <App/>
                </QueryClientProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
