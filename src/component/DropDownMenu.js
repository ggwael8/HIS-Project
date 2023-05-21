import { NavLink } from 'react-router-dom';
import classes from './DropDownMenu.module.css';

function DropDownMenu(props) {
  return (
    <div
      className={`${classes.DropDownMenu} ${
        props.scrollable && classes.scrollable
      }`}
    >
      {props.search && (
        <div className={classes.search}>
          <input
            type='text'
            id='search'
            placeholder='Search'
            onChange={e => {
              props.searchstate(e.target.value);
            }}
          />
        </div>
      )}
      {props.content.map(p => (
        <>
          {props.type === 'link' ? (
            <NavLink
              to={p.path}
              className={({ isActive }) =>
                `${classes.link} ${
                  isActive && p.activeEffect ? classes.active : ''
                }`
              }
            >
              <h2>{p.icon}</h2>
              <h2>{p.body}</h2>
            </NavLink>
          ) : props.type === 'text' ? (
            <>
              <div
                onClick={() => {
                  props.selectstate(p.id);
                  props.setSelectedStep(props.currentStep + 1);
                }}
                className={`${classes.card} ${classes.hoverEffect}`}
              >
                {p.body}
              </div>
              {/* {<hr></hr>} */}
            </>
          ) : (
            props.type === 'card' && (
              <>
                <div
                  onClick={() => {
                    props.selectstate(p.id);
                    p.day && props.selectedDay(p.body);
                    props.setSelectedStep(props.currentStep + 1);
                  }}
                  className={`${classes.cardContainer} `}
                >
                  <div className={`${classes.card} ${classes.hoverEffect}`}>
                    {Object.keys(p.card).map(key => {
                      return <>{p.card[key]}</>;
                    })}
                  </div>
                </div>
                {/* {<hr></hr>} */}
              </>
            )
          )}
        </>
      ))}
    </div>
  );
}
export default DropDownMenu;
