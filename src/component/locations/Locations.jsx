import React, {useCallback, useState} from "react";
import {Box, Divider, List, Pagination, TextField} from "@mui/material";
import {useLocalState} from "../../util/useLocalStorage";
import {ajax} from "../../util/fetchService";
import {useQuery} from "react-query";
import {LoadingFetch} from "../LoadingFetch";
import {Location} from "./Location";
import {useDebounce} from "../../util/useDebounce";

export const Locations = ({change, setChange}) => {
    const [jwt] = useLocalState("", "jwt")
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [page, setPage] = useState(1);

    const fetchLocations = useCallback(async () => {
        let addParam = "";
        if (debouncedSearch !== "") {
            addParam = "&name=" + encodeURIComponent(debouncedSearch)
        }
        return await ajax(`/api/locations?page=${page - 1}` + addParam, 'get', jwt);
    }, [jwt, page, debouncedSearch]);

    const {data, status} = useQuery(['locations', debouncedSearch, change, page], fetchLocations, {
        keepPreviousData: true,
        staleTime: 5000
    });

    const handlePageChange = useCallback((event, value) => {
        setPage(value);
    }, []);

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
                    <Divider/>
                    <List sx={{height: "100%"}}>
                        {data?.locations?.map((location) => (
                            <Location key={location.id} location={location} change={change} setChange={setChange}/>
                        ))}
                    </List>
                    {data?.pages > 1 && (
                        <Pagination page={page} onChange={handlePageChange} count={data.pages}/>
                    )}
                </Box>}
        </Box>
    )
}