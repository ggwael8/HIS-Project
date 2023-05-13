import classes from './Labs.module.css';
import SideNavBar from '../../component/SideNavBar/SideNavBar';
import DetailsBody from '../../component/DetailsBody/DetailsBody';
import { useState, useContext, useEffect } from 'react';
import UserContext from '../../context/user-context';
import { apiUrl } from '../../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileLines,
  faFileCircleQuestion,
} from '@fortawesome/free-solid-svg-icons';
function Labs() {
  const userctx = useContext(UserContext);

  const [openWindow, setOpenWindow] = useState(1);
  const [toggleFilter, setToggleFilter] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setIsLoading] = useState(false);

  async function fetchDataHandler() {
    setIsLoading(true);
    const response = await Promise.all([
      fetch(
        apiUrl +
          `lab-radiology/exam-request/?status=&patient=&doctor=&exams__type=${
            userctx.role === 'lab' ? 'Laboratory' : 'Radiology'
          }`
      ),
    ]);
    const requestList = await response[0].json();

    // setData(
    //   requestList.results.map(info => {
    //     return {
    //       id: info.id,
    //       date: info.appointment.date,
    //       exams: info.exams,
    //       status: info.status,
    //       comment: info.comment,
    //       patientId: info.patient.id,
    //       patientName: info.patient.first_name + ' ' + info.patient.last_name,
    //       doctorId: info.doctor.id,
    //       doctorName: info.doctor.first_name + ' ' + info.doctor.last_name,
    //     };
    //   })
    // );
    setData(
      requestList.results.map(info => {
        return {
          id: <span>{info.id}</span>,
          date: <span>{info.appointment.date}</span>,
          status: <span>{info.status}</span>,
          patientName: (
            <span>
              {info.patient.first_name} {info.patient.last_name}
            </span>
          ),
          doctorName: (
            <span>
              {info.doctor.first_name} {info.doctor.last_name}
            </span>
          ),
          button: ['View Exams'],
        };
      })
    );
    setIsLoading(false);
  }

  useEffect(() => {
    fetchDataHandler();
  }, []);

  const sideNav = [
    {
      id: 1,
      icon: (
        <FontAwesomeIcon
          icon={faFileCircleQuestion}
          size='xl'
          style={{ color: openWindow === 1 && '#49A96E' }}
        />
      ),
    },
    {
      id: 3,
      icon: (
        <FontAwesomeIcon
          icon={faFileLines}
          size='xl'
          style={{ color: openWindow === 2 && '#49A96E' }}
        />
      ),
    },
  ];
  return (
    <div className={classes.container}>
      {console.log(data)}
      <SideNavBar sideNav={sideNav} setOpenWindow={setOpenWindow} />
      <DetailsBody
        toggleFilter={toggleFilter}
        setToggleFilter={setToggleFilter}
        details={data}
        title={
          openWindow === 1 ? 'Requests' : openWindow === 2 && 'All Results'
        }
      />
    </div>
  );
}
export default Labs;
