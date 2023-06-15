import classes from './MedicalSecretary.module.css';
import bodyClasses from '../Body.module.css';
import SideNavBar from '../../component/SideNavBar/SideNavBar';
import { useState, useEffect, useRef } from 'react';
import DetailsBody from '../../component/DetailsBody/DetailsBody';
import { apiUrl } from '../../utils/api';
import PopUp from '../../component/PopUp/PopUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeartPulse,
  faUserDoctor,
  faNotesMedical,
  faUserCheck,
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function MedicalSecretary() {
  const isMountedRef = useRef(false);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [prevSearchQuery, setPrevSearchQuery] = useState('');
  const [openWindow, setOpenWindow] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [toggleFilter, setToggleFilter] = useState(false);
  const [details, setDetails] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [popUp, setPopUp] = useState();
  const [tempSelected, setTempSelected] = useState([]);
  const [reportFile, setReportFile] = useState(null);
  const [data, setData] = useState(null);
  async function fetchMainDataHandler() {
    setIsLoading(true);
    const response = await Promise.all([
      openWindow === 1 &&
        fetch(
          apiUrl +
            `records/surgery/?&search=${search}${
              search === '' ? `&page=${pages}` : ''
            }`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          }
        ),
      openWindow === 2 &&
        fetch(
          apiUrl +
            `records/vitals/?&search=${search}${
              search === '' ? `&page=${pages}` : ''
            }`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
          }
        ),
      openWindow === 3 &&
        fetch(
          apiUrl +
            `records/medical-record/?&search=${search}${
              search === '' ? `&page=${pages}` : ''
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
            `records/visits/?&search=${search}${
              search === '' ? `&page=${pages}` : ''
            }`,
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
      let temp = data.results.map(info => {
        return {
          patient: (
            <span>
              {info.patient.first_name + ' ' + info.patient.last_name}
            </span>
          ),
          doctor: (
            <span>{info.doctor.first_name + ' ' + info.doctor.last_name}</span>
          ),
          surgery_type: <span>{info.surgery_type}</span>,
          date: <span>{info.date}</span>,
          time: <span>{info.time}</span>,
          button: [
            {
              type: 'pdf',
              title: 'View Surgery',
              setStates: () => {
                return info.documentation;
              },
            },
          ],
        };
      });
      if (search === '') {
        if (prevSearchQuery === '') {
          setDetails(prevPages => [...prevPages, ...temp]);
        } else {
          if (pages === 1) setDetails(temp);
          else {
            setPages(1);
            setDetails([]);
          }
        }
      } else {
        setDetails(temp);
      }
      setPrevSearchQuery(search);
      setRawData({
        patient: null,
        doctor: null,
        surgery_type: null,
        date: null,
        time: null,
        documentation: null,
      });
    } else if (openWindow === 2) {
      const data = await response[1].json();
      let temp = data.results.map(info => {
        return {
          patient: (
            <span>
              {info.patient.first_name + ' ' + info.patient.last_name}
            </span>
          ),
          date: <span>{info.date}</span>,
          time: <span>{info.time}</span>,
          height: <span>{info.height}</span>,
          weight: <span>{info.weight}</span>,
          temperature: <span>{info.temperature}</span>,
          blood_pressure: <span>{info.blood_pressure}</span>,
          heart_rate: <span>{info.heart_rate}</span>,
        };
      });
      if (search === '') {
        if (prevSearchQuery === '') {
          setDetails(prevPages => [...prevPages, ...temp]);
        } else {
          if (pages === 1) setDetails(temp);
          else {
            setPages(1);
            setDetails([]);
          }
        }
      } else {
        setDetails(temp);
      }
      setPrevSearchQuery(search);
      setRawData({
        patient: null,
        date: null,
        time: null,
        height: null,
        weight: null,
        temperature: null,
        blood_pressure: null,
        heart_rate: null,
      });
    } else if (openWindow === 3) {
      const data = await response[2].json();
      let temp = data.results.map(info => {
        return {
          patient: (
            <span>
              {info.patient.first_name + ' ' + info.patient.last_name}
            </span>
          ),
          diagnosis: <span>{info.diagnosis}</span>,
          allergies: <span>{info.allergies}</span>,
          family_history: <span>{info.family_history}</span>,
        };
      });
      if (search === '') {
        if (prevSearchQuery === '') {
          setDetails(prevPages => [...prevPages, ...temp]);
        } else {
          if (pages === 1) setDetails(temp);
          else {
            setPages(1);
            setDetails([]);
          }
        }
      } else {
        setDetails(temp);
      }
      setPrevSearchQuery(search);
      setRawData({
        patient: null,
        diagnosis: null,
        allergies: null,
        family_history: null,
      });
    } else if (openWindow === 4) {
      const data = await response[3].json();
      let temp = data.results.map(info => {
        return {
          patient: (
            <span>
              {info.patient.first_name + ' ' + info.patient.last_name}
            </span>
          ),
          doctor: (
            <span>{info.doctor.first_name + ' ' + info.doctor.last_name}</span>
          ),
          diagnosis: <span>{info.diagnosis}</span>,
          admission_date: <span>{info.admission_date}</span>,
          discharge_date: <span>{info.discharge_date}</span>,
        };
      });
      if (search === '') {
        if (prevSearchQuery === '') {
          setDetails(prevPages => [...prevPages, ...temp]);
        } else {
          if (pages === 1) setDetails(temp);
          else {
            setPages(1);
            setDetails([]);
          }
        }
      } else {
        setDetails(temp);
      }
      setPrevSearchQuery(search);
      setRawData({
        patient: null,
        doctor: null,
        diagnosis: null,
        admission_date: null,
        discharge_date: null,
        room_number: null,
        bed_number: null,
        notes: null,
      });
    }
    setIsLoading(false);
  }
  useEffect(() => {
    if (isMountedRef.current) {
      fetchMainDataHandler();
    }
  }, [pages, search]);
  useEffect(() => {
    setIsLoading(false);
    setToggleFilter(false);
    setDetails([]);
    setRawData([]);
    setPopUp();
    setTempSelected([]);
    setReportFile(null);
    setPages(1);
    setPrevSearchQuery('');
    setSearch('');
    setData(null);

    if (pages === 1) {
      fetchMainDataHandler();
      isMountedRef.current = true;
    }
  }, [openWindow]);

  useEffect(() => {
    async function fetchHandler() {
      try {
        let endpoint;
        switch (openWindow) {
          case 2:
            endpoint = 'records/vitals/';
            break;
          case 3:
            endpoint = 'records/medical-record/';
            break;
          case 4:
            endpoint = 'records/visits/';
            break;
          case 1:
            console.log(data[0]);
            const formData = new FormData();
            formData.append('patient', data[0].patient);
            formData.append('doctor', data[0].doctor);
            formData.append('surgery_type', data[0].surgery_type);
            formData.append('date', data[0].date);
            formData.append('time', data[0].time);
            formData.append('documentation', reportFile[0]);
            const id = toast.loading('Please wait...', {
              position: 'bottom-right',
            });
            const responseSurgery = await fetch(apiUrl + 'records/surgery/', {
              method: 'POST',
              body: formData,
              headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`,
              },
            });
            if (responseSurgery.ok) {
              setData(null);
              setPopUp(null);

              toast.update(id, {
                render: 'Successfully added!',
                type: 'success',
                isLoading: false,
                autoClose: 2000,
              });
            } else {
              toast.update(id, {
                render: 'Failed to add!',
                type: 'error',
                isLoading: false,
                autoClose: 2000,
              });
            }
            return;
          default:
            throw new Error('Invalid window ID');
        }
        const id = toast.loading('Please wait...', {
          position: 'bottom-right',
        });
        const response = await fetch(apiUrl + endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(data[0]),
        });
        if (response.ok) {
          setData(null);
          setPopUp(null);
          toast.update(id, {
            render: 'Successfully added!',
            type: 'success',
            isLoading: false,
            autoClose: 2000,
          });
        } else {
          toast.update(id, {
            render: 'Failed to add!',
            type: 'error',
            isLoading: false,
            autoClose: 2000,
          });
        }
      } catch (error) {
        console.error(error);
        // Handle the error here (e.g. show an error message to the user)
      }
    }

    if (data !== null) fetchHandler();
  }, [data]);
  const sideNav = [
    {
      id: 1,
      icon: (
        <FontAwesomeIcon
          icon={faUserDoctor}
          size='xl'
          style={{ color: openWindow === 1 && '#49A96E' }}
        />
      ),
    },
    {
      id: 2,
      icon: (
        <FontAwesomeIcon
          icon={faHeartPulse}
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
          icon={faUserCheck}
          size='xl'
          style={{ color: openWindow === 4 && '#49A96E' }}
        />
      ),
    },
  ];
  return (
    <div className={bodyClasses.container}>
      <SideNavBar sideNav={sideNav} setOpenWindow={setOpenWindow} />
      <DetailsBody
        searchstate={setSearch}
        title={
          openWindow === 1
            ? 'Surgery'
            : openWindow === 2
            ? 'Vitals'
            : openWindow === 3
            ? 'Medical Record'
            : 'Visits'
        }
        details={details}
        additionalFunction={{
          title:
            openWindow === 1
              ? '+ Add New Surgery'
              : openWindow === 2
              ? '+ Add New Vitals'
              : openWindow === 3
              ? '+ Add New Medical Record'
              : '+ Add New Visits',
          setStates: () => {
            setPopUp(true);
          },
        }}
        pagescroll={() => {
          setPages(prevPages => prevPages + 1);
        }}
      />
      {popUp && (
        <PopUp
          popUp={popUp}
          setPopUp={setPopUp}
          formInput={true}
          rawData={rawData}
          title={
            openWindow === 1
              ? 'Surgery'
              : openWindow === 2
              ? 'Vitals'
              : openWindow === 3
              ? 'Medical Record'
              : 'Visits'
          }
          selected={tempSelected}
          selectstate={setTempSelected}
          buttonFunction={() => {
            setData(tempSelected);
          }}
          buttonText={'Confirm'}
          reportFile={reportFile}
          setReportFile={setReportFile}
        />
      )}
    </div>
  );
}
export default MedicalSecretary;
