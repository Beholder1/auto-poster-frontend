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
    ImageList,
    ImageListItem,
    ImageListItemBar,
    ListItem,
    Modal,
    Snackbar,
    Stack,
    styled,
    Typography
} from "@mui/material";
import {Delete, Edit, ImageSearch} from "@mui/icons-material";
import {useLocalState} from "../../util/useLocalStorage";
import {jwtDecode} from "jwt-decode";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import {useQuery, useQueryClient} from "react-query";
import {LoadingFetch} from "../LoadingFetch";
import {ajax} from "../../util/fetchService";

const StyledModal = styled(Modal)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
});

export const Product = ({product, change, setChange}) => {
    const queryClient = useQueryClient();
    const [jwt, setJwt] = useLocalState("", "jwt")
    const [selectedProductId, setSelectedProductId] = useState(null);
    const userId = jwtDecode(jwt).id;
    const [openEditProduct, setOpenEditProduct] = useState(false)
    const [openAlert, setOpenAlert] = useState(false);
    const [open, setOpen] = useState(false)
    const [openImages, setOpenImages] = useState(false)
    const [fetchImagesTrigger, setFetchImagesTrigger] = useState(false);
    const {data: images, status: imageStatus} = useQuery(
        ['images', selectedProductId],
        () => fetchImages(selectedProductId),
        {enabled: fetchImagesTrigger}
    );
    const [gameToUpdate, setGameToUpdate] = React.useState({
        id: product.id,
        name: ""
    });

    async function fetchImages(productId) {
        return await ajax(`/api/products/${productId}/images`, 'get', jwt);
    }

    function deleteProduct(id) {
        fetch("api/products/" + userId + "/" + id, {
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

    const editProduct = async () => {
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
                        <IconButton
                            onClick={() => {
                                setSelectedProductId(product.id);
                                setFetchImagesTrigger(true);
                                setOpenImages(true);
                            }}
                        ><ImageSearch/>
                        </IconButton>
                        <IconButton onClick={() => {
                            setOpenEditProduct(true)
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
                open={openEditProduct}
                onClose={() => setOpenEditProduct(false)} sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
            >
                <Box bgcolor={"background.default"} color={"text.primary"} p={3}
                     borderRadius={5}>
                    <Typography variant={"h6"} textAlign={"center"} marginBottom={"5px"}>Edit game name</Typography>
                    <TextField label={"Produkt"} sx={{width: "100%", marginY: "20px"}} onChange={(event) => {
                        setGameToUpdate({...gameToUpdate, name: event.target.value})
                    }}/>
                    <Button variant="contained" fullWidth type={"submit"} onClick={async () => {
                        let response = await editProduct()
                        if (response === "Error") {
                            setOpenAlert(true)
                        } else {
                            setOpenEditProduct(false)
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
                            deleteProduct(product.id)
                            setOpen(false)
                        }}>Yes</Button>
                    </Stack>
                </Box>
            </Modal>
            <StyledModal
                open={openImages}
                onClose={() => {
                    setOpenImages(false);
                    setFetchImagesTrigger(false);
                }}
            >
                {imageStatus === "loading" ?
                    <LoadingFetch/>
                    :
                    <Box width="90%" bgcolor={"background.default"} color={"text.primary"} p={3}
                         borderRadius={5} height={"90%"}>
                        <Typography variant={"h6"} textAlign={"center"}>Zdjęcia dla {product.name}</Typography>
                        <Stack sx={{flexDirection: {xs: 'column', sm: 'row'}}}>
                            <ImageList sx={{width: {xs: '100%', sm: '50%'}, height: 520}} rowHeight={164} cols={3}>
                                {images && images.images && images.images.map((item, i) => (
                                    <ImageListItem key={i}>
                                        <img
                                            src={`data:image/jpeg;base64,${item.url}`}
                                            alt={item.name}
                                        />
                                        <ImageListItemBar
                                            title={item.name}
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </Stack>
                    </Box>}
            </StyledModal>
            <Snackbar open={openAlert} autoHideDuration={4000} onClose={() => setOpenAlert(false)}>
                <Alert onClose={() => setOpenAlert(false)} severity="error" sx={{width: '100%'}}>
                    Game already exists!
                </Alert>
            </Snackbar>
        </>
    )
}