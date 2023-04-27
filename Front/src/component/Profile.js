import classes from './Profile.module.css';
import photo from '../Images/SVG/Photo.svg';
import DropDownMenu from './DropDownMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

function Profile(props) {
  const [onDropDown, setOnDropDown] = useState(false);
  return (
    <>
      <div
        className={`${props.flex_item} ${classes.profile}`}
        onClick={() => {
          setOnDropDown(!onDropDown);
        }}
      >
        <div>
          <img src={photo} alt='pic' />
        </div>
        <div className={classes.title}>
          <h3 className={classes.bold}>ahmed</h3>
          <h3 className={classes.grey}>patient</h3>
        </div>
        <div>
          <span className={classes.arrow}>
            <FontAwesomeIcon
              icon={faChevronDown}
              rotation={onDropDown ? 180 : 0}
            />
          </span>
        </div>
        <div
          className={`${classes.dropDown} ${
            onDropDown ? classes.display : classes.displayNone
          }`}
        >
          <DropDownMenu />
        </div>
      </div>
    </>
  );
}
export default Profile;
