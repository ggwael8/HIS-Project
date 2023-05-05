import logo from '../../Images/SVG/logo.svg';
import classes from './Logo.module.css';

function Logo(props) {
  return (
    <div className={props.flex_item}>
      <h2>
        <img src={logo} alt='logo' className={classes.logo} />
      </h2>
    </div>
  );
}
export default Logo;
