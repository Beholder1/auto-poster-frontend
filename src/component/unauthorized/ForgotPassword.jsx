import * as React from 'react';
import {useState} from 'react';
import TextField from '@mui/material/TextField';
import {Avatar, Box, Button, Grid, Link, Paper, Stack, Switch, ThemeProvider, Typography} from "@mui/material";
import {DarkMode, LightMode, MailOutlined} from "@mui/icons-material";
import {theme} from "../../theme";
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

export function ForgotPassword({theme}) {
    const [email, setEmail] = useState("");
    const mode = useThemeStore(state => state.mode);
    const setMode = useThemeStore(state => state.setMode);

    // const theme = useThemeStore(state => state.theme);

    function sendChangePasswordRequest() {
        const reqBody = {
            email: email,
        };

        fetch("api/auth/reset", {
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
                alert("Email has been already sent")
            }
        })
    }

    const handleKeypress = e => {
        if (e.keyCode === 13) {
            sendChangePasswordRequest();
        }
    };

    function validateEmail() {
        let regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i;
        return regex.test(email.replace(/\s/g, ''));
    }

    return (
        <ThemeProvider theme={theme}>
            <Helmet>
                <title>Forgot password</title>
            </Helmet>
            <Box height="100vh" display="flex" flexDirection="column" bgcolor={"background.default"}
                 color={"text.primary"}>
                <Paper elevation={3} style={paperStyle}>
                    <Grid align={"center"}>
                        <Avatar style={avatarStyle}><MailOutlined/></Avatar>
                        <h2>Insert email</h2>
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
                    <Button variant="contained" fullWidth type={"submit"} style={buttonStyle}
                            onClick={() => {
                                let valid = validateEmail();
                                if (valid) {
                                    sendChangePasswordRequest()
                                } else {
                                    alert("Email address is incorrect!")
                                }
                            }}>Send email</Button>
                    <Typography> Do you want to register?
                        <Link href={"/register"}>
                            Sign up
                        </Link>
                    </Typography>
                    <Typography> Do you want to log in?
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
