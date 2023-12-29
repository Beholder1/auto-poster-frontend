import React, {useState} from "react";
import {Box, ThemeProvider} from "@mui/material";
import {Navbar} from "../Navbar";
import {Sidebar} from "../Sidebar";
import {Helmet} from "react-helmet";
import {Products} from "./Products";
import {AddProduct} from "./AddProduct";


export const ProductsPage = ({theme}) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <ThemeProvider theme={theme}>
            <Helmet>
                <title>Konta</title>
            </Helmet>
            <Box bgcolor={"background.default"} color={"text.primary"}>
                <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
                <Box sx={{display: "flex", flexDirection: "row"}}>
                    <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
                    <Products/>
                </Box>
                <AddProduct/>
            </Box>
        </ThemeProvider>
    )
}