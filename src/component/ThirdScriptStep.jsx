import {Autocomplete, Stack} from "@mui/material";
import * as React from "react";
import TextField from "@mui/material/TextField";
import {useQuery} from "react-query";
import {ajax} from "../util/fetchService";
import {LoadingFetch} from "./LoadingFetch";
import jwt_decode from "jwt-decode";
import {useLocalState} from "../util/useLocalStorage";
import {usePostsQuantityStore} from "../util/postsQuantityStore";

export const ThirdScriptStep = () => {
    const postsQuantity = usePostsQuantityStore(state => state.mode);
    const setPostsQuantity = usePostsQuantityStore(state => state.setMode);
    const [jwt, setJwt] = useLocalState("", "jwt")
    const userId = jwt_decode(jwt).id;
    const {data: products, status: productStatus} = useQuery('products', fetchProducts)

    async function fetchProducts() {
        return await ajax(`/api/products/${userId}/brief`, 'get', jwt);
    }

    if (productStatus === "loading") {
        return <LoadingFetch/>
    }
    let fields = []
    for (let index = 0; index < postsQuantity; index++) {
        fields.push(
            <Stack mt={2}>
                <Autocomplete
                    options={products.products}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField required {...params} label={`Produkt ${index + 1}`}
                    />}></Autocomplete>
            </Stack>)
    }

    return (
        <>
            {fields}
        </>
    )
}