import React, {useState} from "react";
import {Box, ThemeProvider} from "@mui/material";
import {Navbar} from "./Navbar";
import {Sidebar} from "./Sidebar";
import {Feed} from "./Feed";
import {Helmet} from "react-helmet";

export const Homepage = ({theme}) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <ThemeProvider theme={theme}>
            <Helmet>
                <title>Strona główna</title>
            </Helmet>
            <Box bgcolor={"background.default"} color={"text.primary"}>
                <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
                <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
                    <Feed/>
                </Box>
            </Box>
        </ThemeProvider>
    )
}