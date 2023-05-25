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
function MedicalRecord() {
  const userctx = useContext(UserContext);
  const { state } = useLocation();

  const [details, setDetails] = useState([]);

  //lab page
  const [selectedRequestIdResult, setSelectedRequestIdResult] = useState(null);
  const [examsListResult, setExamsListResult] = useState([]);

  const [openWindow, setOpenWindow] = useState(1);
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
        fetch(
          userctx.role === 'doctor'
            ? apiUrl + `lab-radiology/view-test-resutls/?patient=${patientId}`
            : apiUrl +
                `lab-radiology/exam-request/?status=&patient=${patientId}&doctor=&type_of_request=Laboratory&appointment=${appointmentId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          }
        ),
      openWindow === 2 &&
        fetch(
          userctx.role === 'doctor'
            ? apiUrl +
                `lab-radiology/view-radiology-request/?patient=${patientId}`
            : apiUrl +
                `lab-radiology/exam-request/?status=&patient=${patientId}&doctor=&type_of_request=Radiology&appointment=${appointmentId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          }
        ),
      openWindow === 3 &&
        fetch(apiUrl + `records/all-records/${patientId}/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('token')}`,
          },
        }),
      openWindow === 4 &&
        fetch(
          userctx.role === 'doctor'
            ? apiUrl + `pharmacy/doctor-prescription/?patient=${patientId}`
            : apiUrl +
                `pharmacy/receptionist-prescription/?created_at=&updated_at=&doctor=&patient=&appointment=${appointmentId}&date=&notes=&dispensed_by=&dispensed_status=`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          }
        ),
    ]);

    if (openWindow === 1) {
      const data = await response[0].json();
      setDetails(
        data.results.map(info => {
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
        })
      );
      if (selectedRequestIdResult !== null) {
        if (userctx.role === 'doctor') {
          setExamsListResult(
            data.results
              .filter(info => info.id === selectedRequestIdResult)[0]
              .Lab_request.map(info => {
                return {
                  id: <span>{info.exam.id}</span>,
                  name: <span>{info.exam.name}</span>,
                  code: <span>{info.exam.code}</span>,
                  price: <span>{info.exam.price}</span>,
                  date: (
                    <span>{info.dateTime.toString().substring(0, 10)}</span>
                  ),
                  time: (
                    <span>{info.dateTime.toString().substring(11, 16)}</span>
                  ),
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
          setExamsListResult(
            data.results
              .filter(info => info.id === selectedRequestIdResult)[0]
              .exams.map(info => {
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
      }
    }
    if (openWindow === 2) {
      const data = await response[1].json();
      setDetails(
        data.results.map(info => {
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
        })
      );
      if (selectedRequestIdResult !== null) {
        if (userctx.role === 'doctor') {
          setExamsListResult(
            data.results
              .filter(info => info.id === selectedRequestIdResult)[0]
              .radiolgy_request.map(info => {
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
            data.results
              .filter(info => info.id === selectedRequestIdResult)[0]
              .exams.map(info => {
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
      }
    }
    if (openWindow === 3) {
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
                  setStates: info.documentation,
                },
              };
            }),
          },
        },
      ]);
      console.log(data);
    }
    if (openWindow === 4) {
      const data = await response[3].json();
      setDetails(
        data.results.map(info => {
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
        })
      );
      if (selectedRequestIdResult !== null) {
        if (userctx.role === 'doctor') {
          setExamsListResult(
            data.results
              .filter(info => info.id === selectedRequestIdResult)[0]
              .prescription.map(info => {
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
            data.results
              .filter(info => info.id === selectedRequestIdResult)[0]
              .prescription.map(info => {
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
            id: data.results.filter(
              info => info.id === selectedRequestIdResult
            )[0].id,
            dispensed_status: data.results.filter(
              info => info.id === selectedRequestIdResult
            )[0].dispensed_status,
            doctor: data.results.filter(
              info => info.id === selectedRequestIdResult
            )[0].doctor.id,
            patient: data.results.filter(
              info => info.id === selectedRequestIdResult
            )[0].patient.id,
            date: data.results.filter(
              info => info.id === selectedRequestIdResult
            )[0].date,
            notes: data.results.filter(
              info => info.id === selectedRequestIdResult
            )[0].notes,
            prescription: data.results
              .filter(info => info.id === selectedRequestIdResult)[0]
              .prescription.map(p => {
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
        }
      }
    }
  };
  useEffect(() => {
    if (isPatientValid) fetchMainDataHandler();
  }, [isPatientValid, openWindow, patientId, selectedRequestIdResult]);

  // get request data
  useEffect(() => {
    async function fetchHandler() {
      const response = await Promise.all([
        (requestType === 'Laboratory' || requestType === 'Radiology') &&
          fetch(apiUrl + `lab-radiology/exams-list/?type=${requestType}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          }),
        requestType === 'prescription' &&
          fetch(apiUrl + `pharmacy/drug/`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          }),
      ]);
      if (requestType === 'Laboratory' || requestType === 'Radiology') {
        const data = await response[0].json();
        setContent(
          data.results.map(info => {
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
      } else if (requestType === 'prescription') {
        const data = await response[1].json();
        setContent(
          data.results.map(info => {
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
          })
        );
      }
      fetchMainDataHandler();
    }

    if (requestType !== null) fetchHandler();
  }, [requestType]);

  useEffect(() => {
    async function fetchHandler() {
      if (requestType === 'Laboratory' || requestType === 'Radiology') {
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
        console.log(
          patientId,
          ' ',
          appointmentDetails.id,
          ' ',
          appointmentDetails.doctor,
          ' ',
          selectedForDoctorRole
        );
        console.log(await response.json());
      } else if (requestType === 'prescription') {
        const response = await fetch(apiUrl + 'pharmacy/doctor-prescription/', {
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
        });

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
          const data2 = await response2.json();
          console.log('second response : ', data2);
        }
        console.log('first response : ', data);
      }
      fetchMainDataHandler();
    }
    if (selectedForDoctorRole.length > 0) fetchHandler();
  }, [selectedForDoctorRole]);

  useEffect(() => {
    async function fetchHandler() {
      if (selectedForReceptionistRole.length > 0) {
        if (openWindow === 1 || openWindow === 2) {
          const response = await fetch(
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
          console.log('first res : ', await response.json());
          console.log('sec res : ', await response2.json());
        } else if (openWindow === 4) {
          console.log(selectedForReceptionistRole);
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
            console.log(updatedPrescription);
            const response = await fetch(
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
            console.log('first res : ', await response.json());
            console.log('sec res : ', await response2.json());
          }

          // const response = await fetch(
          //   apiUrl +
          //     `pharmacy/receptionist-prescription/${selectedRequestIdResult}/`,
          //   {
          //     method: 'PATCH',
          //     body: JSON.stringify({
          //       dispensed_status: 'send_to_pharmacy',
          //       prescription: prescriptionItems,
          //     }),
          //     headers: {
          //       'Content-Type': 'application/json',
          //     },
          //   }
          // );
        }
      }
      setSelectedForReceptionistRole(null);
      setSelectedRequestIdResult(null);
      setTempSelected([]);
      fetchMainDataHandler();
    }
    fetchHandler();
  }, [selectedForReceptionistRole]);

  // useEffect(() => {
  //   console.log(prescriptionItems);
  // }, [prescriptionItems]);
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
          <h2>Loading</h2>
        )
      ) : (
        <DetailsBody
          toggleFilter={toggleFilter}
          setToggleFilter={setToggleFilter}
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
            />
            {console.log(selectedForReceptionistRole)}
          </>
        ))}
      {openPopUp &&
        content !== null &&
        (requestType === 'prescription' ? (
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
          />
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
            }}
            buttonText={'Confirm'}
          />
        ))}
    </div>
  );
}
export default MedicalRecord;
