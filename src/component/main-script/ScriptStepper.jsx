import {useCallback, useMemo, useState} from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {FirstScriptStep} from "./FirstScriptStep";
import {SecondScriptStep} from "./SecondScriptStep";
import {ThirdScriptStep} from "./ThirdScriptStep";
import {useLocalState} from "../../util/useLocalStorage";
import {useSearchParams} from "react-router-dom";
import {useHideBeforeFriendsStore} from "../../util/storage";
import {ajax} from "../../util/fetchService";

const steps = ['Wybierz ustawienia', 'Wybierz konta', 'Wybierz produkty'];

export default function ScriptStepper() {
    const hideBeforeFriends = useHideBeforeFriendsStore(state => state.mode);
    const [activeStep, setActiveStep] = useState(0);
    const [jwt] = useLocalState("", "jwt")
    const [urlParams] = useSearchParams()

    const handleNext = useCallback(() => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }, []);

    const handleBack = useCallback(() => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }, []);

    const handleReset = useCallback(() => {
        setActiveStep(0);
    }, []);

    const currentStepContent = useMemo(() => {
        switch (activeStep) {
            case 0:
                return <FirstScriptStep/>;
            case 1:
                return <SecondScriptStep/>;
            case 2:
                return <ThirdScriptStep/>;
            default:
                return null;
        }
    }, [activeStep]);

    const runScript = useCallback(async () => {
        let accountIds = []
        let productIds = []
        urlParams.forEach((v, k) => {
            if (k.startsWith('account')) {
                accountIds.push(Number(v))
            }
            if (k.startsWith('product')) {
                productIds.push(Number(v))
            }
        })
        let scriptBody = {
            accountIds: accountIds,
            productsWithImages: productIds,
            hideBeforeFriends: hideBeforeFriends
        }
        
        try {
            await ajax(`api/script`, 'POST', jwt, scriptBody);
            handleNext();
        } catch (e) {
            console.error("Failed to run script:", e);
        }
    }, [jwt, urlParams, hideBeforeFriends, handleNext]);

    return (
        <Box sx={{width: '100%'}}>
            <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length ? (
                <>
                    <Typography sx={{mt: 2, mb: 1}}>
                        Wszystkie kroki zakończone - skrypt został uruchomiony!
                    </Typography>
                    <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                        <Box sx={{flex: '1 1 auto'}}/>
                        <Button onClick={handleReset}>Resetuj</Button>
                    </Box>
                </>
            ) : (
                <>
                    {currentStepContent}
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
                            onClick={activeStep === steps.length - 1 ? runScript : handleNext}>
                            {activeStep === steps.length - 1 ? 'Uruchom' : 'Dalej'}
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
}