import {useEffect} from "react";
import {Login} from "./component/Login";
import {useLocalState} from "./util/useLocalStorage";
import {Navigate, Route, Routes} from "react-router-dom";
// import {Homepage} from "./component/post/Homepage";
import {Register} from "./component/Register";
import {createTheme} from "@mui/material";
// import {ChatPage} from "./component/chat/ChatPage";
import {useThemeStore} from "./util";
// import {TeamPage} from "./component/team/TeamPage";
// import {MyPostsPage} from "./component/post/MyPostsPage";
// import {FriendRequestsPage} from "./component/friend/FriendRequestsPage";
// import {SavedPostsPage} from "./component/post/SavedPostsPage";
// import {SettingsPage} from "./component/settings/SettingsPage";
// import {FriendsPage} from "./component/friend/FriendsPage";
// import {RecommendedPostsPage} from "./component/post/RecommendedPostsPage";
// import {PageNotFound} from "./component/PageNotFound";
import {ForgotPassword} from "./component/ForgotPassword";
import {PrivateRoute} from "./component/PrivateRoute";
import {Homepage} from "./component/Homepage";
// import {GamesPage} from "./component/game/GamesPage";
// import {UsersPage} from "./component/user/UsersPage";
// import {AdminChatPage} from "./component/chat/AdminChatPage";
// import {TeamRequestsPage} from "./component/team/TeamRequestsPage";
// import {PasswordReset} from "./component/PasswordReset";
// import {LoginRedirect} from "./component/LoginRedirect";
// import {PrivateRoute} from "./component/PrivateRoute";

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
            {/*<Route path={"/reset/:token"} element={<PasswordReset theme={darkTheme}/>}/>*/}
            {/*<Route path={"/register/:token"} element={<LoginRedirect theme={darkTheme}/>}/>*/}
            <Route path={"/homepage"}
                   element={<PrivateRoute theme={darkTheme}><Homepage theme={darkTheme}/></PrivateRoute>}/>
            {/*<Route path={"/my-posts"} element={<PrivateRoute><MyPostsPage theme={darkTheme}/></PrivateRoute>}/>*/}
            {/*<Route path={"/saved-posts"} element={<PrivateRoute><SavedPostsPage theme={darkTheme}/></PrivateRoute>}/>*/}
            {/*<Route path={"/recommended"}*/}
            {/*       element={<PrivateRoute><RecommendedPostsPage theme={darkTheme}/></PrivateRoute>}/>*/}
            {/*<Route path={"/friend-requests"}*/}
            {/*       element={<PrivateRoute><FriendRequestsPage theme={darkTheme}/></PrivateRoute>}/>*/}
            {/*<Route path={"/team-requests"}*/}
            {/*       element={<PrivateRoute><TeamRequestsPage theme={darkTheme}/></PrivateRoute>}/>*/}
            {/*<Route path={"/friends"} element={<PrivateRoute><FriendsPage theme={darkTheme}/></PrivateRoute>}/>*/}
            {/*<Route path={"/teams"} element={<PrivateRoute><TeamPage theme={darkTheme}/></PrivateRoute>}/>*/}
            {/*<Route path={"/settings"} element={<PrivateRoute><SettingsPage theme={darkTheme}/></PrivateRoute>}/>*/}
            {/*<Route path={"/chat"} element={<PrivateRoute><ChatPage theme={darkTheme}/></PrivateRoute>}/>*/}
            {/*<Route path={"/add-games"} element={<PrivateRoute><GamesPage theme={darkTheme}/></PrivateRoute>}/>*/}
            {/*<Route path={"/users"} element={<PrivateRoute><UsersPage theme={darkTheme}/></PrivateRoute>}/>*/}
            {/*<Route path={"/admin-chat"} element={<PrivateRoute><AdminChatPage theme={darkTheme}/></PrivateRoute>}/>*/}
            {/*<Route path={"*"} element={<PageNotFound theme={darkTheme}/>}/>*/}
        </Routes>

    );
}

export default App;
