import {Avatar, Box, Button, Grid, Link, Paper, Stack, Switch, ThemeProvider, Typography} from "@mui/material";
import {DarkMode, LightMode, VpnKey} from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import {theme} from "../../theme";
import * as React from "react";
import {useState} from "react";
import {Helmet} from 'react-helmet';
import {useThemeStore} from "../../util";

const paperStyle = {
    height: "70vh",
    padding: "30px 20px",
    width: 300,
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

export function Register({theme}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const mode = useThemeStore(state => state.mode);
    const setMode = useThemeStore(state => state.setMode);

    // const theme = useThemeStore(state => state.theme);

    function sendRegisterRequest() {
        const reqBody = {
            email: email,
            password: password
        };

        fetch("api/auth/register", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "post",
            body: JSON.stringify(reqBody)
        }).then((response) => {
            if (response.status === 200) {
                alert("Confirmation email sent");
                return Promise.all([response.json(), response.headers]);
            } else {
                alert("User already exists")
            }
        })
    }

    const handleKeypress = e => {
        if (e.keyCode === 13) {
            sendRegisterRequest();
        }
    };

    function validateEmail() {
        let regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i;
        return regex.test(email.replace(/\s/g, ''));

    }

    return (
        <ThemeProvider theme={theme}>
            <Helmet>
                <title>Sign up</title>
            </Helmet>
            <Box height="100vh" display="flex" flexDirection="column" bgcolor={"background.default"}
                 color={"text.primary"}>
                <Paper elevation={3} style={paperStyle}>
                    <Grid align={"center"}>
                        <Avatar style={avatarStyle}><VpnKey/></Avatar>
                        <h2>Sign up</h2>
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
                    <TextField
                        required
                        variant="outlined"
                        label="Repeat password"
                        fullWidth
                        style={textFieldStyle}
                        value={repeatPassword}
                        onChange={(event) => setRepeatPassword(event.target.value)}
                        type={"password"}
                        onKeyDown={handleKeypress}
                    />
                    <Button variant="contained" fullWidth type={"submit"} style={buttonStyle}
                            onClick={() => {
                                if (password === repeatPassword) {
                                    if (password.length < 8) {
                                        alert("Password must be at least 8 characters long!")
                                    } else {
                                        let valid = validateEmail();
                                        if (valid) {
                                            sendRegisterRequest()
                                        } else {
                                            alert("Email address is incorrect!")
                                        }
                                    }
                                } else {
                                    alert("Passwords are not the same")
                                }
                            }}>Sign up</Button>
                    <Typography>
                        <Link href={"/forgot-password"}>
                            Forgot password?
                        </Link>
                    </Typography>
                    <Typography> Do you have an account?
                        <Link href={"/login"}>
                            Sign in
                        </Link>
                    </Typography>
                </Paper>
                <Stack direction="row" alignItems="center" justifyContent="center">
                    <LightMode/>
                    <Switch onChange={() => setMode(mode === "light" ? "dark" : "light")} checked={mode === "dark"}/>
                    <DarkMode/>
                </Stack>
            </Box>
        </ThemeProvider>
    );
}