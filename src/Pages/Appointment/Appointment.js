/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './Appointment.module.css';
import classesBody from '../Body.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileCirclePlus,
  faFile,
  faPhoneSlash,
  faUserDoctor,
} from '@fortawesome/free-solid-svg-icons';
import Selection from '../../component/Appointment/Selection';
import UserContext from '../../context/user-context';
import SideNavBar from '../../component/SideNavBar/SideNavBar';
import StepsCircle from '../../component/StepsCircle/StepsCircle';
import DetailsBody from '../../component/DetailsBody/DetailsBody';
import PopUp from '../../component/PopUp/PopUp';
import { apiUrl } from '../../utils/api';

function Appointment() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  //context api to get user role
  const userctx = useContext(UserContext);
  //lists got from api
  const [specialtyList, setSpecialityList] = useState();
  const [doctorsList, setDoctorsList] = useState();
  const [daysList, setDaysList] = useState();
  /*Appointment States */
  const [PatientAppointmentSelectedStep, setPatientAppointmentSelectedStep] =
    useState(1);
  const [patient, setPatient] = useState();
  const [appointmentType, setAppointmentType] = useState(1);
  const [PatientAppointmentSpecialist, setPatientAppointmentSpecialist] =
    useState(null);
  const [PatientAppointmentDoctor, setPatientAppointmentDoctor] =
    useState(null);
  const [PatientAppointmentDayOfWeek, setPatientAppointmentDayOfWeek] =
    useState(null);
  const [dayOfWeekName, setDayOfWeekName] = useState(null);
  const [PatientAppointmentDate, setPatientAppointmentDate] = useState(null);
  const [PatientAppointmentTime, setPatientAppointmentTime] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [allAppointmentList, setAllAppointmentList] = useState(null);
  const [openWindow, setOpenWindow] = useState(
    userctx.role === 'doctor' ? 3 : 1
  );
  //bills pop up state
  const [billsPopUp, setBillsPopUp] = useState(false);
  const [bills, setBills] = useState(null);

  //state for dropdowncontent on each step
  const [dropDownContent, setDropDownContent] = useState({
    specialty: specialtyList,
    doctor: doctorsList,
    days: daysList,
  });
  // //medical record states
  // const [popUp, setPopUp] = useState(false);
  // const [medicalRecord, setMedicalRecord] = useState(null);
  //todo: error handling & optimization
  //fetching data from api
  async function fetchDataHandler() {
    setIsLoading(true);
    const response = await Promise.all([
      fetch(apiUrl + 'hospital/specialty/'),
      fetch(apiUrl + 'hospital/doctor/'),
      PatientAppointmentDoctor !== null &&
        fetch(apiUrl + 'appointments/doctor-schedule/'),
      PatientAppointmentDayOfWeek !== null &&
        PatientAppointmentDate !== null &&
        fetch(
          apiUrl +
            `appointments/doctor-slots/?date=${PatientAppointmentDate}&doctor=${PatientAppointmentDoctor}&schedule=${PatientAppointmentDayOfWeek}`
        ),
      userctx.role === 'patient' && fetch(apiUrl + 'hospital/patient/me/'),
      openWindow === 3 && fetch(apiUrl + 'appointments/Booked-Appointments/'),
      openWindow === 4 && fetch(apiUrl + 'appointments/Doctor-Appointments/'),
      billsPopUp &&
        fetch(
          apiUrl +
            `bills/bill/?patient=&patient__user__username=&appointment=${billsPopUp}`
        ),
    ]);
    const specialty = await response[0].json();
    setSpecialityList(
      specialty.results.map(info => {
        return {
          id: info.id,
          body: info.specialty,
          card: {
            specialty: (
              <h4>
                <span>{info.specialty}</span>
              </h4>
            ),
          },
        };
      })
    );
    const doctors = await response[1].json();
    setDoctorsList(
      doctors.results.map(info => {
        return {
          id: info.id,
          card: {
            name: (
              <h4>
                {info.image !== null && <img src={info.image} alt='doctor' />}
                name :
                <span>{info.user.first_name + ' ' + info.user.last_name}</span>
              </h4>
            ),
          },
        };
      })
    );
    if (PatientAppointmentDoctor !== null) {
      const Days = await response[2].json();
      setDaysList(
        Days.results
          .filter(
            info =>
              info.doctor === PatientAppointmentDoctor &&
              info.schedule_status === 'active'
          )
          .map(info => {
            return {
              id: info.id,
              day: true,
              body: info.day_of_week,
              card: {
                doctor: (
                  <h4>
                    Doctor : <span>{info.doctor}</span>
                  </h4>
                ),
                day: (
                  <h4>
                    Day : <span>{info.day_of_week}</span>
                  </h4>
                ),
                start_time: (
                  <h4>
                    Start Time: <span>{info.start_time}</span>
                  </h4>
                ),
                end_time: (
                  <h4>
                    End Time: <span>{info.end_time}</span>
                  </h4>
                ),
                price: (
                  <h4>
                    Price: <span>{info.price} LE</span>
                  </h4>
                ),
              },
            };
          })
      );
      if (
        PatientAppointmentDayOfWeek !== null &&
        PatientAppointmentDate !== null
      ) {
        const Slots = await response[3].json();
        setTimeSlots(
          Slots.results.map(info => {
            return {
              id: info.id,
              body:
                info.start_time.toString().slice(0, 5) +
                ' : ' +
                info.end_time.toString().slice(0, 5),
            };
          })
        );
      }
      if (userctx.role === 'patient') {
        const patient = await response[4].json();
        setPatient({
          id: patient.id,
          Name: patient.user.first_name + ' ' + patient.user.last_name,
        });
      }
    }
    if (openWindow === 3) {
      const allAppointments = await response[5].json();
      setAllAppointmentList(
        allAppointments.results.map(info => {
          return {
            ...(userctx.role !== 'doctor' && {
              doctor: (
                <span>
                  {info.doctor.first_name + ' ' + info.doctor.last_name}
                </span>
              ),
            }),
            ...(userctx.role !== 'patient' && {
              patient: (
                <span>
                  {info.patient.first_name + ' ' + info.patient.last_name}
                </span>
              ),
            }),
            date: <span>{info.date}</span>,
            StartTime: (
              <span>{info.slot.start_time.toString().slice(0, 5)}</span>
            ),
            EndTime: <span>{info.slot.end_time}</span>,
            ...(userctx.role === 'receptionist' && {
              status: <span>{info.status}</span>,
              button: [
                info.status === 'waiting' && {
                  title: 'View Bills',
                  setStates: () => {
                    setBillsPopUp(info.id);
                  },
                },
                info.status === 'waiting' && {
                  title: 'View Requests',
                  yellow: true,
                  setStates: () => {
                    navigate('/requests', {
                      state: {
                        patientId: info.patient.id,
                        appointmentId: info.id,
                      },
                    });
                  },
                },
                info.status !== 'completed' && {
                  title:
                    info.status === 'pending'
                      ? 'Set To Waiting'
                      : info.status === 'waiting' && 'Set To Completed',
                  setStates: () => {
                    async function changeStatus() {
                      await fetch(
                        apiUrl + `appointments/Booked-Appointments/${info.id}/`,
                        {
                          method: 'PATCH',
                          body: JSON.stringify({
                            status:
                              info.status === 'pending'
                                ? 'waiting'
                                : info.status === 'waiting' && 'completed',
                          }),
                          headers: {
                            'Content-Type': 'application/json',
                          },
                        }
                      );
                      fetchDataHandler();
                    }
                    changeStatus();
                  },
                },
              ],
            }),

            ...(userctx.role === 'doctor' && {
              button: [
                {
                  title: 'View Medical Record',
                  setStates: () => {
                    console.log('view medical record');
                    navigate('/medicalrecord', {
                      state: {
                        patientId: info.patient.id,
                        appointmentId: info.id,
                      },
                    });
                  },
                },
              ],
            }),
          };
        })
      );
    }
    if (openWindow === 4) {
      const data = await response[6].json();
      setAllAppointmentList(
        data.results.map(info => {
          return {
            Doctor: (
              <span>
                {info.doctor.first_name + ' ' + info.doctor.last_name}
              </span>
            ),
            Date: <span>{info.date}</span>,
            ScheduleId: <span>{info.schedule}</span>,
            TotalAppointment: <span>{info.total_appointments}</span>,
            button: [
              {
                title: 'Cancel',
                red: true,
                setStates: () => {
                  async function cancelAppointment() {
                    await fetch(
                      apiUrl + `appointments/Doctor-Appointments/${info.id}/`,
                      {
                        method: 'DELETE',
                      }
                    );
                    fetchDataHandler();
                  }
                  cancelAppointment();
                },
              },
            ],
          };
        })
      );
    }
    if (billsPopUp) {
      const data = await response[7].json();
      console.log(data.results);
      setBills(
        data.results.map(info => {
          return {
            id: <span>{info.id}</span>,
            appointmentId: <span>{info.appointment.id}</span>,
            patient: (
              <span>
                {info.patient.first_name + ' ' + info.patient.last_name}
              </span>
            ),
            doctor: (
              <span>
                {info.appointment.doctor.first_name +
                  ' ' +
                  info.appointment.doctor.last_name}
              </span>
            ),
            schedulePrice: <span>{info.appointment.slot.schedule.price}</span>,
            total: <span>{info.total}</span>,
            //todo: m3rf4 maloooo
            card: [
              info.insurance !== null && {
                title: 'Insurance',
              },
              info.radiology_request !== null && {
                title: 'Radiology Request',
                card: info.radiology_request.exams.map(info => {
                  return {
                    name: <span>{info.name}</span>,
                    price: <span>{info.price}</span>,
                  };
                }),
              },
              info.lab_request !== null && {
                title: 'Lab Request',
                card: info.lab_request.exams.map(info => {
                  return {
                    name: <span>{info.name}</span>,
                    price: <span>{info.price}</span>,
                  };
                }),
              },
              info.prescription !== null && {
                title: 'Prescription',
                card: info.prescription.prescription.map(info => {
                  return {
                    name: <span>{info.drug.name}</span>,
                    price: <span>{info.drug.price}</span>,
                  };
                }),
              },
            ],
            // insurance:
            //   info.insurance !== null && info.insurance.map(info => {}),
            // radiology_request:
            //   info.radiology_request !== null &&
            //   info.radiology_request.map(info => {}),
            // lab_request:
            //   info.lab_request !== null && info.lab_request.map(info => {}),
          };
        })
      );
    }
    setIsLoading(false);
  }
  //fetch data every change on these dependencies
  useEffect(() => {
    fetchDataHandler();
  }, [
    PatientAppointmentDoctor,
    PatientAppointmentDayOfWeek,
    PatientAppointmentDate,
    openWindow,
    billsPopUp,
  ]);
  //update state that connected to api data
  useEffect(() => {
    setDropDownContent({
      specialty: specialtyList,
      doctor: doctorsList,
      days: daysList,
    });
  }, [specialtyList, doctorsList, daysList]);
  //todo: search and filter unhandled
  const [
    PatientAppointmentSearchSelected,
    setPatientAppointmentSearchSelected,
  ] = useState();
  const [toggleFilter, setToggleFilter] = useState(false);
  //resets bookappointment page data
  const resetBookNewAppointment = () => {
    setPatientAppointmentSelectedStep(1);
    setPatient(0);
    setAppointmentType(1);
    setPatientAppointmentDoctor(null);
    setPatientAppointmentDate(null);
    setPatientAppointmentTime(null);
    setOpenWindow(1);
    setPatientAppointmentSearchSelected(null);
    setCurrentDate(new Date());
    setTimeSlots([]);
  };
  //Book New Appointment Selection body content
  const selection = [
    //todo: using role isn't the best way
    //role used for assigning first step content (on patient first step is 'pick specialization' and on receptionist first step is 'enter patient id')
    {
      //this shows only on receptionist
      type: 'input',
      id: userctx.role === 'receptionist' ? 1 : 0,
      selectstate: setPatient,
      patient: patient,
      title: 'Enter Patient ID',
      setAppointmentType: setAppointmentType,
      currentAppointmentType: appointmentType,
      setSelectedStep: setPatientAppointmentSelectedStep,
      currentStep: PatientAppointmentSelectedStep,
    },
    {
      type: 'dropDown',
      id: userctx.role === 'receptionist' ? 2 : 1,
      dropDownContent: dropDownContent.specialty,
      selectstate: setPatientAppointmentSpecialist,
      searchstate: setPatientAppointmentSearchSelected,
      title: 'Pick Specialization',
      setSelectedStep: setPatientAppointmentSelectedStep,
      currentStep: PatientAppointmentSelectedStep,
    },
    {
      type: 'dropDown',
      id: userctx.role === 'receptionist' ? 3 : 2,
      dropDownContent: dropDownContent.doctor,
      selectstate: setPatientAppointmentDoctor,
      searchstate: setPatientAppointmentSearchSelected,
      title: 'Pick Doctor',
      setSelectedStep: setPatientAppointmentSelectedStep,
      currentStep: PatientAppointmentSelectedStep,
    },
    {
      id: userctx.role === 'receptionist' ? 4 : 3,
      type: 'dropDown',
      title: 'Pick Day',
      dropDownContent: dropDownContent.days,
      selectstate: setPatientAppointmentDayOfWeek,
      selectedDay: setDayOfWeekName,
      setSelectedStep: setPatientAppointmentSelectedStep,
      currentStep: PatientAppointmentSelectedStep,
    },
    {
      type: 'selection',
      id: userctx.role === 'receptionist' ? 5 : 4,
      selectedDay: dayOfWeekName,
      DateAndTime: true,
      DateSetState: setPatientAppointmentDate,
      TimeSetState: setPatientAppointmentTime,
      CurrentTime: PatientAppointmentTime,
      TimeSlots: timeSlots,
      title: 'Set Date & Time',
      setSelectedStep: setPatientAppointmentSelectedStep,
      currentStep: PatientAppointmentSelectedStep,
      currentDate: currentDate,
      setCurrentDate: setCurrentDate,
    },
  ];

  /*Doctor Schedule States*/
  const [doctorScheduleSelectedStep, setDoctorScheduleSelectedStep] =
    useState(1);
  //todo: connect specialist to doctor
  const [doctorScheduleSpecialist, setDoctorScheduleSpecialist] = useState(0);
  const [doctorScheduleDoctor, setDoctorScheduleDoctor] = useState(null);
  const [doctorScheduleDayAndDuration, setDoctorScheduleDayAndDuration] =
    useState([
      {
        id: 1,
        Work: 1,
        Day: 'Saturday',
      },
      {
        id: 2,
        Work: 0,
        Day: 'Sunday',
      },
      {
        id: 3,
        Work: 1,
        Day: 'Monday',
      },
      {
        id: 4,
        Work: 0,
        Day: 'Tuesday',
      },
      {
        id: 5,
        Work: 0,
        Day: 'Wednesday',
      },
      {
        id: 6,
        Work: 0,
        Day: 'Thursday',
      },
      {
        id: 7,
        Work: 0,
        Day: 'Friday',
      },
    ]);
  const [doctorSchedulesearchSelected, setDoctorScheduleSearchSelected] =
    useState();

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

  /*Booking Information */
  //todo: need optimization
  //all info of booking before posting to api
  const AppointmentDetailsPendingConfirmation = {
    id: 1,
    patient: patient,
    doctorId: doctorsList
      ?.filter(doctor => doctor.id === PatientAppointmentDoctor)
      .map(doctor => {
        return doctor.id;
      })[0],
    docotrName: doctorsList
      ?.filter(doctor => doctor.id === PatientAppointmentDoctor)
      .map(doctor => {
        return doctor.body;
      })[0],
    date: PatientAppointmentDate,
    slot: PatientAppointmentTime,

    type: userctx.role === 'patient' ? 'new' : appointmentType,
    //todo: dummy
    status: 'pending',
  };

  //Doctor Schedule Selection body
  const doctorSelection = [
    {
      type: 'dropDown',
      id: 1,
      dropDownContent: dropDownContent.doctor,
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
      // startTimeSetState: setDoctorScheduleStartTime,
      // endTimeSetState: setDoctorScheduleEndTime,
      searchstate: setPatientAppointmentSearchSelected,
      title: 'Set Day & Duration',
      setSelectedStep: setDoctorScheduleSelectedStep,
      currentStep: doctorScheduleSelectedStep,
    },
  ];
  //Posting Pending Booking Appointment
  const AddAppointmentList = async () => {
    await fetch(apiUrl + 'appointments/Booked-Appointments/', {
      method: 'POST',
      body: JSON.stringify({
        patient:
          userctx.role === 'receptionist'
            ? AppointmentDetailsPendingConfirmation.patient
            : AppointmentDetailsPendingConfirmation.patient.id,
        doctor: AppointmentDetailsPendingConfirmation.doctorId,
        date: AppointmentDetailsPendingConfirmation.date,
        slot: AppointmentDetailsPendingConfirmation.slot,
        type:
          AppointmentDetailsPendingConfirmation.type === 1
            ? 'new'
            : AppointmentDetailsPendingConfirmation.type === 2
            ? 'followup'
            : AppointmentDetailsPendingConfirmation.type,
        status: 'pending',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // const data = await response.json();
    // console.log(
    //   'response : ',
    //   data,
    //   'type : ',
    //   AppointmentDetailsPendingConfirmation.type,
    //   'patient : ' + AppointmentDetailsPendingConfirmation.patient
    // );
  };
  const AddDoctorSchedule = async () => {
    for (let i = 0; i < doctorScheduleDayAndDuration.length; i++) {
      if (doctorScheduleDayAndDuration[i].Work === true) {
        await fetch(apiUrl + 'appointments/doctor-schedule/', {
          method: 'POST',
          body: JSON.stringify({
            day_of_week: doctorScheduleDayAndDuration[i].Day,
            start_time: doctorScheduleDayAndDuration[i].start_time,
            end_time: doctorScheduleDayAndDuration[i].end_time,
            slot_duration: doctorScheduleDayAndDuration[i].slot_duration,
            doctor: doctorScheduleDoctor,
            //todo: dummy
            schedule_status: 'active',
            price: '250',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // const data = await response.json();
        // console.log(
        //   'response : ' + data,
        //   'day : ' +
        //     doctorScheduleDayAndDuration[i].Day +
        //     '      end_time : ' +
        //     doctorScheduleDayAndDuration[i].end_time +
        //     +' slot_duration : ' +
        //     doctorScheduleDayAndDuration[i].slot_duration
        // );
      }
    }
  };
  const patientSideNav = [
    {
      id: 1,
      icon: (
        <FontAwesomeIcon
          icon={faFileCirclePlus}
          size='xl'
          style={{ color: openWindow === 1 && '#49A96E' }}
        />
      ),
    },
    {
      id: 3,
      icon: (
        <FontAwesomeIcon
          icon={faFile}
          size='xl'
          style={{ color: openWindow === 3 && '#49A96E' }}
        />
      ),
    },
  ];
  const doctorSideNav = [
    {
      id: 3,
      icon: (
        <FontAwesomeIcon
          icon={faFile}
          size='xl'
          style={{ color: openWindow === 3 && '#49A96E' }}
        />
      ),
    },
  ];
  const receptionistSideNav = [
    {
      id: 1,
      icon: (
        <FontAwesomeIcon
          icon={faFileCirclePlus}
          size='xl'
          style={{ color: openWindow === 1 && '#49A96E' }}
        />
      ),
    },
    {
      id: 2,
      icon: (
        <FontAwesomeIcon
          icon={faUserDoctor}
          size='xl'
          style={{ color: openWindow === 2 && '#49A96E' }}
        />
      ),
    },
    {
      id: 3,
      icon: (
        <FontAwesomeIcon
          icon={faFile}
          size='xl'
          style={{ color: openWindow === 3 && '#49A96E' }}
        />
      ),
    },
    {
      id: 4,
      icon: (
        <FontAwesomeIcon
          icon={faPhoneSlash}
          size='xl'
          style={{ color: openWindow === 4 && '#49A96E' }}
        />
      ),
    },
  ];

  return (
    <div className={classesBody.container}>
      {/* appointment NavBar */}
      <SideNavBar
        sideNav={
          userctx.role === 'patient'
            ? patientSideNav
            : userctx.role === 'receptionist'
            ? receptionistSideNav
            : doctorSideNav
        }
        setOpenWindow={setOpenWindow}
      />
      {/* Book New Appointment */}
      {(userctx.role === 'receptionist' || userctx.role === 'patient') && (
        <div
          className={classes.apointment}
          style={{ display: openWindow === 1 ? 'flex' : 'none' }}
        >
          <h2 className={classes.title}>Book New Appointment</h2>

          <div className={classes.body}>
            <StepsCircle
              stepsCount={userctx.role === 'receptionist' ? 5 : 4}
              selectedStep={PatientAppointmentSelectedStep}
            />
            <div className={classes.stepContent}>
              {/* Each Step Selection */}
              {selection.map((select, index) => {
                return select.type === 'dropDown' ? (
                  select.dropDownContent !== undefined && (
                    <Selection key={index} {...select} />
                  )
                ) : (
                  <Selection key={index} {...select} />
                );
              })}
              {/* confirmation  */}
              <div
                className={
                  userctx.role === 'receptionist'
                    ? PatientAppointmentSelectedStep === 6
                      ? classes.confirmDisplay
                      : classes.displayNone
                    : PatientAppointmentSelectedStep === 5
                    ? classes.confirmDisplay
                    : classes.displayNone
                }
              >
                <h2>Confirm Appointment</h2>
                <hr></hr>
                <div className={classes.appointmentDetails}>
                  <h3>Appointment Details</h3>
                  <div className={classes.appointmentDetailsBody}>
                    {/* showing appointmentdetails */}
                    {Object.keys(AppointmentDetailsPendingConfirmation).map(
                      a => {
                        return (
                          a !== 'id' &&
                          a !== 'patient' &&
                          a !== 'doctorId' &&
                          a !== 'slot' && (
                            <h4>
                              {a + ' : '}
                              {AppointmentDetailsPendingConfirmation[a]}
                            </h4>
                          )
                        );
                      }
                    )}
                    {/* confirm and cancel button */}
                    <div className={classes.appointmentDetailsBodyButtons}>
                      {/*todo: not complete yet*/}
                      {/* onclick send to api */}
                      <button
                        className={classes.confirm}
                        onClick={() => {
                          AddAppointmentList();
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
          <StepsCircle
            stepsCount={2}
            selectedStep={doctorScheduleSelectedStep}
          />
          <div className={classes.stepContent}>
            {doctorSelection.map((select, index) => {
              return select.type === 'dropDown' ? (
                select.dropDownContent !== undefined && (
                  <Selection key={index} {...select} />
                )
              ) : (
                <Selection key={index} {...select} />
              );
            })}
            {doctorScheduleSelectedStep >= 3 &&
              AddDoctorSchedule() &&
              resetDoctorSchedule()}
          </div>
        </div>
      </div>
      {/* All Appointments */}
      {openWindow === 3 && allAppointmentList !== null && (
        <>
          <DetailsBody
            toggleFilter={toggleFilter}
            setToggleFilter={setToggleFilter}
            details={allAppointmentList}
            title={'All Appointments'}
            style={{ display: openWindow === 3 ? 'flex' : 'none' }}
          />
        </>
      )}
      {openWindow === 4 && allAppointmentList !== null && (
        <>
          <DetailsBody
            toggleFilter={toggleFilter}
            setToggleFilter={setToggleFilter}
            details={allAppointmentList}
            title={'Cancel Doctor Appointment'}
          />
        </>
      )}
      {billsPopUp && (
        <PopUp
          popUp={billsPopUp}
          setPopUp={setBillsPopUp}
          Cards={bills}
          title={'Bills'}
        />
      )}
    </div>
  );
}
export default Appointment;
