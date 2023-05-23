import classes from './Pharmacy.module.css';
import bodyClasses from '../Body.module.css';
import SideNavBar from '../../component/SideNavBar/SideNavBar';
import { useState, useEffect, useContext } from 'react';
import DetailsBody from '../../component/DetailsBody/DetailsBody';
import { apiUrl } from '../../utils/api';
import PopUp from '../../component/PopUp/PopUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVialVirus,
  faXRay,
  faNotesMedical,
  faPills,
} from '@fortawesome/free-solid-svg-icons';
function Pharmacy() {
  const [openWindow, setOpenWindow] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [toggleFilter, setToggleFilter] = useState(false);
  const sideNav = [
    {
      id: 1,
      icon: (
        <FontAwesomeIcon
          icon={faVialVirus}
          size='xl'
          style={{ color: openWindow === 1 && '#49A96E' }}
        />
      ),
    },
    {
      id: 2,
      icon: (
        <FontAwesomeIcon
          icon={faXRay}
          size='xl'
          style={{ color: openWindow === 2 && '#49A96E' }}
        />
      ),
    },
  ];
  return (
    <div className={bodyClasses.container}>
      <SideNavBar sideNav={sideNav} setOpenWindow={setOpenWindow} />
    </div>
  );
}
export default Pharmacy;
