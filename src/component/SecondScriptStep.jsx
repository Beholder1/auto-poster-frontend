import {Autocomplete, Stack} from "@mui/material";
import * as React from "react";
import TextField from "@mui/material/TextField";
import {useQuery} from "react-query";
import {ajax} from "../util/fetchService";
import {LoadingFetch} from "./LoadingFetch";
import jwt_decode from "jwt-decode";
import {useLocalState} from "../util/useLocalStorage";
import {useAccountsQuantityStore} from "../util/accountsQuantityStore";

export const SecondScriptStep = () => {
    const accountsQuantity = useAccountsQuantityStore(state => state.mode);
    const setAccountsQuantity = useAccountsQuantityStore(state => state.setMode);
    const [jwt, setJwt] = useLocalState("", "jwt")
    const userId = jwt_decode(jwt).id;
    const {data: accounts, status: accountsStatus} = useQuery('accounts', fetchAccounts)

    async function fetchAccounts() {
        return await ajax(`/api/accounts/${userId}`, 'get', jwt);
    }

    if (accountsStatus === "loading") {
        return <LoadingFetch/>
    }
    let fields = []
    for (let index = 0; index < accountsQuantity; index++) {
        fields.push(
            <Stack mt={2}>
                <Autocomplete
                    options={accounts.accounts}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField required {...params} label={`Konto ${index + 1}`}
                    />}></Autocomplete>
            </Stack>)
    }


    return (
        <>
            {fields}
        </>
    )
}