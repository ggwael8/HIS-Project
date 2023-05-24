import LabList from '../component/DashBoard/LabResults/LabResults';
import RadiologyResults from '../component/DashBoard/Radiology/RadiologyResults';
import AppointmentDashboard from '../component/DashBoard/Dashboard/Dashboard';
import Bills from '../component/DashBoard/Bills/Bills';
import Prescription from '../component/DashBoard/Prescription/Prescriptions';
import Vitals from '../component/DashBoard/Vitals/Vitals';
import MedicalHistory from '../component/DashBoard/MedicalHistory/MedicalHistory';
import Visits from '../component/DashBoard/Visits/Visits';
import Surgery from '../component/DashBoard/Surgery/Surgery';
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
  const [openWindow, setOpenWindow] = useState(1);
  const sideNav = [
    {
      id: 1,
      icon: (
        <FontAwesomeIcon
          icon={faPills}
          size='xl'
          style={{ color: openWindow === 1 && '#49A96E', cursor: 'pointer'}}
        />
      ),
    },
    {
      id: 2,
      icon: (
        <FontAwesomeIcon
          icon={faStethoscope}
          size='xl'
          style={{ color: openWindow === 2 && '#49A96E', cursor: 'pointer' }}
        />
      ),
    },
    {
      id: 3,
      icon: (
        <FontAwesomeIcon
          icon={faVialVirus}
          size='xl'
          style={{ color: openWindow === 3 && '#49A96E', cursor: 'pointer' }}
        />
      ),
    },
  ];
  return (
    <div className={classes.dashBoard}>
      <div className={classes.primary}>
        <div className={`${classes.container}`}>
          <SideNavBar sideNav={sideNav} setOpenWindow={setOpenWindow} />
          {openWindow === 1 && (
            <>
              <Prescription />
              <Vitals />
              <MedicalHistory />
            </>
          )}
          {openWindow === 2 && (
            <>
              <Surgery />
              <Visits />
            </>
          )}
          {openWindow === 3 && (
            <>
              <LabList />
              <RadiologyResults />
            </>
          )}
        </div>
      </div>
      <div className={classes.secondary}>
        <div className={`${classes.container}`}>
            <AppointmentDashboard />
        </div>
        <div className={`${classes.container}`}>
            <Bills />
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
