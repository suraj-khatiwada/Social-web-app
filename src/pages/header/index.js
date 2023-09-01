import React from "react";
import { Avatar, IconButton } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

import "./index.scss";

import { useStateValue } from "../../context/StateProvider";

function Header() {
  const [{ user }, dispatch] = useStateValue();

  return (
    <div className="header">
      <div className="header__left">
        <h1>Simple Social Media</h1>
      </div>

      <div className="'header__middle"></div>

      <div className="header__right">
        <div className="header__profile-info">
          <Avatar src={user.photoURL} />
          <h4>{user.displayName}</h4>
        </div>
        <IconButton>
          <ExpandMore />
        </IconButton>
      </div>
    </div>
  );
}

export default Header;
