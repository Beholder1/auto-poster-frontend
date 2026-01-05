import React, {useCallback, useState} from "react";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    Divider,
    IconButton,
    Modal,
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import {useLocalState} from "../../util/useLocalStorage";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ajax} from "../../util/fetchService";

export const Account = React.memo(({account, change, setChange}) => {
    const queryClient = useQueryClient();
    const [jwt] = useLocalState("", "jwt")
    const [openEditGame, setOpenEditGame] = useState(false)
    const [openAlert, setOpenAlert] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [gameToUpdate, setGameToUpdate] = useState({
        id: account.id,
        name: ""
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => ajax(`/api/accounts/${id}`, 'delete', jwt),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            setChange(!change);
        }
    });

    const editMutation = useMutation({
        mutationFn: (data) => ajax(`/api/accounts`, 'put', jwt, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            setChange(!change);
            setOpenEditGame(false);
            setGameToUpdate(prev => ({ ...prev, name: "" }));
        },
        onError: () => {
            setOpenAlert(true);
        }
    });

    const handleDelete = useCallback(() => {
        deleteMutation.mutate(account.id);
        setOpenDeleteModal(false);
    }, [account.id, deleteMutation]);

    const handleEditSave = useCallback(() => {
        editMutation.mutate(gameToUpdate);
    }, [gameToUpdate, editMutation]);

    const handleEditChange = useCallback((event) => {
        setGameToUpdate(prev => ({...prev, name: event.target.value}));
    }, []);

    return (
        <>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    component="div"
                    sx={{
                        '& .MuiAccordionSummary-content': {
                            alignItems: 'center',
                            margin: 0
                        },
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'action.hover',
                        }
                    }}
                >
                    <Typography sx={{ flexGrow: 1 }}>{account.name}</Typography>
                    
                    <Box sx={{ display: 'flex' }} onClick={(e) => e.stopPropagation()}>
                        <IconButton onClick={() => setOpenEditGame(true)}>
                            <Edit/>
                        </IconButton>
                        <IconButton onClick={() => setOpen(true)}>
                            <Delete color={"error"}/>
                        </IconButton>
                    </Box>
                </AccordionSummary>
                <Divider/>
                <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">Email: {account.email}</Typography>
                    <Divider sx={{marginY: "8px"}}/>
                    <Typography variant="body2" color="text.secondary">Hasło: {account.password}</Typography>
                </AccordionDetails>
            </Accordion>
            
            <Modal
                open={openEditGame}
                onClose={() => setOpenEditGame(false)} 
                sx={{display: "flex", alignItems: "center", justifyContent: "center"}}
            >
                <Box bgcolor={"background.default"} color={"text.primary"} p={3} borderRadius={5} sx={{width: 400}}>
                    <Typography variant={"h6"} textAlign={"center"} marginBottom={"5px"}>Edit game name</Typography>
                    <TextField 
                        label={"Konto"} 
                        sx={{width: "100%", marginY: "20px"}} 
                        value={gameToUpdate.name}
                        onChange={handleEditChange}
                    />
                    <Button 
                        variant="contained" 
                        fullWidth 
                        onClick={handleEditSave}
                        disabled={editMutation.isLoading}
                    >
                        {editMutation.isLoading ? "Saving..." : "Save"}
                    </Button>
                </Box>
            </Modal>

            <Modal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)} 
                sx={{display: "flex", alignItems: "center", justifyContent: "center"}}
            >
                <Box bgcolor={"background.default"} color={"text.primary"} p={3} borderRadius={5}>
                    <Typography variant={"h6"} textAlign={"center"} marginBottom={"5px"}>
                        Czy na pewno chcesz usunąć to konto?
                    </Typography>
                    <Stack direction={"row"} spacing={2} sx={{mt: 2}}>
                        <Button variant="outlined" fullWidth onClick={() => setOpenDeleteModal(false)}>No</Button>
                        <Button 
                            variant="contained" 
                            color="error" 
                            fullWidth 
                            onClick={handleDelete}
                            disabled={deleteMutation.isLoading}
                        >
                            Yes
                        </Button>
                    </Stack>
                </Box>
            </Modal>

            <Snackbar open={openAlert} autoHideDuration={4000} onClose={() => setOpenAlert(false)}>
                <Alert onClose={() => setOpenAlert(false)} severity="error" sx={{width: '100%'}}>
                    Error updating account!
                </Alert>
            </Snackbar>
        </>
    )
});