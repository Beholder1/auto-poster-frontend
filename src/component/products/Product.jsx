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
import jwt_decode from "jwt-decode";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import {useQueryClient} from "react-query";

export const Product = ({product, change, setChange}) => {
    const queryClient = useQueryClient();
    const [jwt, setJwt] = useLocalState("", "jwt")
    const userId = jwt_decode(jwt).id;
    const [openEditGame, setOpenEditGame] = useState(false)
    const [openAlert, setOpenAlert] = useState(false);
    const [open, setOpen] = useState(false)
    const [gameToUpdate, setGameToUpdate] = React.useState({
        id: product.id,
        name: ""
    });

    function deleteAccount(id) {
        fetch("api/accounts/" + id, {
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
    }

    const editGame = async () => {
        const response = await fetch("api/games", {
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
                        <Typography sx={{width: "100%"}}>{product.name}</Typography>
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
                    <Typography>Tytuł: {product.title}</Typography>
                    <Divider sx={{marginY: "8px"}}/>
                    <Typography>Cena: {product.price}</Typography>
                    <Divider sx={{marginY: "8px"}}/>
                    <Typography sx={{width: "100%"}}>Kategorie: {product.categories.join(", ")}</Typography>
                    <Divider sx={{marginY: "8px"}}/>
                    <Typography>Opis: {product.description}</Typography>
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
                    <TextField label={"Game"} sx={{width: "100%", marginY: "20px"}} onChange={(event) => {
                        setGameToUpdate({...gameToUpdate, name: event.target.value})
                    }}/>
                    <Button variant="contained" fullWidth type={"submit"} onClick={async () => {
                        let response = await editGame()
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
                            queryClient.invalidateQueries('products')
                            deleteAccount(product.id)
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