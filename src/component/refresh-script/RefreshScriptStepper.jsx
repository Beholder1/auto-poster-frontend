import React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {jwtDecode} from "jwt-decode";
import {useLocalState} from "../../util/useLocalStorage";
import {useSearchParams} from "react-router-dom";
import {FirstRefreshScriptStep} from "./FirstRefreshScriptStep";
import {SecondRefreshScriptStep} from "./SecondRefreshScriptStep";
import {useRefreshAllAccountsStore, useToFinishStore} from "../../util/storage";

const steps = ['Wybierz ustawienia', 'Wybierz konta'];

export default function RefreshScriptStepper() {
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [jwt, setJwt] = useLocalState("", "jwt");
    const userId = jwtDecode(jwt).id;
    const [urlParams, setUrlParams] = useSearchParams();
    const refreshAllAccounts = useRefreshAllAccountsStore((state) => state.mode);
    const toFinish = useToFinishStore((state) => state.mode);

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
                return <FirstRefreshScriptStep/>;
            case 1:
                return <SecondRefreshScriptStep/>;
            default:
                break;
        }
    };

    function runScript() {
        let accountIds = [];
        urlParams.forEach((v, k) => {
            if (k.startsWith('account')) {
                accountIds.push(Number(v));
            }
        });
        let scriptBody = {
            accountIds: accountIds,
            allAccounts: refreshAllAccounts,
            refresh: toFinish
        };
        fetch(`api/script/refresh/${userId}`, {
            headers: {
                'Content-Type': 'application/JSON',
                Authorization: `Bearer ${jwt}`,
            },
            method: "POST",
            body: JSON.stringify(scriptBody),
        }).then((response) => {
            if (response.status === 200) {
                return response.json();
            }
        });
    }

    return (
        <Box sx={{width: '100%'}}>
            {!refreshAllAccounts && (
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
            )}
            {activeStep === steps.length || refreshAllAccounts ? (
                <>
                    {refreshAllAccounts ? (
                        <>
                            {pickStep(0)}
                            <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                                <Box sx={{flex: '1 1 auto'}}/>
                                <Button onClick={runScript}>Uruchom</Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Typography sx={{mt: 2, mb: 1}}>
                                All steps completed - you&apos;re finished
                            </Typography>
                            <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                                <Box sx={{flex: '1 1 auto'}}/>
                                <Button onClick={handleReset}>Reset</Button>
                            </Box>
                        </>
                    )}
                </>
            ) : (
                <>
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
                </>
            )}
        </Box>
    );
}
