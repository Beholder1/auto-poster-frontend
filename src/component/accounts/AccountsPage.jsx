import React from "react";
import {Box, ThemeProvider} from "@mui/material";
import {Navbar} from "../Navbar";
import {Sidebar} from "../Sidebar";
import {Helmet} from "react-helmet";
import {Accounts} from "./Accounts";
import {AddAccount} from "./AddAccount";


export const AccountsPage = ({theme}) => {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    return (
        <ThemeProvider theme={theme}>
            <Helmet>
                <title>Konta</title>
            </Helmet>
            <Box bgcolor={"background.default"} color={"text.primary"}>
                <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
                <Box sx={{display: "flex", flexDirection: "row"}}>
                    <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
                    <Accounts/>
                </Box>
                <AddAccount/>
            </Box>
        </ThemeProvider>
    )
}