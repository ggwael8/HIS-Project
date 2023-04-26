import { NavLink } from "react-router-dom";

import classes from "./NavBar.module.css";

import logo from "../Images/SVG/Logo.svg";
import photo from "../Images/SVG/Photo.svg";
import appointmenticon from "../Images/SVG/appointment.svg";

function NavBar() {
  return (
    <div>
      <nav className={classes.navbar}>
        <h2 className={classes.flex_item}>
          <img src={logo} alt="logo" className={classes.logo} />
        </h2>
        <ul className={`${classes.links}  ${classes.flex_item}`}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              <i class="fa-solid fa-house"></i>
              <span>home</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/appointment"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              <i class="fa-solid fa-phone"></i>
              <span>appointment</span>
            </NavLink>
          </li>
        </ul>
        <ul className={`${classes.profile}  ${classes.flex_item}`}>
          <li>
            <img src={photo} alt="pic" />
          </li>
          <li>
            <span className={classes.bold}>Ahmed</span>
            <span className={classes.greytext}>patient</span>
          </li>
          <li>
            <i className="fa-solid fa-chevron-down"></i>
          </li>
        </ul>
      </nav>
    </div>
  );
}
export default NavBar;
