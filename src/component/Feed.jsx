import React from "react";
import {Autocomplete, Box, Checkbox, Stack, Typography} from "@mui/material";
import {useLocalState} from "../util/useLocalStorage";
import {ajax} from "../util/fetchService";
import {useQuery} from "react-query";
import jwt_decode from "jwt-decode";
import TextField from "@mui/material/TextField";

export const Feed = ({type}) => {
    const [jwt, setJwt] = useLocalState("", "jwt")
    const [page, setPage] = React.useState(1);
    const [refresh, setRefresh] = React.useState(true);
    const userId = jwt_decode(jwt).id;

    const {data: accounts, status: accountsStatus} = useQuery('accounts', fetchAccounts)

    async function fetchAccounts() {
        return await ajax(`/api/accounts/${userId}`, 'get', jwt);
    }

    const defaultAccounts = {
        options: accounts,
        getOptionLabel: (option) => option.name,
    };

    return (
        <Box p={2} sx={{width: "100%", overflow: "auto", height: "calc(100vh - 64px)"}}>
            <Stack direction="row" alignItems="center">
                <Typography>Ukryj przed znajomymi</Typography>
                <Checkbox/>
            </Stack>
            <Stack direction="row" alignItems="center">
                <Typography>Jeden rodzaj produktu</Typography>
                <Checkbox/>
            </Stack>
            <Stack direction="row" alignItems="center">
                <Typography>Wybierz konto: </Typography>
                <Autocomplete
                    {...defaultAccounts}
                    renderInput={(params) => <TextField required {...params} label={"Konto"}
                    />}></Autocomplete>
            </Stack>
        </Box>
    )
}