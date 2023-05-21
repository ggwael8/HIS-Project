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
import { useState, useEffect } from 'react';
import DetailsBody from '../../component/DetailsBody/DetailsBody';
import { apiUrl } from '../../utils/api';
import { useLocation } from 'react-router-dom';
import PopUp from '../../component/PopUp/PopUp';

function MedicalRecord() {
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
  //reset details when open window change
  useEffect(() => {
    setDetails([]);
    setSelectedRequestIdResult(null);
  }, [openWindow]);
  //get patient id from appointment page
  useEffect(() => {
    if (state) {
      setPatientId(state);
      console.log(state);
    }
  }, []);
  const [isPatientValid, setIsPatientValid] = useState(null);
  //patient id Validation
  useEffect(() => {
    let timeoutId = null;
    console.log(patientId);
    if (patientId !== null && patientId !== undefined) {
      if (patientId !== '') {
        timeoutId = setTimeout(async () => {
          setIsLoading(true);
          const response = await fetch(
            apiUrl +
              `appointments/Booked-Appointments/?patient=${patientId}&doctor=&slot=&date=&type=&status=&created_at=`
          );
          if (response.ok) {
            const data = await response.json();
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

  useEffect(() => {
    const fetchHandler = async () => {
      const response = await Promise.all([
        openWindow === 1 &&
          fetch(
            apiUrl + `lab-radiology/view-test-resutls/?patient=${patientId}`
          ),
        openWindow === 2 &&
          fetch(
            apiUrl +
              `lab-radiology/view-radiology-request/?patient=${patientId}`
          ),
        openWindow === 3 && fetch(apiUrl + `records/all-records/${patientId}/`),
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
                      console.log('download ' + info.pdf_result);
                    },
                  },
                };
              })
          );
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
                          console.log(info.image);
                        },
                      },
                    };
                  }),
                  button: {
                    title: 'View Report',
                    setStates: () => {
                      console.log(info.report_file);
                    },
                  },
                };
              })
          );
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
                  documentation: <span>{info.documentation}</span>,
                };
              }),
            },
          },
        ]);
        console.log(data);
      }
    };
    if (isPatientValid) fetchHandler();
  }, [isPatientValid, openWindow, patientId, selectedRequestIdResult]);

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
    {
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
        <div className={classes.patientIdContainer}>
          <h2>No Patient Selected</h2>
          <input
            className={classes.patientIdInput}
            placeholder={'Enter Patient Id'}
            value={patientId}
            onChange={e => setPatientId(e.target.value)}
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
        />
      )}
      {console.log(selectedRequestIdResult)}
      {selectedRequestIdResult !== null && (
        <PopUp
          popUp={selectedRequestIdResult}
          setPopUp={setSelectedRequestIdResult}
          Cards={examsListResult}
          title={'Exam'}
        />
      )}
    </div>
  );
}
export default MedicalRecord;
