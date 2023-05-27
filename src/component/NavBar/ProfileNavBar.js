import classes from './ProfileNavBar.module.css';
import doctorPic from '../../Images/SVG/Doctor.svg';
import DropDownMenu from './../DropDownMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import PictureContext from '../../context/picture-context';
import UserContext from '../../context/user-context';
function ProfileNavBar(props) {
  const picturectx = useContext(PictureContext);
  const userctx = useContext(UserContext);
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
            {console.log(picturectx)}
            {userctx.role === 'doctor' ? (
              <img
                src={picturectx}
                alt='doctor'
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = doctorPic;
                }}
              />
            ) : (
              <FontAwesomeIcon
                icon={faCircleUser}
                size='2xl'
                style={{ color: '#49a96e' }}
              />
            )}
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
