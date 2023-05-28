import * as React from 'react';
import {useState} from 'react';
import TextField from '@mui/material/TextField';
import Lottie from 'lottie-react';
import sign from '../assets/sign.json';
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
    ThemeProvider,
    Typography
} from "@mui/material";
import {DarkMode, LightMode, VpnKey} from "@mui/icons-material";
import {theme} from "../theme";
import {useLocalState} from "../util/useLocalStorage";
import {Helmet} from 'react-helmet';
import {useThemeStore} from "../util";

const paperStyle = {
    height: "70vh",
    padding: "30px 20px",
    //width: 300,
    margin: "20px auto"
}

const avatarStyle = {
    backgroundColor: theme.palette.secondary.main
}

const textFieldStyle = {
    marginBottom: "10px",
    marginTop: "10px"
}

const buttonStyle = {
    marginBottom: "10px"
}

export function Login({theme}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(0);
    const [jwt, setJwt] = useLocalState("", "jwt")
    const mode = useThemeStore(state => state.mode);
    const setMode = useThemeStore(state => state.setMode);

    // const theme = useThemeStore(state => state.theme);

    function sendLoginRequest() {
        const reqBody = {
            email: email,
            password: password,
            rememberMe: rememberMe
        };

        fetch("api/auth/login", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "post",
            body: JSON.stringify(reqBody)
        }).then((response) => {
            if (response.status === 200) {
                return Promise.all([response.json(), response.headers]);
            } else {
                return Promise.reject("Invalid login credentials")
            }
        })
            .then(([body, headers]) => {
                setJwt(headers.get("authorization"));
                window.location.href = "/homepage"
            }).catch((message) => {
            alert(message);
        });
    }

    const handleKeypress = e => {
        if (e.keyCode === 13) {
            sendLoginRequest();
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Helmet>
                <title>Sign in</title>
            </Helmet>
            <Box height="100vh" display="flex" flexDirection="column" bgcolor={"background.default"}
                 color={"text.primary"}>
                <Paper elevation={3} style={paperStyle}>
                    <Stack direction={"row"}>
                    <Lottie animationData={sign} style={{ width: '400px' }} />
                    <Stack sx={{width: '400px'}}>
                        <Grid align={"center"}>
                            <Avatar style={avatarStyle}><VpnKey/></Avatar>
                            <h2>Sign in</h2>
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
                                    onChange={(event) => setRememberMe(event.target.value === "on" ? 1 : 0)}
                                />
                            } label={"Remember me"}
                        />
                        <Button variant="contained" fullWidth type={"submit"} style={buttonStyle}
                                onClick={() => sendLoginRequest()}>Sign in</Button>
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
                <Stack direction="row" alignItems="center" justifyContent="center">
                    <LightMode/>
                    <Switch onChange={e => setMode()} checked={mode === "dark"}/>
                    <DarkMode/>
                </Stack>
            </Box>
        </ThemeProvider>
    );
}
