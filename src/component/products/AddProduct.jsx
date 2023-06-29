import React, {useRef, useState} from "react";
import {
    Alert,
    Autocomplete,
    Badge,
    Box,
    Button,
    Divider,
    Fab,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Modal,
    Snackbar,
    Stack,
    styled,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {Add as AddIcon, Clear} from "@mui/icons-material"
import {useLocalState} from "../../util/useLocalStorage";
import {ajax} from "../../util/fetchService";
import {useQuery} from "react-query";
import jwt_decode from "jwt-decode";
import {LoadingFetch} from "../LoadingFetch";

const StyledModal = styled(Modal)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
})

export const AddProduct = () => {
    const [open, setOpen] = useState(false)
    const [openAlert, setOpenAlert] = useState(false);
    const [jwt, setJwt] = useLocalState("", "jwt")
    const userId = jwt_decode(jwt).id;
    const inputFile = useRef(null)
    const [images, setImages] = useState([]);
    const [product, setProduct] = React.useState({
        name: "",
        title: "",
        price: "",
        categoryId: "",
        description: ""
    });
    const [values, setValues] = React.useState({
        name: ""
    });

    const {data: categories, status: categoryStatus} = useQuery('categories', fetchCategories)

    async function fetchCategories() {
        return await ajax('/api/categories', 'get', jwt);
    }

    function createPost() {
        let postToPost;
        postToPost = {...product, userId: userId}
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

    function validate() {
        let message = ""
        if (product.type === "") {
            message = "Post type is required!"
        } else if (product.gameId === "") {
            message = "Game is required!"
        } else if (product.description === "") {
            message = "Description is required!"
        }
        return message;
    }

    if (categoryStatus === "loading") {
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
                onClose={e => {
                    setOpen(false)
                    setImages([])
                }}
            >
                <Box width="90%" bgcolor={"background.default"} color={"text.primary"} p={3}
                     borderRadius={5} height={"90%"}>
                    <Typography variant={"h6"} textAlign={"center"}>Dodaj produkt</Typography>
                    <Stack direction={"row"}>
                        <Stack width={"50%"}>
                            <Stack direction={"row"} gap={1} mt={2} mb={3}>
                                <TextField label="Nazwa" sx={{width: "100%"}}
                                           value={product.name}
                                           onChange={(event) => {
                                               setProduct({...product, name: event.target.value})
                                           }}
                                />
                            </Stack>
                            <Stack direction={"row"} gap={1} mt={2} mb={3}>
                                <TextField label="Tytuł" sx={{width: "100%"}}
                                           value={product.title}
                                           onChange={(event) => {
                                               setProduct({...product, title: event.target.value})
                                           }}
                                />
                            </Stack>
                            <Stack direction={"row"} gap={1} mt={2} mb={3}>
                                <TextField label="Cena" sx={{width: "100%"}}
                                           type="number"
                                           value={product.price}
                                           onChange={(event) => {
                                               event.target.value = event.target.value.includes("-") ? (event.target.value = "") : event.target.value
                                               event.target.value = event.target.value.includes("+") ? (event.target.value = "") : event.target.value
                                               event.target.value = event.target.value < 1 ? (event.target.value = "") : event.target.value
                                               setProduct({...product, price: event.target.value})
                                           }}
                                />
                                <Autocomplete
                                    options={categories.categories}
                                    getOptionLabel={(option) => option.name}
                                    sx={{width: "100%"}}
                                    disablePortal
                                    renderInput={(params) => <TextField {...params} label="Kategoria"/>}
                                    onChange={(e, value) => product.categoryId = value ? value.id : ""}/>
                            </Stack>
                            <TextField
                                sx={{width: "100%"}}
                                id="standard-multiline-static"
                                multiline
                                rows={6}
                                label="Opis"
                                variant="standard"
                                required
                                spellCheck={"false"}
                                value={product.description}
                                onChange={(event) => {
                                    setValues({...values, name: event.target.value});
                                    setProduct({...product, description: event.target.value})
                                }}
                            />
                        </Stack>
                        <Divider orientation={"vertical"} flexItem sx={{m: 2, display: {xs: 'none', sm: 'block'}}}/>
                        <ImageList sx={{width: "50%", height: 520}} cols={3} rowHeight={164}>
                            {images.map((item, i) => (
                                <Badge sx={{m: "7px"}} badgeContent={<Clear fontSize={"inherit"}/>} color="error">
                                    <ImageListItem key={i}>
                                        <img
                                            src={`${URL.createObjectURL(item)}`}
                                            srcSet={`${URL.createObjectURL(item)}`}
                                            alt={item.title}
                                        />
                                        <ImageListItemBar
                                            title={item.name}
                                        />
                                    </ImageListItem>
                                </Badge>
                            ))}
                            <input type='file' multiple accept={"image/*"} ref={inputFile} style={{display: 'none'}}
                                   onChange={(e) => {
                                       setImages([...images, ...e.target.files])
                                   }}/>
                            <ImageListItem
                                onClick={() => {
                                    inputFile.current.click();
                                }}
                                sx={{
                                    m: "7px",
                                    display: 'flex',
                                    alignText: 'center',
                                    backgroundColor: (theme) =>
                                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
                                }}
                            >
                                <Stack direction="row" alignItems="center" justifyContent="center" width={"100%"}
                                       height={"100%"}>
                                    <AddIcon color={"primary"} fontSize={"large"}/>
                                </Stack>
                            </ImageListItem>
                        </ImageList>

                    </Stack>
                    <Button variant="contained" fullWidth type={"submit"}
                            onClick={() => {
                                if (validate() === "") {
                                    createPost();
                                    setOpen(false);
                                    setProduct({
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
                            }}>Post
                    </Button>
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