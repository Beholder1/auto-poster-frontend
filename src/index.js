import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {CssBaseline} from "@mui/material";
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev";

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
                <DevSupport ComponentPreviews={ComponentPreviews}
                            useInitialHook={useInitial}
                >
                    <App/>
                </DevSupport>
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
);
