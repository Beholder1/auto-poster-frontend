import {Checkbox, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";
import TextField from "@mui/material/TextField";
import jwt_decode from "jwt-decode";
import {useLocalState} from "../util/useLocalStorage";
import {useHideBeforeFriendsStore} from "../util/hideBeforeFriendsStore";
import {useOneKindStore} from "../util/oneKindStore";
import {useAccountsQuantityStore} from "../util/accountsQuantityStore";
import {usePostsQuantityStore} from "../util/postsQuantityStore";

export const FirstScriptStep = () => {
    const hideBeforeFriends = useHideBeforeFriendsStore(state => state.mode);
    const setHideBeforeFriends = useHideBeforeFriendsStore(state => state.setMode);
    const oneKind = useOneKindStore(state => state.mode);
    const setOneKind = useOneKindStore(state => state.setMode);
    const accountsQuantity = useAccountsQuantityStore(state => state.mode);
    const setAccountsQuantity = useAccountsQuantityStore(state => state.setMode);
    const postsQuantity = usePostsQuantityStore(state => state.mode);
    const setPostsQuantity = usePostsQuantityStore(state => state.setMode);
    const [jwt, setJwt] = useLocalState("", "jwt")
    const userId = jwt_decode(jwt).id;

    return (
        <>
            <Stack direction="row" alignItems="center" mt={2}>
                <Typography>Ukryj przed znajomymi</Typography>
                <Checkbox checked={hideBeforeFriends} onChange={e => setHideBeforeFriends(!hideBeforeFriends)}/>
            </Stack>
            <Stack direction="row" alignItems="center" mt={2}>
                <Typography>Jeden rodzaj produktu</Typography>
                <Checkbox checked={oneKind} onChange={e => setOneKind(!oneKind)}/>
            </Stack>
            <Stack direction="row" alignItems="center" mt={2}>
                <TextField type="number"
                           value={accountsQuantity}
                           label={"Ilość kont"}
                           onChange={(event) => {
                               event.target.value = event.target.value.includes("-") ? (event.target.value = "") : event.target.value
                               event.target.value = event.target.value.includes("+") ? (event.target.value = "") : event.target.value
                               event.target.value = event.target.value < 1 ? (event.target.value = "") : event.target.value
                               event.target.value = event.target.value > 100 ? (event.target.value = 100) : event.target.value
                               setAccountsQuantity(event.target.value)
                           }}/>
            </Stack>
            <Stack direction="row" alignItems="center" mt={2}>
                <TextField type="number"
                           value={postsQuantity}
                           label={"Ilość ogłoszeń"}
                           onChange={(event) => {
                               event.target.value = event.target.value.includes("-") ? (event.target.value = "") : event.target.value
                               event.target.value = event.target.value.includes("+") ? (event.target.value = "") : event.target.value
                               event.target.value = event.target.value < 1 ? (event.target.value = "") : event.target.value
                               event.target.value = event.target.value > 100 ? (event.target.value = 100) : event.target.value
                               setPostsQuantity(event.target.value)
                           }}/>
            </Stack>
        </>
    )
}