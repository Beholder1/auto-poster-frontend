import React from "react";
import {useTranslation} from 'react-i18next';
import {Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch} from "@mui/material";
import {DarkMode, Groups, Home, LightMode, LocationOn, Person, Sell, Settings} from "@mui/icons-material";
import {useThemeStore} from "../util";
import Drawer from "@mui/material/Drawer";
import {jwtDecode} from "jwt-decode";
import {useLocalState} from "../util/useLocalStorage";

const drawerWidth = 240;

export const Sidebar = (props) => {
    const {mobileOpen} = props;
    const {setMobileOpen} = props;
    const {t} = useTranslation();
    const mode = useThemeStore(state => state.mode);
    const setMode = useThemeStore(state => state.setMode);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [jwt, setJwt] = useLocalState("", "jwt")
    const userRole = jwtDecode(jwt).roles[0]


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <List>
            <ListItem disablePadding>
                <ListItemButton component="a" href={"/homepage"} selected={selectedIndex === 0}>
                    <ListItemIcon>
                        <Home/>
                    </ListItemIcon>
                    <ListItemText primary="Strona główna"/>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component="a" href={"/accounts"}>
                    <ListItemIcon>
                        <Person/>
                    </ListItemIcon>
                    <ListItemText primary="Konta"/>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component="a" href="/products">
                    <ListItemIcon>
                        <Sell/>
                    </ListItemIcon>
                    <ListItemText primary="Produkty"/>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component="a" href="/locations">
                    <ListItemIcon>
                        <LocationOn/>
                    </ListItemIcon>
                    <ListItemText primary="Lokalizacje"/>
                </ListItemButton>
            </ListItem>
            <Divider/>
            {userRole === "admin" ?
                <>
                    <ListItem disablePadding>
                        <ListItemButton component="a" href="/users">
                            <ListItemIcon>
                                <Groups/>
                            </ListItemIcon>
                            <ListItemText primary="Users"/>
                        </ListItemButton>
                    </ListItem>
                    <Divider/>
                </> : <></>
            }
            <ListItem disablePadding>
                <ListItemButton component="a" href="/settings">
                    <ListItemIcon>
                        <Settings/>
                    </ListItemIcon>
                    <ListItemText primary="Ustawienia"/>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton>
                    <LightMode/>
                    <Switch onChange={() => setMode(mode === "light" ? "dark" : "light")} checked={mode === "dark"}/>
                    <DarkMode/>
                </ListItemButton>
            </ListItem>
        </List>

    );

    return (
        <Box
            sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
        >
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: {xs: 'block', sm: 'none'},
                    '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: {xs: 'none', sm: 'block'},
                    '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    )
}