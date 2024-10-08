import React, {useState} from "react";
import {Box, ThemeProvider} from "@mui/material";
import {Navbar} from "../Navbar";
import {Sidebar} from "../Sidebar";
import {Helmet} from "react-helmet";
import {Refresh} from "./Refresh";

export const RefreshPage = ({theme}) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <ThemeProvider theme={theme}>
            <Helmet>
                <title>Odświeżanie</title>
            </Helmet>
            <Box bgcolor="background.default" color="text.primary">
                <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
                <Box display="flex" flexDirection="row" justifyContent="space-between">
                    <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
                    <Refresh/>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
