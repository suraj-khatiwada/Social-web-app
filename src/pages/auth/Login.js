import React from "react";
import { Button } from "@mui/material";

import "./index.scss";

import { auth, provider } from "../../firebase";
import { actionTypes } from "../../context/reducer";
import { useStateValue } from "../../context/StateProvider";

function Login() {
  const [state, dispatch] = useStateValue();
  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((res) => {
        console.log("response", res);
        dispatch({ type: actionTypes.SET_USER, user: res.user });
        localStorage.setItem("username", res.user.displayName);
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="login">
      <div className="login__logo">
        <h1>Simple Social Media App</h1>
        test here
      </div>
      <Button type="submit" onClick={signIn}>
        Sign In
      </Button>
    </div>
  );
}

export default Login;
