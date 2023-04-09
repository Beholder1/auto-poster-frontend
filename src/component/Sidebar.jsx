import React from "react";
import {Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch} from "@mui/material";
import {
    Announcement,
    Bookmark,
    ChatBubble,
    DarkMode,
    Dashboard,
    GroupAdd,
    Groups,
    Home,
    LightMode,
    People,
    Person,
    PersonAdd,
    Settings,
    SportsEsports,
    Star
} from "@mui/icons-material";
import {useThemeStore} from "../util";
import Drawer from "@mui/material/Drawer";
import jwt_decode from "jwt-decode";
import {useLocalState} from "../util/useLocalStorage";

const drawerWidth = 240;

export const Sidebar = (props) => {
    const {mobileOpen} = props;
    const {setMobileOpen} = props;

    const mode = useThemeStore(state => state.mode);
    const setMode = useThemeStore(state => state.setMode);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [jwt, setJwt] = useLocalState("", "jwt")
    const userRole = jwt_decode(jwt).roles[0]


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const checkActualSite = (href) => {
        let url = new URL(window.location.href)
        return window.location.href === url + href
    }

    const drawer = (
        <List>
            <ListItem disablePadding>
                <ListItemButton component={"a"} href={"/homepage"} selected={selectedIndex === 0}>
                    <ListItemIcon>
                        <Home/>
                    </ListItemIcon>
                    <ListItemText primary={"Homepage"}/>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={"a"} href={"/my-posts"}>
                    <ListItemIcon>
                        <Dashboard/>
                    </ListItemIcon>
                    <ListItemText primary={"My posts"}/>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={"a"} href={"/saved-posts"}>
                    <ListItemIcon>
                        <Bookmark/>
                    </ListItemIcon>
                    <ListItemText primary={"Saved posts"}/>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={"a"} href={"/recommended"}>
                    <ListItemIcon>
                        <Star/>
                    </ListItemIcon>
                    <ListItemText primary={"Recommended"}/>
                </ListItemButton>
            </ListItem>
            <Divider/>
            <ListItem disablePadding>
                <ListItemButton component={"a"} href={"/friends"}>
                    <ListItemIcon>
                        <Person/>
                    </ListItemIcon>
                    <ListItemText primary={"Friends"}/>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={"a"} href={"/friend-requests"}>
                    <ListItemIcon>
                        <PersonAdd/>
                    </ListItemIcon>
                    <ListItemText primary={"Friend requests"}/>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={"a"} href={"/teams"}>
                    <ListItemIcon>
                        <People/>
                    </ListItemIcon>
                    <ListItemText primary={"Teams"}/>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={"a"} href={"/team-requests"}>
                    <ListItemIcon>
                        <GroupAdd/>
                    </ListItemIcon>
                    <ListItemText primary={"Team requests"}/>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={"a"} href={"/chat"}>
                    <ListItemIcon>
                        <ChatBubble/>
                    </ListItemIcon>
                    <ListItemText primary={"Chat"}/>
                </ListItemButton>
            </ListItem>
            <Divider/>
            {userRole === "admin" ?
                <>
                    <ListItem disablePadding>
                        <ListItemButton component={"a"} href={"/add-games"}>
                            <ListItemIcon>
                                <SportsEsports/>
                            </ListItemIcon>
                            <ListItemText primary={"Add game"}/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={"a"} href={"/users"}>
                            <ListItemIcon>
                                <Groups/>
                            </ListItemIcon>
                            <ListItemText primary={"Users"}/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={"a"} href={"/admin-chat"}>
                            <ListItemIcon>
                                <Announcement/>
                            </ListItemIcon>
                            <ListItemText primary={"Admin chat"}/>
                        </ListItemButton>
                    </ListItem>
                    <Divider/>
                </> : <></>
            }
            <ListItem disablePadding>
                <ListItemButton component={"a"} href={"/settings"}>
                    <ListItemIcon>
                        <Settings/>
                    </ListItemIcon>
                    <ListItemText primary={"Settings"}/>
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton>
                    <LightMode/>
                    <Switch onChange={e => setMode(mode === "light" ? "dark" : "light")} checked={mode === "dark"}/>
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
                    keepMounted: true, // Better open performance on mobile.
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