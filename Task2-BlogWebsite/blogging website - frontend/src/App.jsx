import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import Editor from "./pages/editor.pages";
import { createContext, useState, useEffect } from "react";
import {lookInSession} from "./common/session";
import Home from "./components/Home";

export const UserContext = createContext({})

const App = () => {
  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    // Function to get user data from session storage (or similar)
    let userInSession = lookInSession("user");

    // Update userAuth state with the session data or set to default
    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ access_token: null });
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/editor" element={<Editor />} />
        <Route path="/" element={<Navbar />}>
          <Route path="signin" element={<UserAuthForm type="sign-in" />} />
          <Route path="signup" element={<UserAuthForm type="sign-up" />} />
          <Route path="home" element={<Home />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
