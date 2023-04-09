import React, {useState} from "react";
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    styled,
    Toolbar,
    Typography
} from "@mui/material";
import {Logout, Notifications} from "@mui/icons-material";
import {useLocalState} from "../util/useLocalStorage";
import jwt_decode from "jwt-decode";
import MenuIcon from "@mui/icons-material/Menu";
import {ajax} from "../util/fetchService";
import {useQuery} from "react-query";
import {LoadingFetch} from "./loading/LoadingFetch";

const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between"
})

const Icons = styled(Box)(({theme}) => ({
    alignItems: "center",
    gap: "20px",
    display: "flex"
}))


export const Navbar = ({mobileOpen, setMobileOpen}) => {
    const [jwt, setJwt] = useLocalState("", "jwt")
    const username = jwt_decode(jwt).username;
    const userId = jwt_decode(jwt).id;
    const [anchorProfile, setAnchorProfile] = useState(null);
    const openProfile = Boolean(anchorProfile);
    const [anchorNotification, setAnchorNotification] = useState(null);
    const openNotification = Boolean(anchorNotification);

    async function logout() {
        return await ajax(`/user/logout/${userId}`, 'put', jwt);
    }

    const handleProfileClick = (event) => {
        setAnchorProfile(event.currentTarget);
    };
    const handleProfileClose = () => {
        setAnchorProfile(null);
    };
    const handleNotificationClick = (event) => {
        setAnchorNotification(event.currentTarget);
    };
    const handleNotificationClose = () => {
        setAnchorNotification(null);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    async function countRecommendedPosts() {
        return await ajax(`/api/posts/recommended/${userId}/count`, 'get', jwt);
    }

    const {data: countedPosts, status: countStatus} = useQuery('countPosts', countRecommendedPosts)

    if (countStatus === "loading") {
        return <LoadingFetch/>
    }

    return (
        <AppBar position={"sticky"}>
            <StyledToolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{mr: 2, display: {sm: 'none'}}}
                >
                    <MenuIcon/>
                </IconButton>
                <Typography variant={"h6"} sx={{display: {xs: "none", sm: "block"}}}>Site name</Typography>
                <Icons>
                    <Badge badgeContent={countedPosts === 0 ? null : " "} color={"error"} onClick={(event) => {
                        if (countedPosts !== 0) {
                            handleNotificationClick(event)
                        }
                    }}>
                        <Notifications/>
                    </Badge>
                    <Avatar sx={{width: 30, height: 30, bgcolor: "red"}}
                            onClick={handleProfileClick}>{username[0]}</Avatar>
                </Icons>
            </StyledToolbar>
            <Menu
                disableScrollLock={true}
                anchorEl={anchorProfile}
                id="account-menu"
                open={openProfile}
                onClose={handleProfileClose}
                onClick={handleProfileClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
                <MenuItem onClick={() => {
                    logout()
                    localStorage.removeItem("jwt")
                    window.location.href = '/login';
                }}>
                    <ListItemIcon>
                        <Logout fontSize="small"/>
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
            <Menu
                disableScrollLock={true}
                anchorEl={anchorNotification}
                id="account-menu"
                open={openNotification}
                onClose={handleNotificationClose}
                onClick={handleNotificationClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
                <MenuItem sx={{display: "flex", flexDirection: "column"}} onClick={() => {
                    window.location.href = '/recommended';
                }}>
                    <Typography>New recommended posts</Typography>
                    <Typography>appeared since your last login!</Typography>
                    <Typography>Click here, to show them.</Typography>
                </MenuItem>
            </Menu>
        </AppBar>
    )
}
//fontSize="small"