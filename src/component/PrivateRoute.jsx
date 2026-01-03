import React, {useEffect, useState} from "react"
import {useLocalState} from "../util/useLocalStorage";
import {Navigate} from "react-router-dom";
import {ajax} from "../util/fetchService"
import {LoadingPage} from "./LoadingPage";

export const PrivateRoute = ({children, theme}) => {
    const [jwt] = useLocalState("", "jwt");
    const [isLoading, setIsLoading] = useState(true);
    const [isValid, setIsValid] = useState(null);

    useEffect(() => {
        if (jwt) {
            ajax(`/api/auth/validate?token=${jwt}`, 'get', jwt).then((isValid) => {
                setIsValid(isValid);
                setIsLoading(false);
            }).catch(() => {
                setIsValid(false);
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, [jwt]);

    if (isLoading) {
        return <LoadingPage theme={theme}/>;
    }

    if (!jwt || isValid !== true) {
        return <Navigate to={"/login"}/>;
    }

    return children;
}

