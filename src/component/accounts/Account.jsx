import React, {useState} from "react";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    Divider,
    IconButton,
    ListItem,
    Modal,
    Snackbar,
    Stack,
    Typography
} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import {useLocalState} from "../../util/useLocalStorage";
import {jwtDecode} from "jwt-decode";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import {useQueryClient} from "react-query";

export const Account = ({account, change, setChange}) => {
    const queryClient = useQueryClient();
    const [jwt, setJwt] = useLocalState("", "jwt")
    const userId = jwtDecode(jwt).id;
    const [openEditGame, setOpenEditGame] = useState(false)
    const [openAlert, setOpenAlert] = useState(false);
    const [open, setOpen] = useState(false)
    const [gameToUpdate, setGameToUpdate] = React.useState({
        id: account.id,
        name: ""
    });

    function deleteAccount(id) {
        fetch(`api/accounts/${userId}/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: "DELETE",
        }).then((response) => {
            if (response.status === 200) {
                return response.json();
            }
        });
        setChange(!change)
    }

    const editAccount = async () => {
        const response = await fetch("api/accounts", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: "PUT",
            body: JSON.stringify(gameToUpdate)
        });

        if (response.status === 200) {
            setChange(!change)
            return "Success";
        } else {
            return "Error";
        }
    }

    return (
        <>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}>
                    <ListItem>
                        <Typography sx={{width: "100%"}}>{account.name}</Typography>
                        <IconButton onClick={() => {
                            setOpenEditGame(true)
                        }
                        }><Edit/></IconButton>
                        <IconButton onClick={() => setOpen(true)}>
                            <Delete color={"error"}/>
                        </IconButton>
                    </ListItem>
                </AccordionSummary>
                <Divider/>
                <AccordionDetails>
                    <Typography>Email: {account.email}</Typography>
                    <Divider sx={{marginY: "8px"}}/>
                    <Typography>Hasło: {account.password}</Typography>
                </AccordionDetails>
            </Accordion>
            <Modal
                open={openEditGame}
                onClose={() => setOpenEditGame(false)} sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
            >
                <Box bgcolor={"background.default"} color={"text.primary"} p={3}
                     borderRadius={5}>
                    <Typography variant={"h6"} textAlign={"center"} marginBottom={"5px"}>Edit game name</Typography>
                    <TextField label={"Konto"} sx={{width: "100%", marginY: "20px"}} onChange={(event) => {
                        setGameToUpdate({...gameToUpdate, name: event.target.value})
                    }}/>
                    <Button variant="contained" fullWidth type={"submit"} onClick={async () => {
                        let response = await editAccount()
                        if (response === "Error") {
                            setOpenAlert(true)
                        } else {
                            setOpenEditGame(false)
                            setGameToUpdate({...gameToUpdate, name: ""});
                        }
                    }}>Save</Button>
                </Box>
            </Modal>
            <Modal
                open={open}
                onClose={() => setOpen(false)} sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
            >
                <Box bgcolor={"background.default"} color={"text.primary"} p={3}
                     borderRadius={5}>
                    <Typography variant={"h6"} textAlign={"center"} marginBottom={"5px"}>Czy na pewno chcesz usunąć to
                        konto?</Typography>
                    <Stack direction={"row"}>
                        <Button variant="text" fullWidth type={"submit"} onClick={() => setOpen(false)}>No</Button>
                        <Button variant="text" fullWidth type={"submit"} onClick={() => {
                            queryClient.invalidateQueries('accounts')
                            deleteAccount(account.id)
                            setOpen(false)
                        }}>Yes</Button>
                    </Stack>
                </Box>
            </Modal>
            <Snackbar open={openAlert} autoHideDuration={4000} onClose={() => setOpenAlert(false)}>
                <Alert onClose={() => setOpenAlert(false)} severity="error" sx={{width: '100%'}}>
                    Game already exists!
                </Alert>
            </Snackbar>
        </>
    )
}