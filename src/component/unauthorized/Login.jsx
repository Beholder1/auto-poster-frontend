import * as React from 'react';
import {useCallback, useState} from 'react';
import TextField from '@mui/material/TextField';
import Lottie from 'lottie-react';
import sign from '../../assets/sign.json';
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Link,
    Paper,
    Stack,
    Switch,
    Typography
} from "@mui/material";
import {DarkMode, LightMode, VpnKey} from "@mui/icons-material";
import {useLocalState} from "../../util/useLocalStorage";
import {Helmet} from 'react-helmet';
import {useThemeStore} from "../../util";

const paperStyle = {
    padding: "30px 20px",
    margin: "20px auto",
    maxWidth: "850px"
}

const avatarStyle = {
    backgroundColor: "#15c630"
}

const textFieldStyle = {
    marginBottom: "10px",
    marginTop: "10px"
}

const buttonStyle = {
    marginBottom: "10px"
}

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(0);
    const [jwt, setJwt] = useLocalState("", "jwt")
    const mode = useThemeStore(state => state.mode);
    const setMode = useThemeStore(state => state.setMode);

    const sendLoginRequest = useCallback(async () => {
        const reqBody = {
            email: email,
            password: password,
            rememberMe: rememberMe
        };

        try {
            const response = await fetch("api/auth/login", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(reqBody)
            });

            if (response.status === 200) {
                const body = await response.json();
                const headers = response.headers;
                setJwt(headers.get("authorization"));
                window.location.href = "/homepage";
            } else {
                alert("Invalid login credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred during login.");
        }
    }, [email, password, rememberMe, setJwt]);

    const handleKeypress = useCallback(e => {
        if (e.key === 'Enter') {
            sendLoginRequest();
        }
    }, [sendLoginRequest]);

    const handleModeToggle = useCallback(() => {
        setMode(mode === "light" ? "dark" : "light");
    }, [mode, setMode]);

    const handleRememberMeChange = useCallback((event) => {
        setRememberMe(event.target.checked ? 1 : 0);
    }, []);

    return (
        <>
            <Helmet>
                <title>Sign in</title>
            </Helmet>
            <Box minHeight="100vh" display="flex" flexDirection="column" justifyContent="center" bgcolor={"background.default"} color={"text.primary"}>
                <Paper elevation={3} sx={paperStyle}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                        <Box sx={{ width: { xs: '100%', md: '400px' } }}>
                            <Lottie animationData={sign} style={{width: '100%'}}/>
                        </Box>
                        <Stack sx={{width: { xs: '100%', md: '400px' }}}>
                            <Grid align={"center"}>
                                <Avatar style={avatarStyle}><VpnKey/></Avatar>
                                <Typography variant="h5" component="h2" sx={{ my: 2 }}>Sign in</Typography>
                            </Grid>
                            <TextField
                                required
                                variant="outlined"
                                label="Email"
                                fullWidth
                                style={textFieldStyle}
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                onKeyDown={handleKeypress}
                            />
                            <TextField
                                required
                                variant="outlined"
                                label="Password"
                                fullWidth
                                style={textFieldStyle}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                type={"password"}
                                onKeyDown={handleKeypress}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name={"checked"}
                                        color={"primary"}
                                        checked={rememberMe === 1}
                                        onChange={handleRememberMeChange}
                                    />
                                } label={"Remember me"}
                            />
                            <Button 
                                variant="contained" 
                                fullWidth 
                                style={buttonStyle}
                                onClick={sendLoginRequest}
                            >
                                Sign in
                            </Button>
                            <Typography>
                                <Link href={"/forgot-password"}>
                                    Forgot password?
                                </Link>
                            </Typography>
                            <Typography> Don't you have an account?
                                <Link href={"/register"}>
                                    Sign up
                                </Link>
                            </Typography>
                        </Stack>
                    </Stack>
                </Paper>
                <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                    <LightMode/>
                    <Switch onChange={handleModeToggle} checked={mode === "dark"}/>
                    <DarkMode/>
                </Stack>
            </Box>
        </>
    );
}
