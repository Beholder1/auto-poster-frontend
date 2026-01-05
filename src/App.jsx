import {lazy, Suspense, useMemo} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import {createTheme, ThemeProvider} from "@mui/material";
import {useThemeStore} from "./util";
import {PrivateRoute} from "./component/PrivateRoute";
import {LoadingPage} from "./component/LoadingPage";

const Login = lazy(() => import("./component/unauthorized/Login").then(module => ({ default: module.Login })));
const Register = lazy(() => import("./component/unauthorized/Register").then(module => ({ default: module.Register })));
const ForgotPassword = lazy(() => import("./component/unauthorized/ForgotPassword").then(module => ({ default: module.ForgotPassword })));
const Homepage = lazy(() => import("./component/main-script/Homepage").then(module => ({ default: module.Homepage })));
const RefreshPage = lazy(() => import("./component/refresh-script/RefreshPage").then(module => ({ default: module.RefreshPage })));
const AccountsPage = lazy(() => import("./component/accounts/AccountsPage").then(module => ({ default: module.AccountsPage })));
const LocationsPage = lazy(() => import("./component/locations/LocationsPage").then(module => ({ default: module.LocationsPage })));
const ProductsPage = lazy(() => import("./component/products/ProductsPage").then(module => ({ default: module.ProductsPage })));
const PageNotFound = lazy(() => import("./component/PageNotFound").then(module => ({ default: module.PageNotFound })));

function App() {
    const mode = useThemeStore(state => state.mode);

    const darkTheme = useMemo(() => createTheme({
        palette: {
            mode: mode,
            primary: {
                main: "#ff7420",
            },
            secondary: {
                main: "#1760a5"
            },
        }
    }), [mode]);

    return (
        <ThemeProvider theme={darkTheme}>
            <Suspense fallback={<LoadingPage theme={darkTheme}/>}>
                <Routes>
                    <Route path={"/"} element={<Navigate replace to="/login"/>}/>
                    <Route path={"/login"} element={<Login theme={darkTheme}/>}/>
                    <Route path={"/forgot-password"} element={<ForgotPassword theme={darkTheme}/>}/>
                    <Route path={"/register"} element={<Register theme={darkTheme}/>}/>
                    <Route path={"/homepage"}
                           element={<PrivateRoute theme={darkTheme}><Homepage theme={darkTheme}/></PrivateRoute>}/>
                    <Route path={"/refresh"}
                           element={<PrivateRoute theme={darkTheme}><RefreshPage theme={darkTheme}/></PrivateRoute>}/>
                    <Route path={"/accounts"}
                           element={<PrivateRoute theme={darkTheme}><AccountsPage theme={darkTheme}/></PrivateRoute>}/>
                    <Route path={"/locations"}
                           element={<PrivateRoute theme={darkTheme}><LocationsPage theme={darkTheme}/></PrivateRoute>}/>
                    <Route path={"/products"}
                           element={<PrivateRoute theme={darkTheme}><ProductsPage theme={darkTheme}/></PrivateRoute>}/>
                    <Route path={"*"} element={<PageNotFound theme={darkTheme}/>}/>
                </Routes>
            </Suspense>
        </ThemeProvider>
    );
}

export default App;
