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
import jwt_decode from "jwt-decode";

const StyledModal = styled(Modal)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
})

export const AddLocation = ({change, setChange}) => {
    const [open, setOpen] = useState(false)
    const [jwt, setJwt] = useLocalState("", "jwt")
    const userId = jwt_decode(jwt).id;
    const [name, setName] = React.useState("");
    const [openAlert, setOpenAlert] = useState(false);

    const addLocation = async (name) => {
        const response = await fetch(`api/locations/${userId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: "POST",
            body: JSON.stringify({
                name: name,
            })
        });

        if (response.status === 201) {
            return "Success";
        } else {
            return "Error";
        }
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
                <Box width={400} height={220} bgcolor={"background.default"} color={"text.primary"} p={3}
                     borderRadius={5}>
                    <Typography variant={"h6"} textAlign={"center"}>Dodaj lokalizację</Typography>
                    <Stack direction={"row"} mt={2} mb={3}>
                        <TextField
                            sx={{width: "100%"}}
                            label={"Lokalizacja"}
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </Stack>
                    <ButtonGroup fullWidth variant="contained">
                        <Button variant="contained" fullWidth type={"submit"}
                                onClick={async () => {
                                    let response = await addLocation(name);
                                    if (response === "Error") {
                                        setOpenAlert(true)
                                    } else {
                                        setOpen(false);
                                        setName("");
                                        setChange(!change)
                                    }
                                }}>Dodaj</Button>
                    </ButtonGroup>
                </Box>
            </StyledModal>
            <Snackbar open={openAlert} autoHideDuration={4000} onClose={() => setOpenAlert(false)}>
                <Alert onClose={() => setOpenAlert(false)} severity="error" sx={{width: '100%'}}>
                    Lokalizacja już istnieje
                </Alert>
            </Snackbar>
        </>
    )
}