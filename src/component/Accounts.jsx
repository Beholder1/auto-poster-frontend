import React, {useState} from "react";
import {Box, List, Pagination} from "@mui/material";
import {useLocalState} from "../util/useLocalStorage";
import {ajax} from "../util/fetchService";
import {useQuery} from "react-query";
import {LoadingFetch} from "./LoadingFetch";
import jwt_decode from "jwt-decode";
import TextField from "@mui/material/TextField";
import {Account} from "./Account";

export const Accounts = () => {
    const [jwt, setJwt] = useLocalState("", "jwt")
    const [search, setSearch] = useState("");
    const userId = jwt_decode(jwt).id;
    const [change, setChange] = useState(false)
    const [page, setPage] = React.useState(1);

    const handleChange = (event, value) => {
        setPage(value);
    };

    async function fetchAccounts() {
        let addParam = "";
        if (search !== "") {
            addParam = "?name=" + search
        }
        return await ajax(`/api/accounts/${userId}/details` + addParam, 'get', jwt);
    }

    const {data, status} = useQuery(['accounts', search, change, page], fetchAccounts)

    return (
        <Box sx={{width: "100%", height: "calc(100vh - 64px)", display: "flex", flexDirection: "column"}}>
            <TextField sx={{margin: "20px", width: "calc(100% - 40px)"}}
                       label={"Search"}
                       value={search}
                       onChange={(event) => {
                           setSearch(event.target.value)
                       }}/>
            {status === "loading" ? <LoadingFetch/> :
                <Box p={2} sx={{
                    // width: "100%",
                    // overflow: "auto",
                    // height: "100%",
                    // display: "flex",
                    // flexWrap: "wrap"
                }}>
                    <List sx={{height: "100%"}}>
                        {data.accounts.map((account) => (
                            <React.Fragment key={account.id}>
                                <Account account={account} change={change} setChange={setChange}/>
                            </React.Fragment>
                        ))}
                    </List>
                    <Pagination page={page} onChange={handleChange} count={data.pages}/>
                </Box>}
        </Box>
    )
}