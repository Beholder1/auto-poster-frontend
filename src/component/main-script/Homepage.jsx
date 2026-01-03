import React, {useMemo, useState} from "react";
import {Box} from "@mui/material";
import {Navbar} from "../Navbar";
import {Sidebar} from "../Sidebar";
import {Feed} from "./Feed";
import {Helmet} from "react-helmet";

export const Homepage = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const layout = useMemo(() => (
        <Box display="flex" flexDirection="row" justifyContent="space-between">
            <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
            <Feed/>
        </Box>
    ), [mobileOpen]);

    return (
        <>
            <Helmet>
                <title>Strona główna</title>
            </Helmet>
            <Box bgcolor="background.default" color="text.primary" sx={{ minHeight: '100vh' }}>
                <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
                {layout}
            </Box>
        </>
    );
}
