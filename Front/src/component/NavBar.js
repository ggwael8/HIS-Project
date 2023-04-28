import classes from './NavBar.module.css';

import Logo from './Logo';
import PagesLink from './PagesLink';
import ProfileNavBar from './ProfileNavBar';
function NavBar(props) {
  return (
    <div className={classes.navbar}>
      <nav className={classes.navbarcontainer}>
        {/* logo */}
        <Logo flex_item={classes.flex_item} />
        {/* links */}
        <PagesLink links={props.links} flex_item={classes.flex_item} />
        {/* Profile*/}
        <ProfileNavBar flex_item={classes.flex_item} />
      </nav>
    </div>
  );
}
export default NavBar;
