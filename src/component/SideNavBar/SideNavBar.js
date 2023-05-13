import classes from './SideNavBar.module.css';

function SideNavBar(props) {
  return (
    <div className={classes.nav}>
      {props.sideNav.map((sideNav, index) => {
        return (
          <>
            <div
              className={classes.navButton}
              key={sideNav.id}
              onClick={() => {
                props.setOpenWindow(index + 1);
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
