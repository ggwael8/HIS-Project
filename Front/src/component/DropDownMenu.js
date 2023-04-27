import { NavLink } from 'react-router-dom';
import classes from './DropDownMenu.module.css';

function DropDownMenu() {
  return (
    <div className={classes.DropDownMenu}>
      <NavLink to='/'>
        <i class='fa-solid fa-user' style={{ color: '#474747' }}></i>
        <span>Profile</span>
      </NavLink>
      <NavLink to='/'>
        <i
          class='fa-solid fa-right-from-bracket '
          style={{ color: '#DF5C5C' }}
        ></i>
        <span>Logout</span>
      </NavLink>
    </div>
  );
}
export default DropDownMenu;
