import React from "react";
import NavMenuItem from "./NavMenuItem";

function NavMenu() {
  return (
    <ul className="nav-menu">
      <NavMenuItem to="/" label="Home" />
      <NavMenuItem to="/profile" label="Profile" />
      <NavMenuItem to="/settings" label="Settings" />
      <NavMenuItem to="/chat" label="Chat History" />
      <NavMenuItem to="/performance" label="Performance" />
      <NavMenuItem to="/favorites" label="Favorites" />
    </ul>
  );
}

export default NavMenu;