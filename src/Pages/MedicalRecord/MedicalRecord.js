import classes from './MedicalRecord.module.css';
import bodyClasses from '../Body.module.css';
import SideNavBar from '../../component/SideNavBar/SideNavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVialVirus,
  faXRay,
  faNotesMedical,
  faPills,
} from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useContext } from 'react';
import DetailsBody from '../../component/DetailsBody/DetailsBody';
import { apiUrl } from '../../utils/api';
import { useLocation } from 'react-router-dom';
import PopUp from '../../component/PopUp/PopUp';
import UserContext from '../../context/user-context';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../component/Loader/Loader';
function MedicalRecord() {
  const [pages, setPages] = useState(1);
  const [popUpPages, setPopUpPages] = useState(1);
  const userctx = useContext(UserContext);
  const { state } = useLocation();

  const [prev, setPrev] = useState(null);
  const [details, setDetails] = useState([]);
  //lab page
  const [selectedRequestIdResult, setSelectedRequestIdResult] = useState(null);
  const [examsListResult, setExamsListResult] = useState([]);

  const [openWindow, setOpenWindow] = useState(1);
  useEffect(() => {
    const storedOpenWindow = localStorage.getItem('openWindow');
    if (storedOpenWindow) {
      setOpenWindow(JSON.parse(storedOpenWindow));
      localStorage.removeItem('openWindow');
    }
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  const [toggleFilter, setToggleFilter] = useState(false);
  //patient id
  const [patientId, setPatientId] = useState(null);
  const [appointmentId, setAppointmentId] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  //popup states
  const [openPopUp, setOpenPopUp] = useState(false);

  //drop down menu states
  const [content, setContent] = useState([]);
  const [selectedForDoctorRole, setSelectedForDoctorRole] = useState([]);
  const [selectedForReceptionistRole, setSelectedForReceptionistRole] =
    useState([]);
  const [tempSelected, setTempSelected] = useState([]); //for multiple selection in drop down menu
  const [search, setSearch] = useState('');
  const [prevSearchQuery, setPrevSearchQuery] = useState('');

  //add new request
  const [requestType, setRequestType] = useState(null);

  //note for prescription
  const [note, setNote] = useState(null);

  //prescription items
  const [prescriptionItems, setPrescriptionItems] = useState([]);

  //reset details when open window change
  useEffect(() => {
    setDetails([]);
    setSelectedRequestIdResult(null);
    setExamsListResult([]);
    setSelectedForDoctorRole([]);
    setTempSelected([]);
    setSearch('');
    setContent([]);
    setRequestType(null);
    setPages(1);
    setNote(null);
    setPrescriptionItems([]);
  }, [openWindow]);
  //get patient id from appointment page
  useEffect(() => {
    if (state) {
      setPatientId(state.patientId);
      setAppointmentId(state.appointmentId);
    }
  }, []);
  const [isPatientValid, setIsPatientValid] = useState(null);
  //patient id Validation
  useEffect(() => {
    let timeoutId = null;
    if (patientId !== null && patientId !== undefined) {
      if (patientId !== '') {
        timeoutId = setTimeout(async () => {
          setIsLoading(true);
          const response = await fetch(
            apiUrl +
              `appointments/Booked-Appointments/?patient=${patientId}&doctor=&slot=&date=&type=&status=&created_at=`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `JWT ${localStorage.getItem('token')}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setAppointmentDetails(() => {
              const appointment = data.results.filter(
                info => info.id === appointmentId
              );
              return {
                doctor: appointment[0].doctor.id,
                patient: appointment[0].patient.id,
                date: appointment[0].date,
                id: appointment[0].id,
              };
            });
            setIsPatientValid(data.results && data.results.length > 0);
          } else {
            setIsPatientValid(false);
          }
          setIsLoading(false);
        }, 500);
      } else {
        setIsPatientValid(false);
      }
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [patientId]);

  const fetchMainDataHandler = async () => {
    const response = await Promise.all([
      openWindow === 1 &&
        openPopUp === false &&
        fetch(
          userctx.role === 'doctor'
            ? apiUrl +
                `lab-radiology/view-test-resutls/?patient=${patientId}&search=${search}${
                  search === '' ? `&page=${pages}` : ''
                }`
            : selectedRequestIdResult === null
            ? apiUrl +
              `lab-radiology/exam-request/?status=&patient=${patientId}&doctor=&type_of_request=Laboratory&appointment=${appointmentId}&search=${search}${
                search === '' ? `&page=${pages}` : ''
              }`
            : apiUrl + `lab-radiology/exam-request/${selectedRequestIdResult}/`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          }
        ),
      openWindow === 2 &&
        openPopUp === false &&
        fetch(
          userctx.role === 'doctor'
            ? apiUrl +
                `lab-radiology/view-radiology-request/?patient=${patientId}&search=${search}${
                  search === '' ? `&page=${pages}` : ''
                }`
            : selectedRequestIdResult === null
            ? apiUrl +
              `lab-radiology/exam-request/?status=&patient=${patientId}&doctor=&type_of_request=Radiology&appointment=${appointmentId}&search=${search}${
                search === '' ? `&page=${pages}` : ''
              }`
            : apiUrl + `lab-radiology/exam-request/${selectedRequestIdResult}/`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          }
        ),
      openWindow === 3 &&
        openPopUp === false &&
        fetch(apiUrl + `records/all-records/${patientId}/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('token')}`,
          },
        }),
      openWindow === 4 &&
        openPopUp === false &&
        fetch(
          userctx.role === 'doctor'
            ? apiUrl +
                `pharmacy/doctor-prescription/?patient=${patientId}&search=${search}${
                  search === '' ? `&page=${pages}` : ''
                }`
            : selectedRequestIdResult === null
            ? apiUrl +
              `pharmacy/receptionist-prescription/?created_at=&updated_at=&doctor=&patient=&appointment=${appointmentId}&date=&notes=&dispensed_by=&dispensed_status=&search=${search}${
                search === '' ? `&page=${pages}` : ''
              }`
            : apiUrl +
              `pharmacy/receptionist-prescription/${selectedRequestIdResult}/`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          }
        ),
    ]);

    if (openWindow === 1 && openPopUp === false) {
      const data = await response[0].json();
      if (selectedRequestIdResult === null) {
        let temp = data.results.map(info => {
          return {
            id: <span>{info.id}</span>,
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
            button: [
              {
                title: 'View Request Details',
                setStates: () => {
                  setSelectedRequestIdResult(info.id);
                },
              },
            ],
          };
        });
        if (prev || search !== '') {
          setDetails(temp);
          setPrev(null);
        } else {
          if (prevSearchQuery === '') {
            setDetails(prev => [...prev, ...temp]);
          } else {
            setDetails(temp);
          }
        }
        setPrevSearchQuery(search);
      }
      if (selectedRequestIdResult !== null) {
        if (userctx.role === 'doctor') {
          setExamsListResult(
            data.Lab_request.map(info => {
              return {
                id: <span>{info.exam.id}</span>,
                name: <span>{info.exam.name}</span>,
                code: <span>{info.exam.code}</span>,
                price: <span>{info.exam.price}</span>,
                date: <span>{info.dateTime.toString().substring(0, 10)}</span>,
                time: <span>{info.dateTime.toString().substring(11, 16)}</span>,
                comment: <span>{info.comment}</span>,
                button: {
                  title: 'Download Result',
                  setStates: () => {
                    /* //todo: add download function */
                    return info.pdf_result;
                  },
                },
              };
            })
          );
        } else {
          console.log(data);
          setExamsListResult(
            data.exams.map(info => {
              return {
                id: info.id,
                card: {
                  name: (
                    <h4>
                      name : <span>{info.name}</span>
                    </h4>
                  ),
                  code: (
                    <h4>
                      code : <span>{info.code}</span>
                    </h4>
                  ),
                  price: (
                    <h4>
                      price : <span>{info.price}</span>
                    </h4>
                  ),
                },
              };
            })
          );
        }
        setPrev(selectedRequestIdResult);
      }
    }
    if (openWindow === 2 && openPopUp === false) {
      const data = await response[1].json();
      if (selectedRequestIdResult === null) {
        let temp = data.results.map(info => {
          return {
            id: <span>{info.id}</span>,
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
            button: [
              {
                title: 'View Request Details',
                setStates: () => {
                  setSelectedRequestIdResult(info.id);
                },
              },
            ],
          };
        });
        if (prev || search !== '') {
          setDetails(temp);
          setPrev(null);
        } else {
          if (prevSearchQuery === '') {
            setDetails(prev => [...prev, ...temp]);
          } else {
            setDetails(temp);
          }
        }
        setPrevSearchQuery(search);
      }
      if (selectedRequestIdResult !== null) {
        if (userctx.role === 'doctor') {
          setExamsListResult(
            data.radiolgy_request.map(info => {
              return {
                id: <span>{info.exam.id}</span>,
                name: <span>{info.exam.name}</span>,
                code: <span>{info.exam.code}</span>,
                price: <span>{info.exam.price}</span>,
                image: info.radiology_result.map(info => {
                  return {
                    comment: <span>{info.comment}</span>,
                    button: {
                      title: 'View Image',
                      setStates: () => {
                        return info.image;
                      },
                    },
                  };
                }),
                button: {
                  title: 'View Report',
                  setStates: () => {
                    return info.report_file;
                  },
                },
              };
            })
          );
        } else {
          setExamsListResult(
            data.exams.map(info => {
              return {
                id: info.id,
                card: {
                  name: (
                    <h4>
                      name : <span>{info.name}</span>
                    </h4>
                  ),
                  code: (
                    <h4>
                      code : <span>{info.code}</span>
                    </h4>
                  ),
                  price: (
                    <h4>
                      price : <span>{info.price}</span>
                    </h4>
                  ),
                },
              };
            })
          );
        }
        setPrev(selectedRequestIdResult);
      }
    }
    if (openWindow === 3 && openPopUp === false) {
      const data = await response[2].json();
      setDetails([
        {
          cards: {
            title: 'Medical Record',
            diagnosis: <span>{data.medical_record.diagnosis}</span>,
            allergies: <span>{data.medical_record.allergies}</span>,
            family_history: <span>{data.medical_record.family_history}</span>,
          },
        },
        {
          cards: {
            title: 'Vitals',
            body: data.vitals.map(info => {
              return {
                id: <span>{info.id}</span>,
                date: <span>{info.date}</span>,
                time: <span>{info.time}</span>,
                height: <span>{info.height}</span>,
                weight: <span>{info.weight}</span>,
                blood_pressure: <span>{info.blood_pressure}</span>,
                heart_rate: <span>{info.heart_rate}</span>,
                temperature: <span>{info.temperature}</span>,
              };
            }),
          },
        },
        {
          cards: {
            title: 'Visits',
            body: data.visits.map(info => {
              return {
                id: <span>{info.id}</span>,
                doctor: <span>{info.doctor}</span>,
                room_number: <span>{info.room_number}</span>,
                bed_number: <span>{info.bed_number}</span>,
                admission_date: <span>{info.admission_date}</span>,
                discharge_date: <span>{info.discharge_date}</span>,
                diagnosis: <span>{info.diagnosis}</span>,
                notes: <span>{info.notes}</span>,
              };
            }),
          },
        },
        {
          cards: {
            title: 'Surgeries',
            body: data.surgeries.map(info => {
              return {
                doctor: <span>{info.doctor}</span>,
                surgery_type: <span>{info.surgery_type}</span>,
                date: <span>{info.date}</span>,
                time: <span>{info.time}</span>,
                button: {
                  title: 'View Documentation',
                  setStates: () => {
                    return info.documentation;
                  },
                },
              };
            }),
          },
        },
      ]);
    }
    if (openWindow === 4 && openPopUp === false) {
      const data = await response[3].json();
      if (selectedRequestIdResult === null) {
        let temp = data.results.map(info => {
          return {
            id: <span>{info.id}</span>,
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
            button: [
              {
                title: 'View Prescription Details',
                setStates: () => {
                  setSelectedRequestIdResult(info.id);
                },
              },
            ],
          };
        });
        if (prev || search !== '') {
          setDetails(temp);
          setPrev(null);
        } else {
          if (prevSearchQuery === '') {
            setDetails(prev => [...prev, ...temp]);
          } else {
            setDetails(temp);
          }
        }
        setPrevSearchQuery(search);
      }
      if (selectedRequestIdResult !== null) {
        if (userctx.role === 'doctor') {
          setExamsListResult(
            data.prescription.map(info => {
              return {
                id: <span>{info.id}</span>,
                drug: <span>{info.drug}</span>,
                amount: <span>{info.amount}</span>,
                dose: <span>{info.dose}</span>,
                duration: <span>{info.duration}</span>,
              };
            })
          );
        } else {
          setExamsListResult(
            data.prescription.map(info => {
              return {
                id: info.id,
                card: {
                  name: (
                    <h4>
                      name : <span>{info.drug.name}</span>
                    </h4>
                  ),
                  price: (
                    <h4>
                      price : <span>{info.drug.price}</span>
                    </h4>
                  ),
                },
              };
            })
          );
          setPrescriptionItems({
            id: data.id,
            dispensed_status: data.dispensed_status,
            doctor: data.doctor.id,
            patient: data.patient.id,
            date: data.date,
            notes: data.notes,
            prescription: data.prescription.map(p => {
              return {
                id: p.id,
                drug: p.drug.id,
                amount: p.amount,
                dose: p.dose,
                duration: p.duration,
                dispensed: p.dispensed,
                prescription: p.prescription,
              };
            }),
          });
          setPrev(selectedRequestIdResult);
        }
      }
    }
  };
  useEffect(() => {
    if (isPatientValid) fetchMainDataHandler();
  }, [
    isPatientValid,
    openWindow,
    patientId,
    selectedRequestIdResult,
    pages,
    search,
  ]);

  // get request data for drug list and exam list
  useEffect(() => {
    async function fetchHandler() {
      const response = await Promise.all([
        (requestType === 'Laboratory' || requestType === 'Radiology') &&
          fetch(
            apiUrl +
              `lab-radiology/exams-list/?type=${requestType}&search=${search}${
                search === '' ? `&page=${popUpPages}` : ''
              }`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `JWT ${localStorage.getItem('token')}`,
              },
            }
          ),
        requestType === 'prescription' &&
          fetch(
            apiUrl +
              `pharmacy/drug/?search=${search}${
                search === '' ? `&page=${popUpPages}` : ''
              }`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `JWT ${localStorage.getItem('token')}`,
              },
            }
          ),
      ]);
      if (requestType === 'Laboratory' || requestType === 'Radiology') {
        const data = await response[0].json();
        let temp = data.results.map(info => {
          return {
            id: info.id,
            card: {
              name: (
                <h4>
                  name : <span>{info.name}</span>
                </h4>
              ),
              code: (
                <h4>
                  code : <span>{info.code}</span>
                </h4>
              ),
              price: (
                <h4>
                  price : <span>{info.price}</span>
                </h4>
              ),
            },
          };
        });
        if (prev || search !== '') setContent(temp);
        else {
          if (prevSearchQuery === '') setContent(prev => [...prev, ...temp]);
          else setContent(temp);
        }
        setPrevSearchQuery(search);
      } else if (requestType === 'prescription') {
        const data = await response[1].json();
        let temp = data.results.map(info => {
          return {
            id: info.id,
            card: {
              name: (
                <h4>
                  name : <span>{info.name}</span>
                </h4>
              ),
              form: (
                <h4>
                  form : <span>{info.form}</span>
                </h4>
              ),
            },
          };
        });
        if (prev || search !== '') setContent(temp);
        else {
          if (prevSearchQuery === '') setContent(prev => [...prev, ...temp]);
          else setContent(temp);
        }
        setPrevSearchQuery(search);
      }
      fetchMainDataHandler();
    }

    if (requestType !== null) fetchHandler();
  }, [requestType, popUpPages, search]);

  //doctor role
  useEffect(() => {
    async function fetchHandler() {
      try {
        if (requestType === 'Laboratory' || requestType === 'Radiology') {
          const id = toast.loading('Please wait...', {
            position: 'bottom-right',
          });
          const response = await fetch(apiUrl + 'lab-radiology/exam-request/', {
            method: 'POST',
            body: JSON.stringify({
              type_of_request: requestType,
              status: 'Requested',
              patient: patientId,
              appointment: appointmentDetails.id,
              doctor: appointmentDetails.doctor,
              exams: selectedForDoctorRole,
            }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          });
          if (response.ok) {
            toast.update(id, {
              render: 'Request sent successfully',
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
              render: 'Failed to send exam request',
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
        } else if (requestType === 'prescription') {
          const id = toast.loading('Please wait...', {
            position: 'bottom-right',
          });
          const response = await fetch(
            apiUrl + 'pharmacy/doctor-prescription/',
            {
              method: 'POST',
              body: JSON.stringify({
                patient: patientId,
                appointment: appointmentDetails.id,
                notes: note,
              }),
              headers: {
                'Content-Type': 'application/json',
                Authorization: `JWT ${localStorage.getItem('token')}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            for (let i = 0; i < selectedForDoctorRole.length; i++) {
              const response2 = await fetch(
                apiUrl + 'pharmacy/prescriptionitems/',
                {
                  method: 'POST',
                  body: JSON.stringify({
                    prescription: data.id,
                    drug: selectedForDoctorRole[i].drug,
                    amount: selectedForDoctorRole[i].amount,
                    dose: selectedForDoctorRole[i].dose,
                    duration: selectedForDoctorRole[i].duration,
                  }),
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `JWT ${localStorage.getItem('token')}`,
                  },
                }
              );
              if (response2.ok) {
                toast.update(id, {
                  render: 'Prescription created successfully',
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
                  render: 'Failed to create prescription',
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
            }
          } else {
            toast.update(id, {
              render: 'Failed to create prescription',
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
    if (selectedForDoctorRole.length > 0) fetchHandler();
  }, [selectedForDoctorRole]);

  //recepionist role
  useEffect(() => {
    async function fetchHandler() {
      if (selectedForReceptionistRole.length > 0) {
        try {
          if (openWindow === 1 || openWindow === 2) {
            const id = toast.loading('Please wait...', {
              position: 'bottom-right',
            });
            const response1 = await fetch(
              apiUrl + `lab-radiology/exam-request/${selectedRequestIdResult}/`,
              {
                method: 'PATCH',
                body: JSON.stringify({
                  exams: selectedForReceptionistRole,
                }),
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `JWT ${localStorage.getItem('token')}`,
                },
              }
            );
            const response2 = await fetch(
              apiUrl + `lab-radiology/exam-request/${selectedRequestIdResult}/`,
              {
                method: 'PATCH',
                body: JSON.stringify({
                  status: 'Pending',
                }),
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `JWT ${localStorage.getItem('token')}`,
                },
              }
            );
            if (response1.ok && response2.ok) {
              toast.update(id, {
                render: 'Request sent successfully',
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
                render: 'Failed to send request',
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
          } else if (openWindow === 4) {
            if (selectedForReceptionistRole.length >= 1) {
              const updatedPrescription = {
                ...prescriptionItems,
                prescription: prescriptionItems.prescription.map(p => {
                  if (selectedForReceptionistRole.includes(p.id)) {
                    return { ...p, dispensed: true };
                  } else {
                    return p;
                  }
                }),
              };
              const id = toast.loading('Please wait...', {
                position: 'bottom-right',
              });
              const response1 = await fetch(
                apiUrl +
                  `pharmacy/receptionist-prescription/${selectedRequestIdResult}/`,
                {
                  method: 'PUT',
                  body: JSON.stringify(updatedPrescription),
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `JWT ${localStorage.getItem('token')}`,
                  },
                }
              );
              const updatedPrescription2 = {
                ...prescriptionItems,
                dispensed_status: 'send_to_pharmacy',
                prescription: prescriptionItems.prescription.map(p => {
                  if (selectedForReceptionistRole.includes(p.id)) {
                    return { ...p, dispensed: true };
                  } else {
                    return p;
                  }
                }),
              };
              const response2 = await fetch(
                apiUrl +
                  `pharmacy/receptionist-prescription/${selectedRequestIdResult}/`,
                {
                  method: 'PUT',
                  body: JSON.stringify(updatedPrescription2),
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `JWT ${localStorage.getItem('token')}`,
                  },
                }
              );
              if (response1.ok && response2.ok) {
                toast.update(id, {
                  render: 'Request sent successfully',
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
                  render: 'Failed to send request',
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
            }
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
      setSelectedForReceptionistRole(null);
      setSelectedRequestIdResult(null);
      setTempSelected([]);
      fetchMainDataHandler();
    }
    fetchHandler();
  }, [selectedForReceptionistRole]);
  useEffect(() => {
    setPopUpPages(1);
  }, [openPopUp, requestType, search]);

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
    userctx.role !== 'receptionist' && {
      id: 3,
      icon: (
        <FontAwesomeIcon
          icon={faNotesMedical}
          size='xl'
          style={{ color: openWindow === 3 && '#49A96E' }}
        />
      ),
    },
    {
      id: 4,
      icon: (
        <FontAwesomeIcon
          icon={faPills}
          size='xl'
          style={{ color: openWindow === 4 && '#49A96E' }}
        />
      ),
    },
  ];
  return (
    <div className={bodyClasses.container}>
      <SideNavBar sideNav={sideNav} setOpenWindow={setOpenWindow} />
      {!isPatientValid ? (
        patientId === null ? (
          <div className={classes.patientIdContainer}>
            <h2>No Patient Selected</h2>
            <span style={{ color: '#49a96e', fontWeight: '700' }}>
              Only Open With{' '}
              {userctx.role === 'doctor'
                ? 'View Medical Record Button'
                : 'View Requests Button'}
            </span>
            <input
              className={classes.patientIdInput}
              placeholder={'Enter Patient Id'}
              value={patientId}
              disabled
              // onChange={e => setPatientId(e.target.value)}
            />
            {isLoading ? (
              <span>Loading</span>
            ) : (
              isPatientValid === false && (
                <>
                  <span style={{ color: 'red' }}>Invalid patient ID</span>
                  <span style={{ color: '#49a96e', fontWeight: '700' }}>
                    You Can Get It From Appointment Page
                  </span>
                </>
              )
            )}
          </div>
        ) : (
          <div className={classes.patientIdContainer}>
            <Loader cl={'#49a96e'} />
          </div>
        )
      ) : (
        <DetailsBody
          toggleFilter={toggleFilter}
          setToggleFilter={setToggleFilter}
          {...(openWindow !== 3 && { searchstate: setSearch })}
          details={details}
          thereIsCard={openWindow === 3 ? true : false}
          title={
            openWindow === 1
              ? 'Lab Results'
              : openWindow === 2
              ? 'Radiology Results'
              : openWindow === 3
              ? 'Medical Record'
              : 'Prescriptions'
          }
          additionalFunction={
            openWindow !== 3 && userctx.role !== 'receptionist'
              ? {
                  title:
                    openWindow === 1
                      ? '+ Add New Lab Request'
                      : openWindow === 2
                      ? '+ Add New Radiology Request'
                      : '+ Add New Prescription',
                  setStates: () => {
                    setOpenPopUp(true);
                    openWindow === 1
                      ? setRequestType('Laboratory')
                      : openWindow === 2
                      ? setRequestType('Radiology')
                      : setRequestType('prescription');
                  },
                }
              : null
          }
          pagescroll={() => {
            setPages(prevPages => prevPages + 1);
          }}
        />
      )}
      {selectedRequestIdResult !== null &&
        (userctx.role === 'doctor' ? (
          <PopUp
            popUp={selectedRequestIdResult}
            setPopUp={setSelectedRequestIdResult}
            Cards={examsListResult}
            title={openWindow === 4 ? 'Drug' : 'Exam'}
          />
        ) : (
          <>
            <PopUp
              selection={examsListResult}
              popUp={selectedRequestIdResult}
              setPopUp={setSelectedRequestIdResult}
              selectstate={setTempSelected}
              searchstate={setSearch}
              multiple={true}
              selected={tempSelected}
              buttonFunction={() => {
                setSelectedForReceptionistRole(tempSelected);
              }}
              buttonText={'Confirm'}
              pagescroll={() => {
                setPopUpPages(prevPages => prevPages + 1);
              }}
            />
          </>
        ))}
      {openPopUp &&
        content !== null &&
        (requestType === 'prescription' ? (
          <>
            <PopUp
              popUp={openPopUp}
              setPopUp={setOpenPopUp}
              prescription={content}
              isPrescription={true}
              selected={tempSelected}
              selectstate={setTempSelected}
              searchstate={setSearch}
              noteSet={setNote}
              buttonFunction={() => {
                setSelectedForDoctorRole(tempSelected);
                setOpenPopUp(false);
              }}
              buttonText={'Confirm'}
              pagescroll={() => {
                setPopUpPages(prevPages => prevPages + 1);
              }}
            />
          </>
        ) : (
          <PopUp
            selection={content}
            popUp={openPopUp}
            setPopUp={setOpenPopUp}
            selectstate={setTempSelected}
            searchstate={setSearch}
            multiple={true}
            selected={tempSelected}
            buttonFunction={() => {
              setSelectedForDoctorRole(tempSelected);
              setOpenPopUp(false);
              setTempSelected([]);
              setPopUpPages(1);
              setContent([]);
            }}
            buttonText={'Confirm'}
            pagescroll={() => {
              setPopUpPages(prevPages => prevPages + 1);
            }}
          />
        ))}
    </div>
  );
}
export default MedicalRecord;
