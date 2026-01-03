import {Avatar, Box, Button, Grid, Link, Paper, Stack, Switch, Typography} from "@mui/material";
import {DarkMode, LightMode, VpnKey} from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import * as React from "react";
import {useCallback, useState} from "react";
import {Helmet} from 'react-helmet';
import {useThemeStore} from "../../util";

const paperStyle = {
    padding: "30px 20px",
    width: 350,
    margin: "20px auto"
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

export function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const mode = useThemeStore(state => state.mode);
    const setMode = useThemeStore(state => state.setMode);

    const validateEmail = useCallback(() => {
        let regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i;
        return regex.test(email.trim());
    }, [email]);

    const sendRegisterRequest = useCallback(async () => {
        const reqBody = {
            email: email,
            password: password
        };

        try {
            const response = await fetch("api/auth/register", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(reqBody)
            });

            if (response.status === 200) {
                alert("Confirmation email sent");
            } else {
                alert("User already exists");
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert("An error occurred during registration.");
        }
    }, [email, password]);

    const handleRegisterClick = useCallback(() => {
        if (password !== repeatPassword) {
            alert("Passwords are not the same");
            return;
        }
        if (password.length < 8) {
            alert("Password must be at least 8 characters long!");
            return;
        }
        if (!validateEmail()) {
            alert("Email address is incorrect!");
            return;
        }
        sendRegisterRequest();
    }, [password, repeatPassword, validateEmail, sendRegisterRequest]);

    const handleKeypress = useCallback(e => {
        if (e.key === 'Enter') {
            handleRegisterClick();
        }
    }, [handleRegisterClick]);

    const handleModeToggle = useCallback(() => {
        setMode(mode === "light" ? "dark" : "light");
    }, [mode, setMode]);

    return (
        <>
            <Helmet>
                <title>Sign up</title>
            </Helmet>
            <Box minHeight="100vh" display="flex" flexDirection="column" justifyContent="center" bgcolor={"background.default"} color={"text.primary"}>
                <Paper elevation={3} sx={paperStyle}>
                    <Grid align={"center"}>
                        <Avatar style={avatarStyle}><VpnKey/></Avatar>
                        <Typography variant="h5" component="h2" sx={{ my: 2 }}>Sign up</Typography>
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
                    <Button 
                        variant="contained" 
                        fullWidth 
                        style={buttonStyle}
                        onClick={handleRegisterClick}
                    >
                        Sign up
                    </Button>
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
                <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                    <LightMode/>
                    <Switch onChange={handleModeToggle} checked={mode === "dark"}/>
                    <DarkMode/>
                </Stack>
            </Box>
        </>
    );
}