import React from "react";
import {Accordion, AccordionDetails, AccordionSummary, Box, Pagination, Stack, Typography} from "@mui/material";
import {Post} from "./Post";
import {useLocalState} from "../../util/useLocalStorage";
import {ajax} from "../../util/fetchService";
import {useQuery} from "react-query";
import {LoadingFetch} from "../loading/LoadingFetch";
import {FilterBar} from "./FilterBar";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import jwt_decode from "jwt-decode";
import {MyPost} from "./MyPost";

export const Feed = ({type}) => {
    const [jwt, setJwt] = useLocalState("", "jwt")
    const [page, setPage] = React.useState(1);
    const [refresh, setRefresh] = React.useState(true);
    const userId = jwt_decode(jwt).id;

    const [filter2, setFilter2] = React.useState({
        type: "",
        game: "",
        rank: "",
        language: "",
        age: "",
    });

    const handleChange = (event, value) => {
        setPage(value);
    };

    async function fetchPosts() {
        let url = `/api/posts?page=${page - 1}`;
        if (type !== "myPosts" && type !== "savedPosts") {
            url = url + "&userSaved=" + userId;
        }
        if (type === "myPosts") {
            url = url + "&user=" + userId;
        }
        if (filter2.type !== "") {
            url = url + "&type=" + filter2.type;
        }
        if (filter2.game !== "") {
            url = url + "&game=" + filter2.game;
        }
        if (filter2.rank !== "") {
            url = url + "&rank=" + filter2.rank;
        }
        if (filter2.language !== "") {
            url = url + "&language=" + filter2.language;
        }
        if (filter2.age !== "") {
            url = url + "&age=" + filter2.age;
        }
        if (type === "savedPosts") {
            url = '/api/posts/saved/' + userId
        }
        return await ajax(url, 'get', jwt);
    }

    const {data, status} = useQuery(['posts', filter2, page, refresh], fetchPosts)


    async function countPosts() {
        let url = `/api/posts/count?page=${page - 1}`;
        if (type !== "myPosts" && type !== "savedPosts") {
            url = url + "&userSaved=" + userId;
        }
        if (type === "myPosts") {
            url = url + "&user=" + userId;
        }
        if (filter2.type !== "") {
            url = url + "&type=" + filter2.type;
        }
        if (filter2.game !== "") {
            url = url + "&game=" + filter2.game;
        }
        if (filter2.rank !== "") {
            url = url + "&rank=" + filter2.rank;
        }
        if (filter2.language !== "") {
            url = url + "&language=" + filter2.language;
        }
        if (filter2.age !== "") {
            url = url + "&age=" + filter2.age;
        }
        if (type === "savedPosts") {
            url = '/api/posts/saved/' + userId + '/count'
        }
        return await ajax(url, 'get', jwt);
    }

    const {data: countedPosts, status: countStatus} = useQuery(['countPosts', filter2, page, refresh], countPosts)


    if (status === "loading" || countStatus === "loading") {
        return <LoadingFetch/>
    }
    return (
        <Box p={2} sx={{width: "100%", overflow: "auto", height: "calc(100vh - 64px)"}}>
            <Stack>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}>
                        <Typography>Filters</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FilterBar setFilter2={setFilter2} refresh={refresh} setRefresh={setRefresh}/>
                    </AccordionDetails>
                </Accordion>
                {data.map((post) => (
                    <React.Fragment key={post.id}>
                        {type === "myPosts" ?
                            <MyPost post={post}/> :
                            <Post post={post}/>
                        }
                    </React.Fragment>
                ))}
                <Pagination page={page} onChange={handleChange} count={Math.ceil(countedPosts / 20)}/>
            </Stack>
        </Box>
    )
}