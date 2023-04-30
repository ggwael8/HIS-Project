import { NavLink } from 'react-router-dom';
import classes from './pagesLinks.module.css';
function PagesLink(props) {
  return (
    <ul className={`${classes.links}  ${props.flex_item}`}>
      {props.links[0].map((p, index) => (
        <li key={index}>
          <NavLink
            to={p.to}
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            {p.icon}
            {p.title}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
export default PagesLink;
