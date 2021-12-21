import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { React, useEffect } from "react";

import axios from "axios";

import { Home } from "./pages/home/Home";
import { Landing } from "./pages/landing/Landing";
import { SignIn } from "./pages/signin/SignIn";
import { SignUp } from "./pages/signup/SignUp";
import { Profile } from "./pages/profile/Profile";

import { NavBar } from "./components/navBar/NavBar";
import { Footer } from "./components/footer/Footer";

import "./App.css";
import { IsUserValid } from "./functions/UserValid";

function App() {
  //const accessToken = useSelector((state) => state.user?.accessToken);
  //const error = useSelector((state) => state.user?.error);

  const accessToken = JSON.parse(localStorage.getItem("state")).data.user.accessToken || "";
  axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;

  const value = JSON.parse(localStorage.getItem("state")).data.user.accessToken;
  useEffect(() => {
    const accessToken = JSON.parse(localStorage.getItem("state")).data.user.accessToken || "";
    axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
  }, [value]);

  return (
    <Router>
      <NavBar />
      <div className="app">
        <Routes>
          <Route path="/" exact element={IsUserValid() ? <Home /> : <Landing />} />
          <Route path="/sign-up" exact element={<SignUp />} />
          <Route path="/sign-in" exact element={<SignIn />} />
          <Route path="/profile" exact element={<Profile />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
