import classes from './Pharmacy.module.css';
import bodyClasses from '../Body.module.css';
import SideNavBar from '../../component/SideNavBar/SideNavBar';
import { useState, useEffect } from 'react';
import DetailsBody from '../../component/DetailsBody/DetailsBody';
import { apiUrl } from '../../utils/api';
import PopUp from '../../component/PopUp/PopUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPills, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Pharmacy() {
  const [pages, setPages] = useState(1);
  const [openWindow, setOpenWindow] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [toggleFilter, setToggleFilter] = useState(false);

  // details that hold main data
  const [details, setDetails] = useState([]);

  //popup state
  const [showPopUpForDrugs, setShowPopUpForDrugs] = useState(false);
  const [prescriptionId, setPrescriptionId] = useState(false);
  const [popUpData, setPopUpData] = useState([]);
  const [tempSelected, setTempSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  //fetching main data
  async function fetchMainDataHandler() {
    setIsLoading(true);
    const response = await Promise.all([
      openWindow === 1 &&
        fetch(
          apiUrl +
            `pharmacy/drug/?&search=${search}${
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
            `pharmacy/pharmacist-prescription/?&search=${search}${
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
          id: (
            <span
              className={
                info.stock === 0
                  ? classes.red
                  : info.stock < 10
                  ? classes.yellow
                  : classes.green
              }
            >
              {info.id}
            </span>
          ),
          name: (
            <span
              className={
                info.stock === 0
                  ? classes.red
                  : info.stock < 10
                  ? classes.yellow
                  : classes.green
              }
            >
              {info.name}
            </span>
          ),
          company: (
            <span
              className={
                info.stock === 0
                  ? classes.red
                  : info.stock < 10
                  ? classes.yellow
                  : classes.green
              }
            >
              {info.company}
            </span>
          ),
          price: (
            <span
              className={
                info.stock === 0
                  ? classes.red
                  : info.stock < 10
                  ? classes.yellow
                  : classes.green
              }
            >
              {info.price}
            </span>
          ),
          stock: (
            <span
              className={
                info.stock === 0
                  ? classes.red
                  : info.stock < 10
                  ? classes.yellow
                  : classes.green
              }
            >
              {info.stock}
            </span>
          ),
          form: (
            <span
              className={
                info.stock === 0
                  ? classes.red
                  : info.stock < 10
                  ? classes.yellow
                  : classes.green
              }
            >
              {info.form}
            </span>
          ),
          created_at_date: (
            <span
              className={
                info.stock === 0
                  ? classes.red
                  : info.stock < 10
                  ? classes.yellow
                  : classes.green
              }
            >
              {info.created_at.toString().split('T')[0]}
            </span>
          ),
          created_at_time: (
            <span
              className={
                info.stock === 0
                  ? classes.red
                  : info.stock < 10
                  ? classes.yellow
                  : classes.green
              }
            >
              {info.created_at.toString().split('T')[1].split('.')[0]}
            </span>
          ),
          updated_at_date: (
            <span
              className={
                info.stock === 0
                  ? classes.red
                  : info.stock < 10
                  ? classes.yellow
                  : classes.green
              }
            >
              {info.updated_at.toString().split('T')[0]}
            </span>
          ),
          updated_at_time: (
            <span
              className={
                info.stock === 0
                  ? classes.red
                  : info.stock < 10
                  ? classes.yellow
                  : classes.green
              }
            >
              {info.updated_at.toString().split('T')[1].split('.')[0]}
            </span>
          ),
          expire_date: (
            <span
              className={
                info.stock === 0
                  ? classes.red
                  : info.stock < 10
                  ? classes.yellow
                  : classes.green
              }
            >
              {info.expire_date}
            </span>
          ),
        };
      });
      if (search === '') {
        setDetails(prevDetails => [...prevDetails, ...temp]);
      } else {
        setDetails(temp);
      }
    } else if (openWindow === 2) {
      const data = await response[1].json();
      let temp = data.results.map(info => {
        return {
          id: <span>{info.id}</span>,
          doctor: (
            <span>{info.doctor.first_name + ' ' + info.doctor.last_name}</span>
          ),
          patient: (
            <span>
              {info.patient.first_name + ' ' + info.patient.last_name}
            </span>
          ),
          date: <span>{info.date}</span>,
          notes: <span>{info.notes}</span>,
          button: [
            {
              title: 'View Prescription',
              setStates: () => {
                setPrescriptionId(info.id);
              },
            },
          ],
        };
      });
      if (search === '') {
        setDetails(prevDetails => [...prevDetails, ...temp]);
      } else {
        setDetails(temp);
      }
      if (prescriptionId) {
        setPopUpData(
          data.results
            .filter(info => info.id === prescriptionId)[0]
            .prescription.map(info => {
              if (info.dispensed === true) {
                return {
                  id: <span>{info.id}</span>,
                  drug: <span>{info.drug.name}</span>,
                  price: <span>{info.drug.price}</span>,
                  amount: <span>{info.amount}</span>,
                  dose: <span>{info.dose}</span>,
                  duration: <span>{info.duration}</span>,
                };
              } else {
                return undefined; // or null, or just omit the else block
              }
            })
            .filter(Boolean) // filter out any undefined/null values
        );
      }
    }
    setIsLoading(false);
  }
  useEffect(() => {
    fetchMainDataHandler();
  }, [prescriptionId, pages, search]);
  useEffect(() => {
    if (pages === 1) fetchMainDataHandler();
  }, [openWindow]);

  useEffect(() => {
    async function fetchHandler() {
      if (data.length > 0) {
        if (openWindow === 1) {
          for (let i = 0; i < data.length; i++) {
            try {
              const id = toast.loading('Please wait...', {
                position: 'bottom-right',
              });
              const response = await fetch(apiUrl + `pharmacy/drug/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `JWT ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(data[i]),
              });
              if (response.ok) {
                toast.update(id, {
                  render: 'Drug Created!',
                  type: 'success',
                  isLoading: false,
                  autoClose: 1000,
                  position: 'bottom-right',
                });
              } else {
                toast.update(id, {
                  render: 'Error!',
                  type: 'error',
                  isLoading: false,
                  autoClose: 1000,
                  position: 'bottom-right',
                });
              }
            } catch (error) {
              toast.error('Error!', {
                position: 'bottom-right',
              });
              // Handle the error here (e.g. show an error message to the user)
            }
          }
        }
      }
    }
    fetchHandler();

    console.log(data);
  }, [data]);

  //reset
  useEffect(() => {
    setDetails([]);
    setPages(1);
  }, [openWindow]);
  const sideNav = [
    {
      id: 1,
      icon: (
        <FontAwesomeIcon
          icon={faPills}
          size='xl'
          style={{ color: openWindow === 1 && '#49A96E' }}
        />
      ),
    },
    {
      id: 2,
      icon: (
        <FontAwesomeIcon
          icon={faClipboard}
          size='xl'
          style={{ color: openWindow === 2 && '#49A96E' }}
        />
      ),
    },
  ];
  return (
    <div className={bodyClasses.container}>
      <SideNavBar sideNav={sideNav} setOpenWindow={setOpenWindow} />
      {openWindow === 1 && (
        <DetailsBody
          title='Drugs'
          searchstate={setSearch}
          toggleFilter={toggleFilter}
          setToggleFilter={setToggleFilter}
          details={details}
          additionalFunction={{
            title: '+ Add New Drug',
            setStates: () => {
              setShowPopUpForDrugs(true);
            },
          }}
          pagescroll={() => {
            setPages(prevPages => prevPages + 1);
          }}
        />
      )}
      {openWindow === 2 && (
        <DetailsBody
          title='Prescriptions'
          searchstate={setSearch}
          toggleFilter={toggleFilter}
          setToggleFilter={setToggleFilter}
          details={details}
          pagescroll={() => {
            setPages(prevPages => prevPages + 1);
          }}
        />
      )}
      {showPopUpForDrugs && (
        <PopUp
          popUp={showPopUpForDrugs}
          setPopUp={setShowPopUpForDrugs}
          prescription={true}
          isDrug={true}
          selected={tempSelected}
          selectstate={setTempSelected}
          searchstate={setSearch}
          buttonFunction={() => {
            console.log(tempSelected);
            setData(tempSelected);
            setShowPopUpForDrugs(false);
          }}
          buttonText={'Confirm'}
        />
      )}
      {console.log(popUpData)}
      {prescriptionId && (
        <PopUp
          popUp={prescriptionId}
          setPopUp={setPrescriptionId}
          Cards={popUpData.length > 0 && popUpData}
          text={popUpData.length === 0 && 'No Prescription'}
          title={'Prescription'}
          buttonFunction={() => {
            async function fetchHandler() {
              try {
                const id = toast.loading('Please wait...', {
                  position: 'bottom-right',
                });
                const response = await fetch(
                  apiUrl +
                    `pharmacy/pharmacist-prescription/${prescriptionId}/`,
                  {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `JWT ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ dispensed_status: 'dispensed' }),
                  }
                );
                if (response.ok) {
                  toast.update(id, {
                    render: `Prescription ${prescriptionId} Updated!`,
                    type: 'success',
                    isLoading: false,
                    autoClose: 1000,
                    position: 'bottom-right',
                  });
                } else {
                  toast.update(id, {
                    render: `Error!`,
                    type: 'error',
                    isLoading: false,
                    autoClose: 1000,
                    position: 'bottom-right',
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
              setPrescriptionId(null);
            }
            fetchHandler();
          }}
          buttonText={'Set To Dispensed'}
        />
      )}
    </div>
  );
}
export default Pharmacy;
