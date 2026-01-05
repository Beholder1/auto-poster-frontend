import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './util/i18n';
import {CssBaseline} from "@mui/material";
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <CssBaseline/>
            <QueryClientProvider client={queryClient}>
                <App/>
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
);
