import { NavLink } from 'react-router-dom';
import classes from './DropDownMenu.module.css';

function DropDownMenu(props) {
  return (
    <div
      className={`${classes.DropDownMenu} ${
        props.content[0].scrollable && classes.scrollable
      }`}
    >
      {props.content.map(p => (
        <>
          {p.type === 'link' ? (
            <NavLink
              to={p.path}
              className={({ isActive }) =>
                isActive && p.activeEffect ? classes.active : undefined
              }
            >
              <h2>{p.icon}</h2>
              <h2>{p.body}</h2>
            </NavLink>
          ) : p.type === 'search' ? (
            <div className={classes.search}>
              <input
                type='text'
                id='search'
                placeholder={p.body}
                onChange={e => {
                  props.searchstate(e.target.value);
                }}
              />
            </div>
          ) : (
            p.type === 'text' && (
              <>
                <hr className={classes.whiteSpace}></hr>
                <card
                  onClick={() => {
                    props.selectstate(p.id);
                    props.setSelectedStep(props.currentStep + 1);
                  }}
                  className={p.hoverEffect && classes.hoverEffect}
                >
                  {p.body}
                </card>
                {p.horizontalLine && <hr></hr>}
              </>
            )
          )}
        </>
      ))}
    </div>
  );
}
export default DropDownMenu;
