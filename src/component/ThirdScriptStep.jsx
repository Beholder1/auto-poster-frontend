import {
    Autocomplete,
    Box,
    IconButton,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Modal,
    Stack,
    styled,
    Typography
} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import TextField from "@mui/material/TextField";
import {useQuery} from "react-query";
import {ajax} from "../util/fetchService";
import {LoadingFetch} from "./LoadingFetch";
import {jwtDecode} from "jwt-decode";
import {useLocalState} from "../util/useLocalStorage";
import {usePostsQuantityStore} from "../util/postsQuantityStore";
import {useSearchParams} from "react-router-dom";
import {ImageSearch} from "@mui/icons-material";

const StyledModal = styled(Modal)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
});

export const ThirdScriptStep = () => {
    const [open, setOpen] = useState(false);
    const [fetchImagesTrigger, setFetchImagesTrigger] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const postsQuantity = usePostsQuantityStore(state => state.mode);
    const [jwt, setJwt] = useLocalState("", "jwt");
    const userId = jwtDecode(jwt).id;
    const [urlParams, setUrlParams] = useSearchParams();
    const {data: images, status: imageStatus} = useQuery(
        ['images', selectedProductId],
        () => fetchImages(selectedProductId),
        {enabled: fetchImagesTrigger}
    );
    const {data: products, status: productStatus} = useQuery('products', fetchProducts);

    async function fetchProducts() {
        return await ajax(`/api/products/${userId}/brief`, 'get', jwt);
    }

    async function fetchImages(productId) {
        return await ajax(`/api/products/${productId}/images`, 'get', jwt);
    }

    if (productStatus === "loading") {
        return <LoadingFetch/>;
    }

    const handleProductChange = (index, value) => {
        const updatedSelectedProducts = [...selectedProducts];
        updatedSelectedProducts[index] = value ? value.id : null;
        setSelectedProducts(updatedSelectedProducts);
    };

    let fields = [];
    for (let index = 0; index < postsQuantity; index++) {
        fields.push(
            <Stack mt={2} key={index} direction="row">
                <Autocomplete
                    sx={{width: "100%", marginRight: "10px"}}
                    defaultValue={urlParams.get(`product${index + 1}`) !== null
                        ? products.products.find((o) => o.id === Number(urlParams.get(`product${index + 1}`)))
                        : null}
                    options={products.products}
                    getOptionLabel={(option) => option.name}
                    onChange={(e, value) => {
                        handleProductChange(index, value);
                        setUrlParams(value != null ? `?${urlParams != null ? urlParams + '&' : ''}${new URLSearchParams(`product${index + 1}=${value.id}`)}` : () => {
                            urlParams.delete(`product${index + 1}`);
                            return urlParams;
                        });
                    }}
                    renderInput={(params) => <TextField required {...params} label={`Produkt ${index + 1}`}
                    />}></Autocomplete>
                <TextField sx={{marginRight: "10px"}}></TextField>
                <IconButton
                    onClick={() => {
                        setSelectedProductId(selectedProducts[index]);
                        setFetchImagesTrigger(true);
                        setOpen(true);
                    }}
                    disabled={!selectedProducts[index]}
                ><ImageSearch/>
                </IconButton>
            </Stack>);
    }

    return (
        <>
            {fields}

            <StyledModal
                open={open}
                onClose={() => {
                    setOpen(false);
                    setFetchImagesTrigger(false);
                }}
            >
                {imageStatus === "loading" ?
                    <LoadingFetch/>
                    :
                    <Box width="90%" bgcolor={"background.default"} color={"text.primary"} p={3}
                         borderRadius={5} height={"90%"}>
                        <Typography variant={"h6"} textAlign={"center"}>Dodaj produkt</Typography>
                        <Stack sx={{flexDirection: {xs: 'column', sm: 'row'}}}>
                            <ImageList sx={{width: {xs: '100%', sm: '50%'}, height: 520}} rowHeight={164} cols={3}>
                                {images && images.images && images.images.map((item, i) => (
                                    <ImageListItem key={i}>
                                        <img
                                            src={item.url}  // Assuming item.url is the image URL or base64 string
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
        </>
    );
};
