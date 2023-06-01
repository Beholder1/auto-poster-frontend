import React from "react"
import {Box, CircularProgress, ThemeProvider} from "@mui/material";

export const LoadingPage = ({theme}) => {
    return (
        <ThemeProvider theme={theme}>
            <Box width={"100%"} height={"100vh"} bgcolor={"background.default"}
                 sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <CircularProgress color={"primary"} size={"5rem"}/>
            </Box>
        </ThemeProvider>
    );
}