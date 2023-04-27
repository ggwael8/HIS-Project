import classes from './NavBar.module.css';

import Logo from './Logo';
import PagesLink from './PagesLink';
import Profile from './Profile';
function NavBar(props) {
  return (
    <div className={classes.navbar}>
      <nav className={classes.navbarcontainer}>
        {/* logo */}
        <Logo flex_item={classes.flex_item} />
        {/* links */}
        <PagesLink links={props.links} flex_item={classes.flex_item} />
        {/* Profile*/}
        <Profile flex_item={classes.flex_item} />
      </nav>
    </div>
  );
}
export default NavBar;
