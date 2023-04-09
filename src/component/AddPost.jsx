import React, {useState} from "react";
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
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
import {ajax} from "../../util/fetchService";
import {useQuery} from "react-query";
import jwt_decode from "jwt-decode";
import {LoadingFetch} from "../loading/LoadingFetch";

const StyledModal = styled(Modal)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
})

const UserBox = styled(Box)({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px"
})

export const AddPost = () => {
    const [open, setOpen] = useState(false)
    const [openAlert, setOpenAlert] = useState(false);
    const [jwt, setJwt] = useLocalState("", "jwt")
    const [isGamePicked, setIsGamePicked] = useState(false)
    const [game, setGame] = React.useState(1);
    const [rank, setRank] = React.useState("");
    const [value, setValue] = React.useState(null);
    const userId = jwt_decode(jwt).id;
    const [post, setPost] = React.useState({
        type: "",
        userId: "",
        gameId: "",
        rankId: "",
        languageId: "",
        description: "",
        ageMin: "",
        ageMax: "",
    });
    const CHARACTER_LIMIT = 250;
    const [values, setValues] = React.useState({
        name: ""
    });
    const {data: games, status: gameStatus} = useQuery('games', fetchGames)
    const {data: ranks, status: rankStatus} = useQuery(['ranks', isGamePicked, game], fetchRanks)
    const {data: languages, status: languageStatus} = useQuery('languages', fetchLanguages)

    async function fetchGames() {
        return await ajax('/api/games', 'get', jwt);
    }

    async function fetchRanks() {
        return await ajax(`/api/ranks?game=${game}`, 'get', jwt);
    }

    async function fetchLanguages() {
        return await ajax('/api/languages', 'get', jwt);
    }

    function createPost() {
        let postToPost;
        postToPost = {...post, userId: userId}
        fetch("api/posts", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            method: "POST",
            body: JSON.stringify(postToPost)
        }).then((response) => {
            if (response.status === 200) {
                return response.json();
            }
        });
    }

    const defaultGames = {
        options: games,
        getOptionLabel: (option) => option.name,
    };
    const defaultLanguages = {
        options: languages,
        getOptionLabel: (option) => option.name,
    };
    const defaultRanks = {
        options: ranks,
        getOptionLabel: (option) => option.name,
    };

    function validate() {
        let message = ""
        if (post.type === "") {
            message = "Post type is required!"
        } else if (post.gameId === "") {
            message = "Game is required!"
        } else if (post.description === "") {
            message = "Description is required!"
        } else if (post.ageMin > post.ageMax && post.ageMin !== "" && post.ageMax !== "") {
            message = "Max age must be greater tha Min age!"
        }
        return message;
    }

    const handleClear = () => {
        setRank("")
        setValue(null);
    };

    if (gameStatus === "loading" || languageStatus === "loading") {
        return <LoadingFetch/>
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
                <Box width={600} height={620} bgcolor={"background.default"} color={"text.primary"} p={3}
                     borderRadius={5}>
                    <Typography variant={"h6"} textAlign={"center"}>Create post</Typography>
                    <Stack direction={"row"} gap={1} mt={2} mb={3}>
                        <Autocomplete
                            sx={{width: "100%"}}
                            disablePortal
                            options={['solo', 'team']}
                            renderInput={(params) => <TextField required {...params} label="Type"/>}
                            onChange={(e, value) => post.type = value}/>
                        <Autocomplete
                            {...defaultLanguages}
                            sx={{width: "100%"}}
                            disablePortal
                            renderInput={(params) => <TextField {...params} label="Language"/>}
                            onChange={(e, value) => post.languageId = value ? value.id : ""}/>
                    </Stack>
                    <Stack direction={"row"} gap={1} mt={2} mb={3}>
                        <Autocomplete
                            {...defaultGames}
                            sx={{width: "100%"}}
                            disablePortal
                            renderInput={(params) => <TextField required {...params} label="Game"/>}
                            onChange={(e, value) => {
                                if (value) {
                                    setIsGamePicked(true)
                                } else {
                                    setIsGamePicked(false)
                                }
                                handleClear()
                                setGame(value ? value.id : 1)
                                post.gameId = value ? value.id : ""
                            }}/>
                    </Stack>
                    <Stack direction={"row"} gap={1} mt={2} mb={3}>
                        {rankStatus === "loading" ? <CircularProgress color={"primary"} size={"3rem"}/> : <Autocomplete
                            disabled={!isGamePicked}
                            value={value}
                            {...defaultRanks}
                            sx={{width: "100%"}}
                            disablePortal
                            renderInput={(params) => <TextField {...params} label="Rank"/>}
                            onChange={(e, newValue) => {
                                setRank("test")
                                setValue(newValue)
                                console.log(newValue)
                                post.rankId = newValue ? newValue.id : ""
                            }}/>}
                    </Stack>
                    <Stack direction={"row"} gap={1} mt={2} mb={3}>
                        <TextField label="Min age" sx={{width: "100%"}}
                                   type="number"
                                   value={post.ageMin}
                                   onChange={(event) => {
                                       event.target.value = event.target.value.includes("-") ? (event.target.value = "") : event.target.value
                                       event.target.value = event.target.value.includes("+") ? (event.target.value = "") : event.target.value
                                       event.target.value = event.target.value < 1 ? (event.target.value = "") : event.target.value
                                       event.target.value = event.target.value > 100 ? (event.target.value = 100) : event.target.value
                                       setPost({...post, ageMin: event.target.value})
                                   }}
                        />
                        <TextField label="Max age" sx={{width: "100%"}}
                                   type="number"
                                   value={post.ageMax}
                                   onChange={(event) => {
                                       event.target.value = event.target.value.includes("-") ? (event.target.value = "") : event.target.value
                                       event.target.value = event.target.value.includes("+") ? (event.target.value = "") : event.target.value
                                       event.target.value = event.target.value < 1 ? (event.target.value = "") : event.target.value
                                       event.target.value = event.target.value > 100 ? (event.target.value = 100) : event.target.value
                                       setPost({...post, ageMax: event.target.value})
                                   }}
                        />
                    </Stack>
                    <TextField
                        sx={{width: "100%"}}
                        id="standard-multiline-static"
                        multiline
                        rows={5}
                        label="Description"
                        variant="standard"
                        required
                        spellCheck={"false"}

                        inputProps={{
                            maxLength: CHARACTER_LIMIT
                        }}
                        value={post.description}
                        helperText={`${values.name.length}/${CHARACTER_LIMIT}`}
                        onChange={(event) => {
                            setValues({...values, name: event.target.value});
                            setPost({...post, description: event.target.value})
                        }}
                    />
                    <ButtonGroup fullWidth variant="contained">
                        <Button variant="contained" fullWidth type={"submit"}
                                onClick={() => {
                                    if (validate() === "") {
                                        createPost();
                                        setOpen(false);
                                        setPost({
                                            type: "",
                                            gameId: "",
                                            rankId: "",
                                            languageId: "",
                                            description: "",
                                            ageMin: "",
                                            ageMax: "",
                                        });
                                        setValues({name: ""});
                                    } else {
                                        setOpenAlert(true)
                                    }
                                }}>Post</Button>
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