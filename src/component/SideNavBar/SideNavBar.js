import classes from './SideNavBar.module.css';

function SideNavBar(props) {
  return (
    <div className={classes.nav}>
      {props.sideNav.map((sideNav, index) => {
        if (sideNav === false) return null;
        return (
          <>
            <div
              className={classes.navButton}
              key={sideNav.id}
              onClick={() => {
                props.setOpenWindow(sideNav.id);
              }}
            >
              {sideNav.icon}
            </div>
            {index !== props.sideNav.length - 1 && <hr></hr>}
          </>
        );
      })}
    </div>
  );
}
export default SideNavBar;
