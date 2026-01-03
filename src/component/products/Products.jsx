import React, {useCallback, useState} from "react";
import {Box, List, Pagination, TextField} from "@mui/material";
import {useLocalState} from "../../util/useLocalStorage";
import {ajax} from "../../util/fetchService";
import {useQuery} from "react-query";
import {LoadingFetch} from "../LoadingFetch";
import {Product} from "./Product";
import {useDebounce} from "../../util/useDebounce";

export const Products = () => {
    const [jwt] = useLocalState("", "jwt")
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [change, setChange] = useState(false)
    const [page, setPage] = useState(1);

    const handlePageChange = useCallback((event, value) => {
        setPage(value);
    }, []);

    const fetchProducts = useCallback(async () => {
        let addParam = "";
        if (debouncedSearch !== "") {
            addParam = "?name=" + encodeURIComponent(debouncedSearch)
        }
        return await ajax(`/api/products` + addParam, 'get', jwt);
    }, [jwt, debouncedSearch]);

    const {data, status} = useQuery(['products', debouncedSearch, change, page], fetchProducts, {
        keepPreviousData: true,
        staleTime: 5000
    });

    const handleSearchChange = useCallback((event) => {
        setSearch(event.target.value);
        setPage(1);
    }, []);

    return (
        <Box sx={{width: "100%", height: "calc(100vh - 64px)", display: "flex", flexDirection: "column"}}>
            <TextField sx={{margin: "20px", width: "calc(100% - 40px)"}}
                       label={"Search"}
                       value={search}
                       onChange={handleSearchChange}/>
            {status === "loading" ? <LoadingFetch/> :
                <Box p={2}>
                    <List sx={{height: "100%"}}>
                        {data?.products?.map((product) => (
                            <Product key={product.id} product={product} change={change} setChange={setChange}/>
                        ))}
                    </List>
                    {data?.pages > 1 && (
                        <Pagination page={page} onChange={handlePageChange} count={data.pages}/>
                    )}
                </Box>}
        </Box>
    )
}