/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState, useContext, useEffect, useRef } from 'react';
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
import doctorPic from '../../Images/SVG/Doctor.svg';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Appointment() {
  const isMountedRef = useRef(false);
  const navigate = useNavigate();
  const toastPlaceHolder = {
    position: 'bottom-right',
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  };
  const [currentDate, setCurrentDate] = useState(new Date());
  const [justOnce, setJustOnce] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [insurancePopUp, setInsurancePopUp] = useState(false);
  const [newInsurancePopUp, setNewInsurancePopUp] = useState(false);
  const insuranceRawData = {
    InsuranceNumber: '',
    InsuranceExpireDate: '',
    InsuranceCoverage: '',
    InsuranceCoveragePercentage: '',
    InsuranceCompany: '',
    InsuranceCard: '',
  };
  const [insuranceCard, setInsuranceCard] = useState(null);
  const [insurancePostData, setInsurancePostData] = useState(null);
  const [insuranceList, setInsuranceList] = useState([]);
  const [insuranceID, setInsuranceID] = useState(null);
  const [patientID, setPatientID] = useState(null);
  const [tempSelected, setTempSelected] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  //context api to get user role
  const userctx = useContext(UserContext);
  //pages count
  const [pages, setPages] = useState(1);
  //lists got from api
  const [specialtyList, setSpecialityList] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [daysList, setDaysList] = useState([]);
  /*Appointment States */
  const [PatientAppointmentSelectedStep, setPatientAppointmentSelectedStep] =
    useState(1);
  const [patient, setPatient] = useState('');
  const [patientSearchId, setPatientSearchId] = useState('');
  const [appointmentType, setAppointmentType] = useState(1);
  const [PatientAppointmentSpecialist, setPatientAppointmentSpecialist] =
    useState('');
  const [PatientAppointmentDoctor, setPatientAppointmentDoctor] =
    useState(null);
  const [PatientAppointmentDayOfWeek, setPatientAppointmentDayOfWeek] =
    useState(null);
  const [dayOfWeekName, setDayOfWeekName] = useState(null);
  const [PatientAppointmentDate, setPatientAppointmentDate] = useState(null);
  const [PatientAppointmentTime, setPatientAppointmentTime] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [allAppointmentList, setAllAppointmentList] = useState([]);
  const [
    PatientAppointmentSearchSelected,
    setPatientAppointmentSearchSelected,
  ] = useState('');
  const [prevSearchQuery, setPrevSearchQuery] = useState('');
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
        Work: 0,
        Day: 'Saturday',
      },
      {
        id: 2,
        Work: 0,
        Day: 'Sunday',
      },
      {
        id: 3,
        Work: 0,
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
        id: 1,
        Work: 0,
        Day: 'Saturday',
      },
      {
        id: 2,
        Work: 0,
        Day: 'Sunday',
      },
      {
        id: 3,
        Work: 0,
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
    setOpenWindow(2);
    setDoctorScheduleSearchSelected(null);
  };

  const [openWindow, setOpenWindow] = useState(
    userctx.role === 'doctor' ? 3 : 1
  );
  useEffect(() => {
    const storedOpenWindow = localStorage.getItem('openWindow');
    if (storedOpenWindow) {
      setOpenWindow(JSON.parse(storedOpenWindow));
      localStorage.removeItem('openWindow');
    }
  }, []);
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

  useEffect(() => {
    setPages(1);
  }, [
    PatientAppointmentDoctor,
    PatientAppointmentDayOfWeek,
    PatientAppointmentDate,
    PatientAppointmentSearchSelected,
    PatientAppointmentSpecialist,
    billsPopUp,
    openWindow,
  ]);
  useEffect(() => {
    setTimeSlots([]);
    setJustOnce(true);
  }, [PatientAppointmentDate]);

  async function fetchDataHandler() {
    setIsLoading(true);
    const response = await Promise.all([
      openWindow === 1 &&
        PatientAppointmentSpecialist === '' &&
        fetch(
          apiUrl +
            `hospital/specialty/${`?search=${PatientAppointmentSearchSelected} ${
              PatientAppointmentSearchSelected === '' ? `&page=${pages} ` : ''
            }`}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          }
        ),
      (openWindow === 2 || PatientAppointmentSpecialist !== '') &&
        PatientAppointmentDoctor === null &&
        fetch(
          apiUrl +
            `hospital/doctor/${`?department=&specialty=${PatientAppointmentSpecialist}&search=${PatientAppointmentSearchSelected}${
              PatientAppointmentSearchSelected === '' ? `&page=${pages} ` : ''
            }`}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          }
        ),
      ((PatientAppointmentDoctor !== null &&
        PatientAppointmentDayOfWeek === null) ||
        (openWindow === 2 && doctorScheduleDoctor !== null)) &&
        fetch(
          apiUrl +
            `appointments/doctor-schedule/?doctor=${PatientAppointmentDoctor}&day_of_week=&start_time=&end_time=&slot_duration=&schedule_status=&price=${
              PatientAppointmentSearchSelected === '' ? `&page=${pages} ` : ''
            }`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          }
        ),
      PatientAppointmentDayOfWeek !== null &&
        PatientAppointmentDate !== null &&
        fetch(
          apiUrl +
            `appointments/doctor-slots/?date=${PatientAppointmentDate}&doctor=${PatientAppointmentDoctor}&schedule=${PatientAppointmentDayOfWeek}&page=${pages}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          }
        ),
      userctx.role === 'patient' &&
        fetch(apiUrl + 'hospital/patient/me/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('token')}`,
          },
        }),
      openWindow === 3 &&
        billsPopUp === false &&
        fetch(
          apiUrl +
            `appointments/Booked-Appointments/?search=${PatientAppointmentSearchSelected}${
              PatientAppointmentSearchSelected === '' ? `&page=${pages}` : ''
            }`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          }
        ),
      openWindow === 4 &&
        fetch(
          apiUrl +
            `appointments/Doctor-Appointments/?search=${PatientAppointmentSearchSelected}${
              PatientAppointmentSearchSelected === '' ? `&page=${pages}` : ''
            }`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          }
        ),
      billsPopUp &&
        fetch(
          apiUrl +
            `bills/bill/?patient=&patient__user__username=&appointment=${billsPopUp}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          }
        ),
    ]);
    if (openWindow === 1 && PatientAppointmentSpecialist === '') {
      if (response[0].status !== 404) {
        const specialty = await response[0].json();
        const specialtyList = specialty.results.map(info => {
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
        });
        if (PatientAppointmentSearchSelected === '')
          setSpecialityList(prevspecialtyList => [
            ...prevspecialtyList,
            ...specialtyList,
          ]);
        else setSpecialityList(specialtyList);
      }
    }
    if (
      (openWindow === 2 || PatientAppointmentSpecialist !== '') &&
      PatientAppointmentDoctor === null
    ) {
      if (response[1].status !== 404) {
        const doctors = await response[1].json();
        const docotrsList = doctors.results.map(info => {
          return {
            id: info.id,
            name: info.user.first_name + ' ' + info.user.last_name,
            card: {
              name: (
                <h4>
                  {/* ///todo: doctor image */}
                  {/* {console.log(info.image)} */}
                  {info.image !== null && (
                    <img
                      src={info.image}
                      alt='doctor'
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = doctorPic;
                      }}
                    />
                  )}
                  name :
                  <span>
                    {info.user.first_name + ' ' + info.user.last_name}
                  </span>
                </h4>
              ),
            },
          };
        });
        if (PatientAppointmentSearchSelected === '') {
          setDoctorsList(prevdoctorsList => [
            ...prevdoctorsList,
            ...docotrsList,
          ]);
        } else setDoctorsList(docotrsList);
      }
    }
    if (
      (PatientAppointmentDoctor !== null &&
        PatientAppointmentDayOfWeek === null) ||
      doctorScheduleDoctor !== null
    ) {
      if (response[2].status !== 404) {
        let Days = await response[2].json();
        let daysResult = Days.results
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
          });
        setDaysList(prevdaysList => [...prevdaysList, ...daysResult]);
      }
    }
    if (
      PatientAppointmentDayOfWeek !== null &&
      PatientAppointmentDate !== null
    ) {
      if (response[3].status !== 404) {
        const Slots = await response[3].json();
        let slotsResult = Slots.results.map(info => {
          return {
            id: info.id,
            body:
              info.start_time.toString().slice(0, 5) +
              ' : ' +
              info.end_time.toString().slice(0, 5),
          };
        });
        setTimeSlots(prevtimeSlots => [...prevtimeSlots, ...slotsResult]);
      }
    }
    if (userctx.role === 'patient') {
      const patient = await response[4].json();
      setPatient({
        id: patient.id,
        Name: patient.user.first_name + ' ' + patient.user.last_name,
      });
    }
    if (openWindow === 3 && billsPopUp === false) {
      const allAppointments = await response[5].json();
      console.log(allAppointments);
      let allAppointmentsResult = allAppointments.results.map(info => {
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
          StartTime: <span>{info.slot.start_time.toString().slice(0, 5)}</span>,
          EndTime: <span>{info.slot.end_time}</span>,
          status: <span>{info.status}</span>,
          ...(userctx.role === 'receptionist' && {
            button: [
              (info.status === 'waiting' || info.status === 'completed') && {
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
              info.status === 'waiting' && {
                title: 'Set Insurance',
                setStates: () => {
                  setInsurancePopUp(info.patient.id);
                  setSelectedAppointment(info.id);
                },
              },
              info.status !== 'completed' && {
                title:
                  info.status === 'pending'
                    ? 'Set To Waiting'
                    : info.status === 'waiting' && 'Set To Completed',
                setStates: () => {
                  async function changeStatus() {
                    try {
                      const id = toast.loading('Please wait...', {
                        position: 'bottom-right',
                      });
                      const response = await fetch(
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
                            Authorization: `JWT ${localStorage.getItem(
                              'token'
                            )}`,
                          },
                        }
                      );

                      if (response.ok) {
                        setAllAppointmentList([]);
                        // if (pages === 1) fetchDataHandler();
                        // else setPages(1);
                        localStorage.setItem('openWindow', JSON.stringify(3));

                        setTimeout(() => {
                          window.location.reload();
                        }, 1000);
                        toast.update(id, {
                          render: 'Status Changed Successfully',
                          type: 'success',
                          isLoading: false,
                          position: 'bottom-right',
                          hideProgressBar: true,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: 'light',
                          autoClose: true,
                        });
                      } else {
                        toast.update(id, {
                          render: 'Something went wrong',
                          type: 'error',
                          isLoading: false,
                          position: 'bottom-right',
                          hideProgressBar: true,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: 'light',
                          autoClose: true,
                        });
                      }
                    } catch (error) {
                      toast.error(error.message, {
                        position: 'bottom-right',
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                      });
                      // Handle the error here (e.g. show an error message to the user)
                    }
                  }
                  changeStatus();
                },
              },
            ],
          }),

          ...(userctx.role === 'doctor' &&
            info.status !== 'completed' &&
            info.status !== 'pending' && {
              button: [
                {
                  title: 'View Medical Record',
                  setStates: () => {
                    navigate('/medicalrecord', {
                      state: {
                        patientId: info.patient.id,
                        appointmentId: info.id,
                      },
                    });
                    window.location.reload();
                  },
                },
              ],
            }),
        };
      });
      if (PatientAppointmentSearchSelected === '') {
        if (prevSearchQuery === '') {
          // If both the current and previous search queries are empty, remove the previous results
          setAllAppointmentList(prevAppointmentList => [
            ...prevAppointmentList,
            ...allAppointmentsResult,
          ]);
        } else {
          // If only the current search query is empty, add the previous results to the new results
          setAllAppointmentList(allAppointmentsResult);
        }
      } else {
        // If the search query is not empty, replace the entire list with the new results
        setAllAppointmentList(allAppointmentsResult);
      }

      // Update the previous search query
      setPrevSearchQuery(PatientAppointmentSearchSelected);
    }
    if (openWindow === 4) {
      const data = await response[6].json();
      let allAppointmentsResult = data.results.map(info => {
        return {
          Doctor: (
            <span>{info.doctor.first_name + ' ' + info.doctor.last_name}</span>
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
                  try {
                    const id = toast.loading('Please wait...', {
                      position: 'bottom-right',
                    });
                    const response = await fetch(
                      apiUrl + `appointments/Doctor-Appointments/${info.id}/`,
                      {
                        method: 'DELETE',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `JWT ${localStorage.getItem('token')}`,
                        },
                      }
                    );

                    if (response.ok) {
                      // Appointment deleted successfully
                      // Call the fetchDataHandler function to refresh the data
                      setAllAppointmentList([]);
                      fetchDataHandler();
                      toast.update(id, {
                        render: 'Appointment deleted successfully',
                        type: 'success',
                        isLoading: false,
                        position: 'bottom-right',
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                        autoClose: true,
                      });
                    } else {
                      // Handle the error if the response is not ok
                      toast.update(id, {
                        render: 'Something went wrong',
                        type: 'error',
                        isLoading: false,
                        position: 'bottom-right',
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                        autoClose: true,
                      });
                    }
                  } catch (error) {
                    // Handle any network or server error
                    toast.error(error.message, {
                      position: 'bottom-right',
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: 'light',
                    });
                  }
                }
                cancelAppointment();
              },
            },
          ],
        };
      });
      if (PatientAppointmentSearchSelected === '') {
        if (prevSearchQuery === '') {
          // If both the current and previous search queries are empty, remove the previous results
          setAllAppointmentList(prevAppointmentList => [
            ...prevAppointmentList,
            ...allAppointmentsResult,
          ]);
        } else setAllAppointmentList(allAppointmentsResult);
      } else setAllAppointmentList(allAppointmentsResult);

      // Update the previous search query
      setPrevSearchQuery(PatientAppointmentSearchSelected);
    }
    if (billsPopUp) {
      const data = await response[7].json();
      setPatientID(data.results[0].patient.id);
      console.log(data);
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
            card: [
              info.insurance !== null && {
                title: 'Insurance',
                card: [
                  {
                    company: <span>{info.insurance.company}</span>,
                    number: <span>{info.insurance.number}</span>,
                    expairy_date: <span>{info.insurance.expairy_date}</span>,
                    coverage: <span>{info.insurance.coverage}</span>,
                    coverage_percentage: (
                      <span>{info.insurance.coverage_percentage}</span>
                    ),
                  },
                ],
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
                card: info.prescription.prescription
                  .filter(info => info.dispensed === true)
                  .map(info => {
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
    if (isMountedRef.current) fetchDataHandler();
  }, [
    PatientAppointmentDoctor,
    PatientAppointmentDayOfWeek,
    PatientAppointmentDate,
    PatientAppointmentSearchSelected,
    PatientAppointmentSpecialist,
    billsPopUp,
    pages,
  ]);
  useEffect(() => {
    if (pages === 1) {
      fetchDataHandler();
      isMountedRef.current = true;
    }
  }, [openWindow]);
  //update state that connected to api data
  useEffect(() => {
    setDropDownContent({
      specialty: specialtyList,
      doctor: doctorsList,
      days: daysList,
    });
  }, [specialtyList, doctorsList, daysList]);

  const [toggleFilter, setToggleFilter] = useState(false);
  //resets bookappointment page data
  const resetBookNewAppointment = () => {
    setPatientAppointmentSelectedStep(1);
    setPatient('');
    setAppointmentType(1);
    setPatientAppointmentDoctor(null);
    setPatientAppointmentDate(null);
    setPatientAppointmentTime(null);
    setOpenWindow(1);
    setPatientAppointmentSearchSelected('');
    setPatientAppointmentSpecialist('');
    setCurrentDate(new Date());
    setTimeSlots([]);
    setJustOnce(true);
  };
  useEffect(() => {
    setPatientAppointmentSelectedStep(1);
    setPatient('');
    setAppointmentType(1);
    setPatientAppointmentDoctor(null);
    setPatientAppointmentDayOfWeek(null);
    setDayOfWeekName(null);
    setPatientAppointmentDate(null);
    setPatientAppointmentTime(null);
    setPatientAppointmentSearchSelected('');
    setPatientAppointmentSpecialist('');
    setCurrentDate(new Date());
    setTimeSlots([]);
    setJustOnce(true);
    setSpecialityList([]);
    setDoctorsList([]);
    setDaysList([]);
    setAllAppointmentList([]);
  }, [openWindow]);
  useEffect(() => {
    setPatientAppointmentSearchSelected('');
  }, [PatientAppointmentSelectedStep]);
  //Book New Appointment Selection body content
  const selection = [
    //todo: using role isn't the best way
    //role used for assigning first step content (on patient first step is 'pick specialization' and on receptionist first step is 'enter patient id')
    {
      //this shows only on receptionist
      type: 'input',
      id: userctx.role === 'receptionist' ? 1 : 0,
      selectstate: setPatientSearchId,
      patient: patientSearchId,
      title: 'Enter Patient National ID or Phone Number',
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
      pagescroll: () => {
        setPages(prevPages => prevPages + 1);
      },
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
      pagescroll: () => {
        setPages(prevPages => prevPages + 1);
      },
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
      pagescroll: () => {
        setPages(prevPages => prevPages + 1);
      },
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
      setJustOnce: setJustOnce,
      justonce: justOnce,
      pagescroll: () => {
        setPages(prevPages => prevPages + 1);
      },
    },
  ];

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
    doctorName: doctorsList
      ?.filter(doctor => doctor.id === PatientAppointmentDoctor)
      .map(doctor => {
        return doctor.name;
      })[0],
    date: PatientAppointmentDate,
    slot: PatientAppointmentTime,

    type: userctx.role === 'patient' ? 1 : appointmentType,
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
      searchstate: setPatientAppointmentSearchSelected,
      title: 'Pick Doctor',
      setSelectedStep: setDoctorScheduleSelectedStep,
      currentStep: doctorScheduleSelectedStep,
      pagescroll: () => {
        setPages(prevPages => prevPages + 1);
      },
    },
    {
      type: 'selection',
      id: 2,
      dayAndDuration: true,
      dayAndDurationSetState: setDoctorScheduleDayAndDuration,
      currentDayAndDuration: doctorScheduleDayAndDuration,
      title: 'Set Day & Duration',
      setSelectedStep: setDoctorScheduleSelectedStep,
      currentStep: doctorScheduleSelectedStep,
    },
  ];
  useEffect(() => {
    async function SearchForPatient() {
      try {
        const id = toast.loading('Please wait...', {
          position: 'bottom-right',
        });

        const response = await fetch(
          apiUrl + `hospital/patient/?search=${patientSearchId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          }
        );
        const data = await response.json();
        if (data.results.length === 0) {
          toast.update(id, {
            render: 'Patient Not Found',
            type: 'error',
            isLoading: false,
            position: 'bottom-right',
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
            autoClose: true,
          });
        } else {
          setPatient(data.results[0].id);
          toast.update(id, {
            render: 'Patient ID is "' + data.results[0].id + '" Found',
            type: 'success',
            isLoading: false,
            position: 'bottom-right',
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
            autoClose: true,
          });
        }
      } catch (error) {
        toast.error(error.message, {
          position: 'bottom-right',
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
    }
    if (patientSearchId !== '') {
      SearchForPatient();
    }
  }, [patientSearchId]);
  //Posting Pending Booking Appointment
  const AddAppointmentList = async () => {
    try {
      const id = toast.loading('Please wait...', {
        position: 'bottom-right',
      });
      const response = await fetch(
        apiUrl + 'appointments/Booked-Appointments/',
        {
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
                : AppointmentDetailsPendingConfirmation.type === 3
                ? 'emergency'
                : 'telemedicine',
            status: 'pending',
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        toast.update(id, {
          render: 'Appointment Booked Successfully',
          type: 'success',
          isLoading: false,
          position: 'bottom-right',
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          autoClose: true,
        });

        localStorage.setItem('openWindow', JSON.stringify(3));

        setTimeout(() => {
          window.location.reload();
        }, 2000);

        // Appointment booking successful
        // Proceed with next steps
      } else {
        toast.update(id, {
          render: 'Something went wrong',
          type: 'error',
          isLoading: false,
          position: 'bottom-right',
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          autoClose: true,
        });
      }
    } catch (error) {
      toast.error('Something went wrong', {
        position: 'bottom-right',
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };
  const AddDoctorSchedule = async () => {
    let count = 1;
    let currentSchedule = [];
    while (count !== null) {
      const response = await fetch(
        apiUrl +
          `appointments/doctor-schedule/?doctor=${doctorScheduleDoctor}&day_of_week=&start_time=&end_time=&slot_duration=&schedule_status=&price=&page=${count}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await response.json();
      currentSchedule = [
        ...currentSchedule,
        ...data.results.map(info => ({
          id: info.id,
          day_of_week: info.day_of_week,
        })),
      ];
      count++;
      if (data.next === null) {
        count = null;
      }
    }
    console.log(currentSchedule);
    for (let i = 0; i < doctorScheduleDayAndDuration.length; i++) {
      let currentScheduleId = null;
      if (doctorScheduleDayAndDuration[i].Work === true) {
        if (
          !currentSchedule.some(
            schedule =>
              schedule.day_of_week === doctorScheduleDayAndDuration[i].Day
          )
        ) {
          try {
            const id = toast.loading('Please wait...', {
              position: 'bottom-right',
            });
            const response = await fetch(
              apiUrl + 'appointments/doctor-schedule/',
              {
                method: 'POST',
                body: JSON.stringify({
                  day_of_week: doctorScheduleDayAndDuration[i].Day,
                  start_time: doctorScheduleDayAndDuration[i].start_time,
                  end_time: doctorScheduleDayAndDuration[i].end_time,
                  slot_duration: doctorScheduleDayAndDuration[i].slot_duration,
                  doctor: doctorScheduleDoctor,
                  schedule_status: 'active',
                  price: doctorScheduleDayAndDuration[i].price,
                }),
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `JWT ${localStorage.getItem('token')}`,
                },
              }
            );

            if (response.ok) {
              // Schedule created successfully
              // Proceed with next steps
              toast.update(id, {
                render: `${doctorScheduleDayAndDuration[i].Day} Added To Schedule Successfully`,
                type: 'success',
                isLoading: false,
                position: 'bottom-right',
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                autoClose: true,
              });
            } else {
              toast.update(id, {
                render: 'Something went wrong',
                type: 'error',
                isLoading: false,
                position: 'bottom-right',
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                autoClose: true,
              });
            }
          } catch (error) {
            toast.error(error.message, {
              position: 'bottom-right',
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            });
            // Handle the error here (e.g. show an error message to the user)
          }
        } else if (
          currentSchedule.some(schedule => {
            if (schedule.day_of_week === doctorScheduleDayAndDuration[i].Day) {
              currentScheduleId = schedule.id;
              return true;
            } else {
              return false;
            }
          })
        ) {
          try {
            const id = toast.loading('Please wait...', {
              position: 'bottom-right',
            });

            const response = await fetch(
              apiUrl + `appointments/doctor-schedule/${currentScheduleId}/`,
              {
                method: 'PUT',
                body: JSON.stringify({
                  day_of_week: doctorScheduleDayAndDuration[i].Day,
                  start_time: doctorScheduleDayAndDuration[i].start_time,
                  end_time: doctorScheduleDayAndDuration[i].end_time,
                  slot_duration: doctorScheduleDayAndDuration[i].slot_duration,
                  doctor: doctorScheduleDoctor,
                  schedule_status: 'active',
                  price: doctorScheduleDayAndDuration[i].price,
                }),
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `JWT ${localStorage.getItem('token')}`,
                },
              }
            );
            if (response.ok) {
              // Schedule created successfully
              // Proceed with next steps
              toast.update(id, {
                render: `${doctorScheduleDayAndDuration[i].Day} Updated To Schedule Successfully`,
                type: 'success',
                isLoading: false,
                position: 'bottom-right',
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                autoClose: true,
              });
            } else {
              toast.update(id, {
                render: 'Something went wrong',
                type: 'error',
                isLoading: false,
                position: 'bottom-right',
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                autoClose: true,
              });
            }
          } catch (error) {
            toast.error(error.message, {
              position: 'bottom-right',
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            });
          }
        }
      } else {
        if (
          currentSchedule.some(schedule => {
            if (schedule.day_of_week === doctorScheduleDayAndDuration[i].Day) {
              currentScheduleId = schedule.id;
              return true;
            } else {
              return false;
            }
          })
        ) {
          try {
            const id = toast.loading('Please wait...', {
              position: 'bottom-right',
            });

            const response = await fetch(
              apiUrl + `appointments/doctor-schedule/${currentScheduleId}`,
              {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `JWT ${localStorage.getItem('token')}`,
                },
              }
            );
            if (response.ok) {
              // Schedule created successfully
              // Proceed with next steps
              toast.update(id, {
                render: `${doctorScheduleDayAndDuration[i].Day} Deleted From Schedule Successfully`,
                type: 'success',
                isLoading: false,
                position: 'bottom-right',
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                autoClose: true,
              });
            } else {
              toast.update(id, {
                render: 'Something went wrong',
                type: 'error',
                isLoading: false,
                position: 'bottom-right',
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                autoClose: true,
              });
            }
          } catch (error) {
            toast.error(error.message, {
              position: 'bottom-right',
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            });
          }
        }
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
  useEffect(() => {
    async function GetInsuranceList() {
      try {
        const response = await fetch(
          apiUrl +
            `bills/insurancedetails/?patient=${insurancePopUp}&patient__user__username=&company=&number=`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          }
        );
        const data = await response.json();
        setInsuranceList(
          data.results.map(info => {
            return {
              id: info.id,
              card: {
                company: (
                  <h2>
                    company : <span>{info.company}</span>
                  </h2>
                ),
                expairy_date: (
                  <h2>
                    expairy date : <span>{info.expairy_date}</span>
                  </h2>
                ),
                coverage: (
                  <h2>
                    coverage : <span>{info.coverage}</span>
                  </h2>
                ),
                coverage_percentage: (
                  <h2>
                    coverage percentage :{' '}
                    <span>{info.coverage_percentage}</span>
                  </h2>
                ),
                card: (
                  <a
                    className={`${classes.Button} ${classes.ButtonYellow}`}
                    href={info.card}
                    target='_blank'
                    rel='noreferrer'
                  >
                    card
                  </a>
                ),
              },
            };
          })
        );
      } catch (error) {
        toast.error(error.message, {
          position: 'bottom-right',
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
    }
    if (insurancePopUp) {
      GetInsuranceList();
    }
  }, [insurancePopUp]);
  useEffect(() => {
    async function SetInsurance() {
      try {
        const id = toast.loading('Please wait...', {
          position: 'bottom-right',
        });
        const resopnse1 = await fetch(
          apiUrl +
            `bills/bill/?patient=&patient__user__username=&appointment=${selectedAppointment}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          }
        );
        const data1 = await resopnse1.json();

        const response = await fetch(
          apiUrl + `bills/bill/${data1.results[0].id}/`,
          {
            method: 'PATCH',
            body: JSON.stringify({
              insurance: insuranceID,
            }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          }
        );
        if (response.ok) {
          toast.update(id, {
            render: 'Insurance Added Successfully',
            type: 'success',
            isLoading: false,
            position: 'bottom-right',
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
            autoClose: true,
          });
        } else {
          toast.update(id, {
            render: 'Something went wrong',
            type: 'error',
            isLoading: false,
            position: 'bottom-right',
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
            autoClose: true,
          });
        }
      } catch (error) {
        toast.error(error.message, {
          position: 'bottom-right',
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
    }
    if (insuranceID !== null) {
      SetInsurance();
      setInsurancePopUp(null);
    }
  }, [insuranceID]);
  useEffect(() => {
    async function PostNewInsuarance() {
      const formData = new FormData();
      formData.append('card', insuranceCard[0]);
      formData.append('number', insurancePostData[0].InsuranceNumber);
      formData.append('expairy_date', insurancePostData[0].InsuranceExpireDate);
      formData.append('coverage', insurancePostData[0].InsuranceCoverage);
      formData.append(
        'coverage_percentage',
        insurancePostData[0].InsuranceCoveragePercentage
      );
      formData.append('company', insurancePostData[0].InsuranceCompany);
      formData.append('patient', patientID);
      const response = await fetch(apiUrl + 'bills/insurancedetails/', {
        method: 'POST',
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      if (response.ok) {
        toast.success(
          'Insurance information added successfully',
          toastPlaceHolder
        );
        setNewInsurancePopUp(false);
        setInsurancePostData(null);
        setInsuranceCard(null);
      } else {
        toast.error('Something went wrong, please try again');
      }
    }
    PostNewInsuarance();
  }, [insurancePostData]);
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
                              {a === 'doctorName'
                                ? 'doctor name : '
                                : a + ' : '}
                              {a === 'type'
                                ? AppointmentDetailsPendingConfirmation[a] === 1
                                  ? 'new'
                                  : AppointmentDetailsPendingConfirmation[a] ===
                                    2
                                  ? 'follow up'
                                  : AppointmentDetailsPendingConfirmation[a] ===
                                    3
                                  ? 'emergency'
                                  : AppointmentDetailsPendingConfirmation[a] ===
                                      4 && 'telemedicine'
                                : AppointmentDetailsPendingConfirmation[a]}
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
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        className={classes.cancel}
                        onClick={() => {
                          resetBookNewAppointment();
                          window.location.reload();
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
            searchstate={setPatientAppointmentSearchSelected}
            details={allAppointmentList}
            title={'All Appointments'}
            style={{ display: openWindow === 3 ? 'flex' : 'none' }}
            pagescroll={() => {
              setPages(prevPages => prevPages + 1);
            }}
            justonce={justOnce}
            setJustOnce={setJustOnce}
          />
        </>
      )}
      {openWindow === 4 && allAppointmentList !== null && (
        <>
          <DetailsBody
            toggleFilter={toggleFilter}
            setToggleFilter={setToggleFilter}
            searchstate={setPatientAppointmentSearchSelected}
            details={allAppointmentList}
            title={'Cancel Doctor Appointment'}
            style={{ display: openWindow === 4 ? 'flex' : 'none' }}
            pagescroll={() => {
              setPages(prevPages => prevPages + 1);
            }}
            justonce={justOnce}
            setJustOnce={setJustOnce}
          />
        </>
      )}
      {billsPopUp && (
        <PopUp
          popUp={billsPopUp}
          setPopUp={setBillsPopUp}
          Cards={bills}
          title={'Bills'}
          additionalButton={() => {
            setNewInsurancePopUp(true);
          }}
          additionalButtonText={'+ Add New Insurance'}
        />
      )}
      {console.log(tempSelected)}
      {newInsurancePopUp && (
        <PopUp
          popUp={newInsurancePopUp}
          setPopUp={setNewInsurancePopUp}
          formInput={true}
          rawData={insuranceRawData}
          title={'Add New Insurance Information'}
          selected={tempSelected}
          selectstate={setTempSelected}
          buttonFunction={() => {
            setInsurancePostData(tempSelected);
          }}
          buttonText={'Confirm'}
          reportFile={insuranceCard}
          setReportFile={setInsuranceCard}
        />
      )}
      {insurancePopUp && (
        <PopUp
          popUp={insurancePopUp}
          setPopUp={setInsurancePopUp}
          selectstate={setTempSelected}
          selected={tempSelected}
          selection={insuranceList}
          buttonFunction={() => {
            setInsuranceID(tempSelected);
          }}
          multiple={false}
          buttonText={'Confirm'}
          pagescroll={() => {
            setPages(prevPages => prevPages + 1);
          }}
        />
      )}
    </div>
  );
}
export default Appointment;
