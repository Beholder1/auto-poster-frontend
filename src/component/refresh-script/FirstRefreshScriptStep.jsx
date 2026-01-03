import React from "react";
import {Checkbox, Stack, TextField, Typography} from "@mui/material";
import {useRefreshAccountsQuantityStore, useRefreshAllAccountsStore, useToFinishStore} from "../../util/storage";

const handleInputChange = (event, setter, maxValue = 100) => {
    let value = event.target.value;
    value = value.replace(/[-+]/g, "");
    value = value < 1 ? "" : value;
    value = value > maxValue ? maxValue : value;
    setter(value);
};

export const FirstRefreshScriptStep = () => {
    const refreshAllAccounts = useRefreshAllAccountsStore((state) => state.mode);
    const setRefreshAllAccounts = useRefreshAllAccountsStore((state) => state.setMode);
    const toFinish = useToFinishStore((state) => state.mode);
    const setToFinish = useToFinishStore((state) => state.setMode);
    const refreshAccountsQuantity = useRefreshAccountsQuantityStore((state) => state.mode);
    const setRefreshAccountsQuantity = useRefreshAccountsQuantityStore((state) => state.setMode);

    return (
        <>
            <Stack direction="row" alignItems="center" mt={2}>
                <Typography>Wszystkie konta</Typography>
                <Checkbox checked={refreshAllAccounts} onChange={() => setRefreshAllAccounts(!refreshAllAccounts)}/>
            </Stack>
            <Stack direction="row" alignItems="center" mt={2}>
                <Typography>Do końca</Typography>
                <Checkbox checked={toFinish} onChange={() => setToFinish(!toFinish)}/>
            </Stack>
            <Stack direction="row" alignItems="center" mt={2}>
                <TextField
                    type="number"
                    value={refreshAccountsQuantity}
                    label="Ilość kont"
                    onChange={(event) => handleInputChange(event, setRefreshAccountsQuantity)}
                />
            </Stack>
        </>
    );
};
