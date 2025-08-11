import React from "react";
import NavMenuItem from "./NavMenuItem";

function NavMenu() {
  return (
    <ul className="nav-menu">
      <NavMenuItem to="/" label="Home" />
      <NavMenuItem to="/settings" label="Settings" />
      <NavMenuItem to="/history" label="Chat History" />
      <NavMenuItem to="/performance" label="Performance" />
      <NavMenuItem to="/favorites" label="Favorites" />
      <NavMenuItem to="/chatquiz" label="Quiz" />
    </ul>
  );
}

export default NavMenu;