import {Box, Button, Divider, IconButton, ListItem, Modal, Typography} from "@mui/material";
import {Delete, GroupAdd} from "@mui/icons-material";
import React, {useState} from "react";
import {useLocalState} from "../../util/useLocalStorage";
import jwt_decode from "jwt-decode";

export const Location = ({location, change, setChange}) => {
    const [jwt, setJwt] = useLocalState("", "jwt")
    const userId = jwt_decode(jwt).id;
    const [openAddMember, setOpenAddMember] = useState(false)
    const [team, setTeam] = useState("")
    const [locationId, setLocationId] = useState("")
    const [reFetch, setReFetch] = useState(false)

    function deleteLocation(locationId) {
        fetch("api/locations/" + userId + "/" + locationId, {
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

    function addToTeam(id, teamId) {
        let addMember = {
            teamId: teamId,
            userId: id,
            adminId: userId
        }
        fetch("/api/teams/add-member", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: "POST",
            body: JSON.stringify(addMember)
        }).then((response) => {
            if (response.status === 200) {
                return response.json();
            }
        });
    }

    return (
        <>
            <ListItem>
                <Typography marginX={"5px"} sx={{width: "100%"}}>{location.name}</Typography>
                <IconButton onClick={() => {
                    setLocationId(location.id)
                    setReFetch(!reFetch)
                    setOpenAddMember(true)
                }
                }><GroupAdd/></IconButton>
                <IconButton onClick={() => {
                    deleteLocation(location.id)
                }
                }><Delete color={"error"}/></IconButton>
            </ListItem>
            <Divider/>
            <Modal
                open={openAddMember}
                onClose={() => setOpenAddMember(false)} sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
            >
                <Box bgcolor={"background.default"} color={"text.primary"} p={3}
                     borderRadius={5}>
                    <Typography variant={"h6"} textAlign={"center"} marginBottom={"5px"}>Add friend
                        to your
                        team</Typography>
                    <Button variant="contained" fullWidth type={"submit"} onClick={() => {
                        addToTeam(location.id, team)
                        setOpenAddMember(false)
                    }}>Add</Button>
                </Box>
            </Modal>
        </>
    )
}