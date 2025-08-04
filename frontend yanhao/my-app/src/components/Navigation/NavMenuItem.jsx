import React from "react";
import { Link } from "react-router-dom";

function NavMenuItem({ to, label }) {
  return (
    <li className="nav-menu-item">
      <Link to={to}>{label}</Link>
    </li>
  );
}

export default NavMenuItem;