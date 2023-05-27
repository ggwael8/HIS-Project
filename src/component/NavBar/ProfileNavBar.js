import classes from './ProfileNavBar.module.css';
import photo from '../../Images/SVG/Photo.svg';
import DropDownMenu from './../DropDownMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

function ProfileNavBar(props) {
  const [onDropDown, setOnDropDown] = useState(false);

  let dropDownRef = useRef();
  let profileContainer = useRef();

  let navigate = useNavigate();
  useEffect(() => {
    let SetDropDownFalse = e => {
      if (
        !dropDownRef.current.contains(e.target) &&
        !profileContainer.current.contains(e.target) &&
        onDropDown
      ) {
        setOnDropDown(false);
      }
    };
    document.addEventListener('click', SetDropDownFalse);
    return () => {
      document.removeEventListener('click', SetDropDownFalse);
    };
  });
  const ProfileDropDown = [
    {
      id: 1,
      type: 'link',
      path: '/profile',
      icon: <i class='fa-solid fa-user' style={{ color: '#474747' }}></i>,
      body: 'profile',
      activeEffect: true,
    },
    {
      id: 2,
      type: 'link',
      path: '/',
      func: () => {
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload(true);
      },
      icon: <i class='fa-solid fa-right-from-bracket '></i>,
      body: 'logout',
    },
  ];
  return (
    <>
      <div className={props.flex_item}>
        {/* Profile Container*/}
        <div
          className={classes.profile}
          onMouseDown={() => {
            setOnDropDown(!onDropDown);
          }}
          ref={profileContainer}
        >
          <div>
            <img src={photo} alt='pic' />
          </div>
          <div className={classes.title}>
            <h3 className={classes.bold}>{props.firstname}</h3>
            <h3 className={classes.grey}>{props.role}</h3>
          </div>
          <div>
            <span className={classes.arrow}>
              <FontAwesomeIcon
                icon={faChevronDown}
                rotation={onDropDown ? 180 : 0}
              />
            </span>
          </div>
        </div>
        {/* DropDown Menu */}
        <div
          className={`${classes.dropDown} ${
            onDropDown ? classes.display : classes.displayNone
          }`}
          ref={dropDownRef}
        >
          <DropDownMenu content={ProfileDropDown} type={'link'} />
        </div>
      </div>
    </>
  );
}
export default ProfileNavBar;
