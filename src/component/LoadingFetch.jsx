import React from "react";
import {Box, CircularProgress} from "@mui/material";

export const LoadingFetch = () => {
    return (
        <Box
            width="100%"
            height="100vh"
            bgcolor="background.default"
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <CircularProgress color="primary" size="3rem"/>
        </Box>
    );
}
