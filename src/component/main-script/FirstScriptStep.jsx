import React from "react";
import {Checkbox, Stack, TextField, Typography} from "@mui/material";
import {jwtDecode} from "jwt-decode";
import {useLocalState} from "../../util/useLocalStorage";
import {
    useAccountsQuantityStore,
    useHideBeforeFriendsStore,
    useOneKindStore,
    usePostsQuantityStore
} from "../../util/storage";

const handleInputChange = (event, setter, maxValue = 100) => {
    let value = event.target.value;
    value = value.replace(/[-+]/g, "");
    value = value < 1 ? "" : value;
    value = value > maxValue ? maxValue : value;
    setter(value);
};

export const FirstScriptStep = () => {
    const hideBeforeFriends = useHideBeforeFriendsStore((state) => state.mode);
    const setHideBeforeFriends = useHideBeforeFriendsStore((state) => state.setMode);
    const oneKind = useOneKindStore((state) => state.mode);
    const setOneKind = useOneKindStore((state) => state.setMode);
    const accountsQuantity = useAccountsQuantityStore((state) => state.mode);
    const setAccountsQuantity = useAccountsQuantityStore((state) => state.setMode);
    const postsQuantity = usePostsQuantityStore((state) => state.mode);
    const setPostsQuantity = usePostsQuantityStore((state) => state.setMode);
    const [jwt, setJwt] = useLocalState("", "jwt");
    const userId = jwtDecode(jwt).id;

    return (
        <>
            <Stack direction="row" alignItems="center" mt={2}>
                <Typography>Ukryj przed znajomymi</Typography>
                <Checkbox checked={hideBeforeFriends} onChange={() => setHideBeforeFriends(!hideBeforeFriends)}/>
            </Stack>
            <Stack direction="row" alignItems="center" mt={2}>
                <Typography>Jeden rodzaj produktu</Typography>
                <Checkbox checked={oneKind} onChange={() => setOneKind(!oneKind)}/>
            </Stack>
            <Stack direction="row" alignItems="center" mt={2}>
                <TextField
                    type="number"
                    value={accountsQuantity}
                    label="Ilość kont"
                    onChange={(event) => handleInputChange(event, setAccountsQuantity)}
                />
            </Stack>
            <Stack direction="row" alignItems="center" mt={2}>
                <TextField
                    type="number"
                    value={postsQuantity}
                    label="Ilość ogłoszeń"
                    onChange={(event) => handleInputChange(event, setPostsQuantity)}
                />
            </Stack>
        </>
    );
};
