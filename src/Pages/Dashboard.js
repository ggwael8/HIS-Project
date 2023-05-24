import LabList from '../component/DashBoard/LabResults';
import RadiologyResults from '../component/DashBoard/RadiologyResults';
import SideNavBar from '../component/SideNavBar/SideNavBar';
import classes from './Dashboard.module.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVialVirus,
  faPills,
  faStethoscope,
} from '@fortawesome/free-solid-svg-icons';
function Dashboard() {
  const [openWindow, setOpenWindow] = useState();
  const sideNav = [
    {
      id: 1,
      icon: (
        <FontAwesomeIcon
          icon={faPills}
          size='xl'
          style={{ color: openWindow === 1 && '#49A96E' }}
        />
      ),
    },
    {
      id: 2,
      icon: (
        <FontAwesomeIcon
          icon={faStethoscope}
          size='xl'
          style={{ color: openWindow === 2 && '#49A96E' }}
        />
      ),
    },
    {
      id: 3,
      icon: (
        <FontAwesomeIcon
          icon={faVialVirus}
          size='xl'
          style={{ color: openWindow === 3 && '#49A96E' }}
        />
      ),
    },
  ];
  return (
    <div className={classes.dashBoard}>
      <div className={classes.primary}>
        <div className={`${classes.container}`}>
          <SideNavBar sideNav={sideNav} setOpenWindow={setOpenWindow} />
          {openWindow === 3 && (
            <>
              <LabList />
              <RadiologyResults />
            </>
          )}
        </div>
      </div>
      <div className={classes.secondary}>
        <div className={`${classes.container}`}></div>
        <div className={`${classes.container}`}></div>
      </div>
    </div>
  );
}
export default Dashboard;
