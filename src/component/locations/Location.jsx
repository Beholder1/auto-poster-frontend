import {Box, Button, Divider, IconButton, ListItem, Modal, TextField, Typography} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import React, {useState} from "react";
import {useLocalState} from "../../util/useLocalStorage";

export const Location = ({location, change, setChange}) => {
    const [jwt, setJwt] = useLocalState("", "jwt")
    const [openEditLocation, setOpenEditLocation] = useState(false)
    const [locationId, setLocationId] = useState("")
    const [name, setName] = React.useState("");

    function deleteLocation(locationId) {
        fetch("api/locations/" + locationId, {
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

    function editLocation(id, name) {
        let addMember = {
            id: id,
            name: name
        }
        const response = fetch(`/api/locations`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: "PUT",
            body: JSON.stringify(addMember)
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
            <ListItem>
                <Typography marginX={"5px"} sx={{width: "100%"}}>{location.name}</Typography>
                <IconButton onClick={() => {
                    setLocationId(location.id)
                    setOpenEditLocation(true)
                }
                }><Edit/></IconButton>
                <IconButton onClick={() => {
                    deleteLocation(location.id)
                }
                }><Delete color={"error"}/></IconButton>
            </ListItem>
            <Divider/>
            <Modal
                open={openEditLocation}
                onClose={() => setOpenEditLocation(false)} sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
            >
                <Box bgcolor={"background.default"} color={"text.primary"} p={3}
                     borderRadius={5}>
                    <Typography variant={"h6"} textAlign={"center"} marginBottom={"5px"}>Edytuj lokalizację</Typography>
                    <TextField
                        sx={{width: "100%"}}
                        label={"Lokalizacja"}
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                    <Button variant="contained" fullWidth type={"submit"} onClick={() => {
                        editLocation(location.id, name)
                        setOpenEditLocation(false)
                    }}>Edytuj</Button>
                </Box>
            </Modal>
        </>
    )
}