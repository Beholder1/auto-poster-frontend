import {Autocomplete, Stack} from "@mui/material";
import * as React from "react";
import TextField from "@mui/material/TextField";
import {useQuery} from "@tanstack/react-query";
import {ajax} from "../../util/fetchService";
import {LoadingFetch} from "../LoadingFetch";
import {useLocalState} from "../../util/useLocalStorage";
import {useAccountsQuantityStore} from "../../util/storage";
import {useSearchParams} from "react-router-dom";

export const SecondScriptStep = () => {
    const accountsQuantity = useAccountsQuantityStore(state => state.mode);
    const setAccountsQuantity = useAccountsQuantityStore(state => state.setMode);
    const [jwt, setJwt] = useLocalState("", "jwt")
    const { data: accounts, status: accountsStatus } = useQuery({
        queryKey: ['accounts'],
        queryFn: fetchAccounts
    });
    const [urlParams, setUrlParams] = useSearchParams()


    async function fetchAccounts() {
        return await ajax(`/api/accounts`, 'get', jwt);
    }

    if (accountsStatus === "pending") {
        return <LoadingFetch/>
    }
    let fields = []
    for (let index = 0; index < accountsQuantity; index++) {
        fields.push(
            <Stack mt={2} key={index}>
                <Autocomplete
                    defaultValue={urlParams.get(`account${index + 1}`) !== null
                        ? accounts.accounts.find((o) => o.id === Number(urlParams.get(`account${index + 1}`)))
                        : null}
                    options={accounts.accounts}
                    getOptionLabel={(option) => option.name}
                    onChange={(e, value) => setUrlParams(value != null ? `?${urlParams != null ? urlParams + '&' : ''}${new URLSearchParams(`account${index + 1}=${value.id}`)}` : () => {
                        urlParams.delete(`account${index + 1}`)
                        return urlParams
                    })}
                    renderInput={(params) => <TextField required {...params} label={`Konto ${index + 1}`}/>}>
                </Autocomplete>
            </Stack>)
    }


    return (
        <>
            {fields}
        </>
    )
}