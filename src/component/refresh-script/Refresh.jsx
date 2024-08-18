import React from "react";
import {Box} from "@mui/material";
import RefreshScriptStepper from "./RefreshScriptStepper";

export const Refresh = () => {
    return (
        <Box p={2} sx={{width: "100%", overflow: "auto", height: "calc(100vh - 64px)"}}>
            <RefreshScriptStepper/>
        </Box>
    )
}