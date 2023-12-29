import React, {useState} from "react";
import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    Fab,
    Modal,
    Snackbar,
    Stack,
    styled,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {Add as AddIcon} from "@mui/icons-material"
import {useLocalState} from "../../util/useLocalStorage";
import {jwtDecode} from "jwt-decode";
import {useTranslation} from "react-i18next";

const StyledModal = styled(Modal)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
})

export const AddAccount = () => {
    const [open, setOpen] = useState(false)
    const [openAlert, setOpenAlert] = useState(false);
    const [jwt, setJwt] = useLocalState("", "jwt")
    const userId = jwtDecode(jwt).id;
    const [account, setAccount] = React.useState({
        name: "",
        email: "",
        password: "",
    });

    function createPost() {
        fetch(`api/accounts/${userId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: "POST",
            body: JSON.stringify(account)
        }).then((response) => {
            if (response.status === 200) {
                return response.json();
            }
        });
    }

    function validate() {
        let message = ""
        if (account.name === "") {
            message = "Nie podano nazwy konta!"
        } else if (account.email === "") {
            message = "Nie podano adresu email!"
        } else if (account.password === "") {
            message = "Nie podano hasła!"
        }
        return message;
    }

    return (
        <>
            <Tooltip onClick={e => setOpen(true)} title={"Add"} sx={{position: "fixed", bottom: 20, right: 20}}>
                <Fab color={"primary"}>
                    <AddIcon/>
                </Fab>
            </Tooltip>
            <StyledModal
                open={open}
                onClose={e => setOpen(false)}
            >
                <Box width={600} height={300} bgcolor={"background.default"} color={"text.primary"} p={3}
                     borderRadius={5}>
                    <Typography variant={"h6"} textAlign={"center"}>Dodaj konto</Typography>
                    <Stack direction={"row"} gap={1} mt={2} mb={3}>
                        <TextField label="Nazwa" sx={{width: "100%"}}
                                   value={account.name}
                                   onChange={(event) => {
                                       setAccount({...account, name: event.target.value})
                                   }}
                        />
                    </Stack>
                    <Stack direction={"row"} gap={1} mt={2} mb={3}>
                        <TextField label="Email" sx={{width: "100%"}}
                                   value={account.email}
                                   onChange={(event) => {
                                       setAccount({...account, email: event.target.value})
                                   }}
                        />
                        <TextField label="Hasło" sx={{width: "100%"}}
                                   value={account.password}
                                   onChange={(event) => {
                                       setAccount({...account, password: event.target.value})
                                   }}
                        />
                    </Stack>
                    <ButtonGroup fullWidth variant="contained">
                        <Button variant="contained" fullWidth type={"submit"}
                                onClick={() => {
                                    if (validate() === "") {
                                        createPost();
                                        setOpen(false);
                                        setAccount({
                                            description: "",
                                            ageMin: "",
                                            ageMax: "",
                                        });
                                    } else {
                                        setOpenAlert(true)
                                    }
                                }}>Dodaj</Button>
                    </ButtonGroup>
                </Box>
            </StyledModal>
            <Snackbar open={openAlert} autoHideDuration={4000} onClose={() => setOpenAlert(false)}>
                <Alert onClose={() => setOpenAlert(false)} severity="error" sx={{width: '100%'}}>
                    {validate()}
                </Alert>
            </Snackbar>
        </>
    )
}