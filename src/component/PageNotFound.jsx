import React from "react";
import {Box, ThemeProvider} from "@mui/material";
import {Helmet} from "react-helmet";

export const PageNotFound = ({theme}) => {
    return (
        <ThemeProvider theme={theme}>
            <Helmet>
                <title>Homepage</title>
            </Helmet>
            <Box bgcolor={"background.default"} color={"text.primary"}>
                <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <Box width={"100%"} height={"100vh"} bgcolor={"background.default"}
                         sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <h1>404 Page not found</h1>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    )
}