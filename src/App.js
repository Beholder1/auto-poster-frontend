import {useEffect} from "react";
import {Login} from "./component/unauthorized/Login";
import {useLocalState} from "./util/useLocalStorage";
import {Navigate, Route, Routes} from "react-router-dom";
import {Register} from "./component/unauthorized/Register";
import {createTheme} from "@mui/material";
import {useThemeStore} from "./util";
import {ForgotPassword} from "./component/unauthorized/ForgotPassword";
import {PrivateRoute} from "./component/PrivateRoute";
import {Homepage} from "./component/Homepage";
import {AccountsPage} from "./component/accounts/AccountsPage";
import {LocationsPage} from "./component/locations/LocationsPage";
import {ProductsPage} from "./component/products/ProductsPage";
import {PageNotFound} from "./component/PageNotFound";

function App() {
    const [jwt, setJwt] = useLocalState("", "jwt")
    const mode = useThemeStore(state => state.mode);

    const darkTheme = createTheme({
        palette: {
            mode: mode,
        }
    })

    useEffect(() => {
    }, [jwt]);

    return (
        <Routes>
            <Route path={"/"} element={<Navigate replace to="/login"/>}/>
            <Route path={"/login"} element={<Login theme={darkTheme}/>}/>
            <Route path={"/forgot-password"} element={<ForgotPassword theme={darkTheme}/>}/>
            <Route path={"/register"} element={<Register theme={darkTheme}/>}/>
            <Route path={"/homepage"}
                   element={<PrivateRoute theme={darkTheme}><Homepage theme={darkTheme}/></PrivateRoute>}/>
            <Route path={"/accounts"}
                   element={<PrivateRoute theme={darkTheme}><AccountsPage theme={darkTheme}/></PrivateRoute>}/>
            <Route path={"/locations"}
                   element={<PrivateRoute theme={darkTheme}><LocationsPage theme={darkTheme}/></PrivateRoute>}/>
            <Route path={"/products"}
                   element={<PrivateRoute theme={darkTheme}><ProductsPage theme={darkTheme}/></PrivateRoute>}/>
            <Route path={"*"} element={<PageNotFound theme={darkTheme}/>}/>
        </Routes>

    );
}

export default App;
