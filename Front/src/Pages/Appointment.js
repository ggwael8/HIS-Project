import React, { useState } from 'react';
import classes from './Appointment.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSquarePlus,
  faFileCirclePlus,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import Selection from '../component/Appointment/Selection';
function Appointment() {
  const [specialist, setSpecialist] = useState(0);
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [openWindow, setOpenWindow] = useState(1);
  const [searchSelected, setSearchSelected] = useState();
  const dates = [
    {
      id: 1,
      date: '2021-01-01',
      time: '11:00',
    },
    {
      id: 1,
      date: '2021-01-02',
      time: '12:00',
    },
    {
      id: 1,
      date: '2021-01-03',
      time: '13:00',
    },
    {
      id: 1,
      date: '2021-01-04',
      time: '13:00',
    },
  ];
  const dropDownContent = [
    [
      {
        id: 0,
        scrollable: true,
      },
      {
        id: 1,
        type: 'search',
        body: 'Search',
      },
      {
        id: 2,
        hrID: 22,
        type: 'text',
        body: 'Dermatologists',
        horizontalLine: true,
        hoverEffect: true,
      },
      {
        id: 3,
        hrID: 22,
        type: 'text',
        body: 'Dermatologists',
        horizontalLine: true,
        hoverEffect: true,
      },
      {
        id: 4,
        hrID: 22,
        type: 'text',
        body: 'Dermatologists',
        horizontalLine: true,
        hoverEffect: true,
      },
      {
        id: 5,
        hrID: 22,
        type: 'text',
        body: 'Dermatologists',
        horizontalLine: true,
        hoverEffect: true,
      },
      {
        id: 6,
        hrID: 22,
        type: 'text',
        body: 'Dermatologists',
        horizontalLine: true,
        hoverEffect: true,
      },
      {
        id: 7,
        hrID: 22,
        type: 'text',
        body: 'Dermatologists',
        hoverEffect: true,
      },
    ],
    [
      {
        id: 0,
        scrollable: true,
      },
      {
        id: 1,
        type: 'search',
        body: 'Search',
      },
      {
        id: 2,
        hrID: 22,
        type: 'text',
        body: 'Ahmed',
        horizontalLine: true,
        hoverEffect: true,
      },
      {
        id: 3,
        hrID: 22,
        type: 'text',
        body: 'Mohamed',
        horizontalLine: true,
        hoverEffect: true,
      },
    ],
    [
      {
        id: 0,
        scrollable: true,
      },
      {
        id: 1,
        type: 'search',
        body: 'Search',
      },
      {
        id: 2,
        hrID: 22,
        type: 'text',
        body: 'Dermatologists',
        horizontalLine: true,
        hoverEffect: true,
      },
    ],
  ];
  const AppointmentDetails = {
    id: 1,
    specialist: specialist,
    doctor: doctor,
    price: '200',
    date: date,
    time: time,
  };
  return (
    <div className={classes.container}>
      {/* <div className={classes.first}>
      <div>
        <button
          onClick={() => {
            setOpenWindow(1);
          }}
        >
          <FontAwesomeIcon
            icon={faFileCirclePlus}
            size='2xl'
            style={{ color: openWindow === 1 ? '#68c11f' : '#000000' }}
          />
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            setOpenWindow(2);
          }}
        >
          <FontAwesomeIcon
            icon={faFilePdf}
            size='2xl'
            style={{ color: openWindow === 2 ? '#68c11f' : '#000000' }}
          />
        </button>
      </div>
    </div> */}
      <div
        style={{ display: openWindow === 1 ? 'flex' : 'none' }}
        className={classes.apointment}
      >
        <h2 className={classes.title}>Book New Appointment</h2>
        <div className={classes.body}>
          <div className={classes.steps}>
            <h2 className={classes.selected}>1</h2>
            <span></span>
            <h2 className={doctor !== null && classes.selected}>2</h2>
            <span></span>
            <h2 className={date !== null && classes.selected}>3</h2>
            <span></span>
            <h2 className={time !== null && classes.selected}>4</h2>
          </div>
          <div className={classes.stepContent}>
            <Selection
              dropDownContent={dropDownContent[0]}
              selectstate={setSpecialist}
              searchstate={setSearchSelected}
              title={'Pick Specialization'}
              selected={specialist}
              next={setDoctor}
            />
            <Selection
              className={doctor !== null && classes.dropDownMenuDisplay}
              dropDownContent={dropDownContent[1]}
              selectstate={setDoctor}
              searchstate={setSearchSelected}
              title={'Pick Doctor'}
              selected={doctor}
              next={setDate}
            />
            <Selection
              className={date !== null && classes.dropDownMenuDisplay}
              dropDownContent={dropDownContent[2]}
              selectstate={setDate}
              searchstate={setSearchSelected}
              title={'Pick Date'}
              selected={date}
              next={setTime}
            />
            <Selection
              className={time !== null && classes.dropDownMenuDisplay}
              dropDownContent={dropDownContent[2]}
              selectstate={setTime}
              searchstate={setSearchSelected}
              title={'Pick Time'}
              selected={time}
            />
            <div
              className={
                time !== 0 && time !== null
                  ? classes.confirmDisplay
                  : classes.displayNone
              }
            >
              <h2>Confirm Appointment</h2>
              <hr></hr>
              <div className={classes.appointmentDetails}>
                <h3>Appointment Details</h3>
                <div className={classes.appointmentDetailsBody}>
                  {Object.keys(AppointmentDetails).map(a => (
                    <h4>{AppointmentDetails[a]}</h4>
                  ))}
                  <div className={classes.appointmentDetailsBodyButtons}>
                    <button className={classes.confirm}>Confirm</button>
                    <button className={classes.cancel}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div
      style={{ display: openWindow === 2 ? 'flex' : 'none' }}
      className={classes.apo}
    >
      <h1>all appoiment</h1>
    </div> */}
    </div>
  );
}
export default Appointment;
