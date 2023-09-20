import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {FirstScriptStep} from "./FirstScriptStep";
import {SecondScriptStep} from "./SecondScriptStep";
import {ThirdScriptStep} from "./ThirdScriptStep";
import jwt_decode from "jwt-decode";
import {useLocalState} from "../util/useLocalStorage";

const steps = ['Wybierz ustawienia', 'Wybierz konta', 'Wybierz produkty'];

export default function ScriptStepper() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const [jwt, setJwt] = useLocalState("", "jwt")
    const userId = jwt_decode(jwt).id;
    const [scriptBody, setScriptBody] = React.useState({
        accountIds: [],
        productsWithImages: [],
        hideBeforeFriends: ""
    });

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const pickStep = (step) => {
        switch (step) {
            case 0:
                return <FirstScriptStep/>;
            case 1:
                return <SecondScriptStep/>;
            case 2:
                return <ThirdScriptStep/>;
            default:
                break;
        }
    }

    function runScript() {
        fetch(`api/script/${userId}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            },
            method: "POST",
            body: scriptBody
        }).then((response) => {
            if (response.status === 201) {
                return response.json();
            }
        });
    }

    return (
        <Box sx={{width: '100%'}}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <React.Fragment>
                    <Typography sx={{mt: 2, mb: 1}}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                        <Box sx={{flex: '1 1 auto'}}/>
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    {pickStep(activeStep)}
                    <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{mr: 1}}
                        >
                            Wstecz
                        </Button>
                        <Box sx={{flex: '1 1 auto'}}/>

                        <Button
                            onClick={activeStep === steps.length - 1 ? () => runScript() : () => handleNext()}>
                            {activeStep === steps.length - 1 ? 'Uruchom' : 'Dalej'}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
        </Box>
    );
}