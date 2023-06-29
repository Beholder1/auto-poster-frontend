import React, {useState} from "react";
import {Box, ThemeProvider} from "@mui/material";
import {Helmet} from "react-helmet";
import {Navbar} from "../Navbar";
import {Sidebar} from "../Sidebar";
import {AddLocation} from "./AddLocation";
import {Locations} from "./Locations";


export const LocationsPage = ({theme}) => {
    // const theme = useThemeStore(state => state.theme);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [change, setChange] = useState(false)

    return (
        <ThemeProvider theme={theme}>
            <Helmet>
                <title>Lokalizacje</title>
            </Helmet>
            <Box bgcolor={"background.default"} color={"text.primary"}>
                <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
                <Box sx={{display: "flex", flexDirection: "row"}}>
                    <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
                    <Locations change={change} setChange={setChange}/>
                </Box>
                <AddLocation change={change} setChange={setChange}/>
            </Box>
        </ThemeProvider>
    )
}