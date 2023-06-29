import React from "react";
import {Box} from "@mui/material";
import ScriptStepper from "./ScriptStepper";

export const Feed = () => {
    return (
        <Box p={2} sx={{width: "100%", overflow: "auto", height: "calc(100vh - 64px)"}}>

            <ScriptStepper/>

        </Box>
    )
}