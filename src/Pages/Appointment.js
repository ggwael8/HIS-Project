import React, { useState, useContext, useEffect } from 'react';
import classes from './Appointment.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileCirclePlus,
  faFile,
  faFilter,
  faUserDoctor,
} from '@fortawesome/free-solid-svg-icons';
import Selection from '../component/Appointment/Selection';
import UserContext from '../context/user-context';
function Appointment() {
  const [isLoading, setIsLoading] = useState(false);
  const userctx = useContext(UserContext);
  const [specialtyList, setSpecialityList] = useState();
  const [doctorsList, setDoctorsList] = useState();
  //todo: fetch organization
  async function fetchDataHandler() {
    setIsLoading(true);
    const response = await Promise.all([
      fetch(
        'https://hospital-information-system-production-b18b.up.railway.app/hospital/specialty/'
      ),
      fetch(
        'https://hospital-information-system-production-b18b.up.railway.app/hospital/doctor/'
      ),
    ]);
    const specialty = await response[0].json();
    setSpecialityList(
      specialty.results.map(info => {
        return {
          id: info.id,
          body: info.specialty,
        };
      })
    );
    const doctors = await response[1].json();
    setDoctorsList(
      doctors.results.map(info => {
        return {
          id: info.user.id,
          body: info.user.first_name + ' ' + info.user.last_name,
        };
      })
    );
    setIsLoading(false);
  }
  useEffect(() => {
    fetchDataHandler();
  }, []);
  const [PatientAppointmentSelectedStep, setPatientAppointmentSelectedStep] =
    useState(1);
  const [patient, setPatient] = useState(0);
  const [appointmentType, setAppointmentType] = useState(0);
  const [PatientAppointmentSpecialist, setPatientAppointmentSpecialist] =
    useState(null);
  const [PatientAppointmentDoctor, setPatientAppointmentDoctor] =
    useState(null);
  const [PatientAppointmentDate, setPatientAppointmentDate] = useState(null);
  const [PatientAppointmentTime, setPatientAppointmentTime] = useState(null);
  const [openWindow, setOpenWindow] = useState(
    userctx.role === 'doctor' ? 3 : 1
  );
  const [
    PatientAppointmentSearchSelected,
    setPatientAppointmentSearchSelected,
  ] = useState();
  const [toggleFilter, setToggleFilter] = useState(false);

  const [doctorScheduleSelectedStep, setDoctorScheduleSelectedStep] =
    useState(1);
  const [doctorScheduleSpecialist, setDoctorScheduleSpecialist] = useState(0);
  const [doctorScheduleDoctor, setDoctorScheduleDoctor] = useState(null);
  const [doctorScheduleDayAndDuration, setDoctorScheduleDayAndDuration] =
    useState([
      //Todo: Dummy
      {
        id: 1,
        Work: 1,
        Day: 'Saturday',
        Duration: 0,
      },
      {
        id: 2,
        Work: 0,
        Day: 'Sunday',
        Duration: 0,
      },
      {
        id: 3,
        Work: 1,
        Day: 'Monday',
        Duration: 0,
      },
      {
        id: 4,
        Work: 0,
        Day: 'Tuesday',
        Duration: 0,
      },
      {
        id: 5,
        Work: 0,
        Day: 'Wednesday',
        Duration: 0,
      },
      {
        id: 6,
        Work: 0,
        Day: 'Thursday',
        Duration: 0,
      },
      {
        id: 7,
        Work: 0,
        Day: 'Friday',
        Duration: 0,
      },
    ]);
  const [doctorSchedulesearchSelected, setDoctorScheduleSearchSelected] =
    useState();

  const resetBookNewAppointment = () => {
    setPatientAppointmentSelectedStep(1);
    setPatient(0);
    setAppointmentType(0);
    setPatientAppointmentDoctor(null);
    setPatientAppointmentDate(null);
    setPatientAppointmentTime(null);
    setOpenWindow(1);
    setPatientAppointmentSearchSelected(null);
  };
  const resetDoctorSchedule = () => {
    setDoctorScheduleSelectedStep(1);
    setDoctorScheduleSpecialist(0);
    setDoctorScheduleDoctor(null);
    setDoctorScheduleDayAndDuration([
      {
        //Todo: Dummy
        id: 1,
        Work: 1,
        Day: 'Saturday',
        StartTime: '11:00',
        EndTime: '12:00',
        Duration: 0,
      },
      {
        id: 2,
        Work: 0,
        Day: 'Sunday',
        Duration: 0,
      },
      {
        id: 3,
        Work: 1,
        Day: 'Monday',
        Duration: 0,
      },
      {
        id: 4,
        Work: 0,
        Day: 'Tuesday',
        Duration: 0,
      },
      {
        id: 5,
        Work: 0,
        Day: 'Wednesday',
        Duration: 0,
      },
      {
        id: 6,
        Work: 0,
        Day: 'Thursday',
        Duration: 0,
      },
      {
        id: 7,
        Work: 0,
        Day: 'Friday',
        Duration: 0,
      },
    ]);
    setOpenWindow(2);
    setDoctorScheduleSearchSelected(null);
  };
  //   {
  //     id: 1,
  //     date: '2021-01-01',
  //     time: '11:00',
  //   },
  //   {
  //     id: 1,
  //     date: '2021-01-02',
  //     time: '12:00',
  //   },
  //   {
  //     id: 1,
  //     date: '2021-01-03',
  //     time: '13:00',
  //   },
  //   {
  //     id: 1,
  //     date: '2021-01-04',
  //     time: '13:00',
  //   },
  // ];

  //Todo: Dummy
  const dropDownContent = [
    [
      {
        id: 0,
        hrID: 22,
        body: 'Dermatologists',
      },
    ],
    [
      {
        id: 0,
        hrID: 22,
        body: 'Ahmed',
      },
    ],
    [
      {
        id: 0,
        hrID: 22,
        body: 'Dermatologists',
      },
    ],
  ];

  const AppointmentDetailsPendingConfirmation = {
    id: 1,
    patient: patient,
    specialist: specialtyList?.map(spec => {
      return spec.id === PatientAppointmentSpecialist && spec.body;
    }),
    doctor: doctorsList?.map(doctor => {
      return doctor.id === PatientAppointmentDoctor && doctor.body;
    }),
    price: '200',
    date: PatientAppointmentDate,
    time: PatientAppointmentTime,
  };
  //Todo: Dummy
  const [AllAppointmentDetails, setAllAppointmentDetails] = useState([
    {
      id: 1,
      specialist: 'specialist',
      doctor: 'doctor',
      price: '200',
      date: 'date',
      time: 'time',
    },
    {
      id: 1,
      specialist: 'specialist',
      doctor: 'doctor',
      price: '200',
      date: 'date',
      time: 'time',
    },
    {
      id: 1,
      specialist: 'specialist',
      doctor: 'doctor',
      price: '200',
      date: 'date',
      time: 'time',
    },
    {
      id: 1,
      specialist: 'specialist',
      doctor: 'doctor',
      price: '200',
      date: 'date',
      time: 'time',
      idas: 1,
      spasdecialist: 'specialist',
      docasdtor: 'doctor',
      prisadce: '200',
      datasde: 'date',
      timasde: 'time',
    },
  ]);
  const timeSlots = [
    {
      id: 1,
      start: '11:00',
      end: '12:00',
    },
    {
      id: 2,
      start: '13:00',
      end: '14:00',
    },
    {
      id: 3,
      start: '15:00',
      end: '16:00',
    },
    {
      id: 4,
      start: '17:00',
      end: '18:00',
    },
    {
      id: 5,
      start: '19:00',
      end: '20:00',
    },
    {
      id: 6,
      start: '11:00',
      end: '12:00',
    },
    {
      id: 7,
      start: '13:00',
      end: '14:00',
    },
    {
      id: 8,
      start: '15:00',
      end: '16:00',
    },
    {
      id: 9,
      start: '17:00',
      end: '18:00',
    },
    {
      id: 10,
      start: '19:00',
      end: '20:00',
    },
    {
      id: 11,
      start: '11:00',
      end: '12:00',
    },
  ];
  //Book New Appointment Selection body content
  const selection = [
    {
      type: 'input',
      id: userctx.role === 'receptionist' ? 1 : 0,
      selectstate: setPatient,
      title: 'Enter Patient ID',
      setAppointmentType: setAppointmentType,
      currentAppointmentType: appointmentType,
      setSelectedStep: setPatientAppointmentSelectedStep,
      currentStep: PatientAppointmentSelectedStep,
    },
    {
      type: 'dropDown',
      specialist: true,
      id: userctx.role === 'receptionist' ? 2 : 1,
      dropDownContent: dropDownContent[2],
      selectstate: setPatientAppointmentSpecialist,
      searchstate: setPatientAppointmentSearchSelected,
      title: 'Pick Specialization',
      setSelectedStep: setPatientAppointmentSelectedStep,
      currentStep: PatientAppointmentSelectedStep,
    },
    {
      type: 'dropDown',
      doctors: true,
      id: userctx.role === 'receptionist' ? 3 : 2,
      dropDownContent: dropDownContent[2],
      selectstate: setPatientAppointmentDoctor,
      searchstate: setPatientAppointmentSearchSelected,
      title: 'Pick Doctor',
      setSelectedStep: setPatientAppointmentSelectedStep,
      currentStep: PatientAppointmentSelectedStep,
    },
    {
      type: 'selection',
      id: userctx.role === 'receptionist' ? 4 : 3,
      DateAndTime: true,
      dropDownContent: dropDownContent[2],
      DateSetState: setPatientAppointmentDate,
      TimeSetState: setPatientAppointmentTime,
      CurrentTime: PatientAppointmentTime,
      TimeSlots: timeSlots,
      title: 'Set Date & Time',
      setSelectedStep: setPatientAppointmentSelectedStep,
      currentStep: PatientAppointmentSelectedStep,
    },
  ];
  //Doctor Schedule Selection body
  const doctorSelection = [
    {
      type: 'dropDown',
      id: 1,
      dropDownContent: dropDownContent[0],
      selectstate: setDoctorScheduleDoctor,
      searchstate: setDoctorScheduleSearchSelected,
      title: 'Pick Doctor',
      setSelectedStep: setDoctorScheduleSelectedStep,
      currentStep: doctorScheduleSelectedStep,
    },
    {
      type: 'selection',
      id: 2,
      dayAndDuration: true,
      dayAndDurationSetState: setDoctorScheduleDayAndDuration,
      currentDayAndDuration: doctorScheduleDayAndDuration,
      searchstate: setPatientAppointmentSearchSelected,
      title: 'Set Day & Duration',
      setSelectedStep: setDoctorScheduleSelectedStep,
      currentStep: doctorScheduleSelectedStep,
    },
  ];
  const AddAppointmentList = async () => {
    const response = await fetch(
      'https://hospital-information-system-production-b18b.up.railway.app/Appointments/Booked-Appointments/',
      {
        method: 'POST',
        body: JSON.stringify(AppointmentDetailsPendingConfirmation),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(AppointmentDetailsPendingConfirmation);
    const data = await response.json();
    console.log(data);
  };
  return (
    <div className={classes.container}>
      {/* appointment NavBar */}
      <div className={classes.appointmentNav}>
        <div
          className={classes.appointmentNavButton}
          onClick={() => {
            setOpenWindow(1);
          }}
          style={{
            display:
              userctx.role === 'receptionist' || userctx.role === 'patient'
                ? 'flex'
                : 'none',
          }}
        >
          <FontAwesomeIcon
            icon={faFileCirclePlus}
            size='xl'
            style={{ color: openWindow === 1 && '#49A96E' }}
          />
        </div>
        <hr
          style={{ display: userctx.role === 'receptionist' ? 'flex' : 'none' }}
        ></hr>
        <div
          className={classes.appointmentNavButton}
          onClick={() => {
            setOpenWindow(2);
          }}
          style={{ display: userctx.role === 'receptionist' ? 'flex' : 'none' }}
        >
          <FontAwesomeIcon
            icon={faUserDoctor}
            size='xl'
            style={{ color: openWindow === 2 && '#49A96E' }}
          />
        </div>
        <hr
          style={{
            display:
              userctx.role === 'receptionist' || userctx.role === 'patient'
                ? 'flex'
                : 'none',
          }}
        ></hr>
        <div
          className={classes.appointmentNavButton}
          onClick={() => {
            setOpenWindow(3);
          }}
        >
          <FontAwesomeIcon
            icon={faFile}
            size='xl'
            style={{ color: openWindow === 3 && '#49A96E' }}
          />
        </div>
      </div>
      {/* Book New Appointment */}
      {!isLoading &&
        (userctx.role === 'receptionist' || userctx.role === 'patient') && (
          <div
            className={classes.apointment}
            style={{ display: openWindow === 1 ? 'flex' : 'none' }}
          >
            <h2 className={classes.title}>Book New Appointment</h2>

            <div className={classes.body}>
              <div className={classes.steps}>
                <h2 className={classes.selected}>1</h2>
                <span></span>
                <h2
                  className={
                    PatientAppointmentSelectedStep >= 2 && classes.selected
                  }
                >
                  2
                </h2>
                <span></span>
                <h2
                  className={
                    PatientAppointmentSelectedStep >= 3 && classes.selected
                  }
                >
                  3
                </h2>
                <span
                  style={{
                    display: userctx.role === 'receptionist' ? 'flex' : 'none',
                  }}
                ></span>
                <h2
                  style={{
                    display: userctx.role === 'receptionist' ? 'flex' : 'none',
                  }}
                  className={
                    PatientAppointmentSelectedStep >= 4 && classes.selected
                  }
                >
                  4
                </h2>
              </div>
              <div className={classes.stepContent}>
                {/* //todo: need optimizing */}
                <Selection
                  {...selection[0]}
                  specialtyList={specialtyList}
                  doctorList={doctorsList}
                />
                <Selection
                  {...selection[1]}
                  specialtyList={specialtyList}
                  doctorList={doctorsList}
                />
                <Selection
                  {...selection[2]}
                  specialtyList={specialtyList}
                  doctorList={doctorsList}
                />
                <Selection
                  {...selection[3]}
                  specialtyList={specialtyList}
                  doctorList={doctorsList}
                />
                <div
                  className={
                    userctx.role === 'receptionist'
                      ? PatientAppointmentSelectedStep === 5
                        ? classes.confirmDisplay
                        : classes.displayNone
                      : PatientAppointmentSelectedStep === 4
                      ? classes.confirmDisplay
                      : classes.displayNone
                  }
                >
                  <h2>Confirm Appointment</h2>
                  <hr></hr>
                  <div className={classes.appointmentDetails}>
                    <h3>Appointment Details</h3>
                    <div className={classes.appointmentDetailsBody}>
                      {Object.keys(
                        AppointmentDetailsPendingConfirmation
                        // userctx.role === 'receptionist'
                        //   ? AppointmentDetailsPendingConfirmation[0]
                        //   : AppointmentDetailsPendingConfirmation[1]
                      ).map(a => {
                        return (
                          a !== 'id' &&
                          a !== 'patient' && (
                            <h4>
                              {a + ' : '}
                              {AppointmentDetailsPendingConfirmation[a]}
                            </h4>
                          )
                        );
                      })}
                      <div className={classes.appointmentDetailsBodyButtons}>
                        <button
                          className={classes.confirm}
                          onClick={() => {
                            AddAppointmentList();
                            setAllAppointmentDetails([
                              ...AllAppointmentDetails,
                              AppointmentDetailsPendingConfirmation,
                              // UserContext.role === 'receptionist'
                              //   ? AppointmentDetailsPendingConfirmation[0]
                              //   : AppointmentDetailsPendingConfirmation[1],
                            ]);
                            resetBookNewAppointment();
                          }}
                        >
                          Confirm
                        </button>
                        <button
                          className={classes.cancel}
                          onClick={() => {
                            resetBookNewAppointment();
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Add Doctor Schedule */}
      <div
        className={classes.apointment}
        style={{ display: openWindow === 2 ? 'flex' : 'none' }}
      >
        <h2 className={classes.title}>Add Doctor Schedule</h2>
        <div className={classes.body}>
          <div className={classes.steps}>
            <h2 className={classes.selected}>1</h2>
            <span></span>
            <h2 className={doctorScheduleSelectedStep >= 2 && classes.selected}>
              2
            </h2>
          </div>
          <div className={classes.stepContent}>
            <Selection {...doctorSelection[0]} />
            <Selection {...doctorSelection[1]} />
            {doctorScheduleSelectedStep >= 3 && resetDoctorSchedule()}
          </div>
        </div>
      </div>
      {/* All Appointments */}
      <div
        className={classes.allAppointment}
        style={{ display: openWindow === 3 ? 'flex' : 'none' }}
      >
        <h2 className={classes.title}>All Appointments</h2>
        <div className={classes.allAppointmentContainer}>
          <div className={classes.allAppointmentHeader}>
            <input type='text' id='search' placeholder='search' />
            <span></span>
            <div
              className={toggleFilter && classes.toggleFilter}
              onClick={() => {
                setToggleFilter(!toggleFilter);
              }}
            >
              <FontAwesomeIcon
                icon={faFilter}
                style={{ color: toggleFilter ? '#49a96e' : '#979797' }}
              />
              <h2>filter</h2>
            </div>
          </div>
          <div className={classes.allAppointmentBody}>
            {AllAppointmentDetails.map(appointmentDetails => {
              return (
                <div className={classes.allAppointmentBodyContent}>
                  {Object.keys(appointmentDetails).map(
                    a =>
                      (a !== 'id' || a !== 'patient') && (
                        <h4>
                          {a} : {appointmentDetails[a]}
                        </h4>
                      )
                  )}{' '}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Appointment;
