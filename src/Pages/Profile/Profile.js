import classes from './Profile.module.css';
import bodyClasses from '../Body.module.css';
import SideNavBar from '../../component/SideNavBar/SideNavBar';
import InformationCard from '../../component/NavBar/InformationCard';
import PopUp from '../../component/PopUp/PopUp';
import { useEffect, useState, useContext } from 'react';
import UserContext from '../../context/user-context';
import { apiUrl } from '../../utils/api';
import Loader from '../../component/Loader/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faPeopleGroup,
  faUser,
  faIdCard,
  faCheck,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Profile(props) {
  const [isLoading, setIsLoading] = useState();
  const userctx = useContext(UserContext);
  const [popUp, setPopUp] = useState(false);
  const [emergencyRawData, setEmergencyRawData] = useState([]);
  const [insuranceRawData, setInsuranceRawData] = useState([]);
  const [tempSelected, setTempSelected] = useState([]);
  const [data, setData] = useState([]);
  const [insuranceCard, setInsuranceCard] = useState();
  const [patientID, setPatientID] = useState();
  const [patientAddress, setPatientAddress] = useState({});
  const [patientEmergencyInfo, setPatientEmergencyInfo] = useState([]);
  const [patientInsuranceInfo, setPatientInsuranceInfo] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState({});
  const [openWindow, setOpenWindow] = useState(1);
  const [editing, setEditing] = useState(false);
  const [updatedCardID, setUpdatedCardID] = useState();
  const required = [
    'FirstName',
    'LastName',
    'NationalId',
    'Gender',
    'Email',
    'MobileNumber1',
    'FullStreet',
    'AppartmentNumber',
    'City',
    'Country',
    'DateOfBirth',
    'InsuranceNumber',
    'InsuranceExpireDate',
    'InsuranceCoverage',
    'InsuranceCoveragePercentage',
  ];
  const [insuranceFile, setInsuranceFile] = useState([]);
  const notEditable = ['medical_license', 'specialty', 'department'];
  const toastPlaceHolder = {
    position: 'bottom-right',
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  };

  useEffect(() => {
    setEditing(false);
    setUpdatedCardID();
    setInsuranceFile([]);
    setInsuranceCard();
    setPopUp(false);
    setTempSelected([]);
    setData([]);
  }, [openWindow]);

  function downloadFiles(links) {
    Promise.all(
      links.map(link =>
        fetch(link)
          .then(response => response.blob())
          .then(blob => {
            const file = new File([blob], link.split('/').pop(), {
              type: blob.type,
            });
            setInsuranceFile(prevFiles => [...prevFiles, file]);
          })
      )
    );
  }
  async function fetchDataHandler() {
    setIsLoading(true);
    if (userctx.role === 'patient') {
      const response = await Promise.all([
        fetch(apiUrl + 'hospital/patient/me/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('token')}`,
          },
        }),
        fetch(apiUrl + 'records/emergency-contact/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('token')}`,
          },
        }),
        fetch(apiUrl + 'bills/insurancedetails/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('token')}`,
          },
        }),
      ]);
      const patientAddressData = await response[0].json();
      setPatientAddress({
        title: 'Address Information',
        FullStreet: patientAddressData.address.street,
        AppartmentNumber: patientAddressData.address.apartment_number,
        City: patientAddressData.address.city,
        Country: patientAddressData.address.country,
      });
      setPatientID(patientAddressData.id);
      const patientEmergencyData = await response[1].json();
      setPatientEmergencyInfo(
        patientEmergencyData.results.map((info, index) => {
          return {
            id: info.id,
            title: info.relative_relation,
            FirstName: info.first_name,
            LastName: info.last_name,
            NationalId: info.national_id,
            Gender: info.gender === 'M' ? 'Male' : 'Female',
            Email: info.email,
            MobileNumber1: info.phone_1,
            MobileNumber2: info.phone_2,
            FullStreet: info.address.street,
            AppartmentNumber: info.address.apartment_number,
            City: info.address.city,
            Country: info.address.country,
          };
        })
      );
      setEmergencyRawData({
        FirstName: '',
        LastName: '',
        NationalId: '',
        Gender: '',
        MobileNumber: '',
        RelativeRelation: '',
        FullStreet: '',
        AppartmentNumber: '',
        City: '',
        Country: '',
      });
      const patientInsuranceData = await response[2].json();
      setPatientInsuranceInfo(
        patientInsuranceData.results.map((info, index) => {
          return {
            id: info.id,
            title: info.company,
            InsuranceNumber: info.number,
            InsuranceExpireDate: info.expairy_date,
            InsuranceCoverage: info.coverage,
            InsuranceCoveragePercentage: info.coverage_percentage,
          };
        })
      );
      setInsuranceRawData({
        InsuranceNumber: '',
        InsuranceExpireDate: '',
        InsuranceCoverage: '',
        InsuranceCoveragePercentage: '',
        InsuranceCompany: '',
        InsuranceCard: '',
      });
      let links = patientInsuranceData.results.map((info, index) => {
        return info.card;
      });
      downloadFiles(links);
    }
    if (userctx.role === 'doctor') {
      const response = await fetch(apiUrl + 'hospital/doctor/me/', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.getItem('token')}`,
        },
      });
      const doctorData = await response.json();
      setDoctorInfo({
        title: 'Doctor Information',
        medical_license: doctorData.medical_license,
        specialty: doctorData.specialty.specialty,
        department: doctorData.department.dapartment_name,
      });
      console.log(doctorInfo);
    }
    setIsLoading(false);
  }
  useEffect(() => {
    fetchDataHandler();
  }, []);
  const [PersonalCards, setPersonalCards] = useState([]);
  const [EmergencyCards, setEmergencyCards] = useState([]);
  const [InsuranceCards, setInsuranceCards] = useState([]);
  useEffect(() => {
    setPersonalCards([
      userctx.PersonalInformation,
      userctx.ContactInformation,
      userctx.role === 'doctor'
        ? doctorInfo
        : userctx.role === 'patient' && patientAddress,
    ]);
    setEmergencyCards(
      userctx.role === 'patient' &&
        patientEmergencyInfo?.map(info => {
          return info;
        })
    );
    setInsuranceCards(
      userctx.role === 'patient' &&
        patientInsuranceInfo?.map(info => {
          return info;
        })
    );
  }, [patientAddress, patientEmergencyInfo, patientInsuranceInfo, doctorInfo]);

  useEffect(() => {
    if (updatedCardID === 1) {
      async function updatePersonalInfo() {
        let success = true;
        if (userctx.role === 'patient') {
          const response = await fetch(apiUrl + 'hospital/patient/me/', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              address: {
                apartment_number: PersonalCards[2].AppartmentNumber,
                city: PersonalCards[2].City,
                country: PersonalCards[2].Country,
                street: PersonalCards[2].FullStreet,
              },
            }),
          });
          if (!response.ok) {
            success = false;
          }
        }
        const response1 = await fetch(apiUrl + 'auth/users/me/', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            first_name: PersonalCards[0].FirstName,
            last_name: PersonalCards[0].LastName,
            national_id: PersonalCards[0].NationalId,
            phone_1: PersonalCards[1].MobileNumber1,
            ...(PersonalCards[1].MobileNumber2 !== '' && {
              phone_2: PersonalCards[1].MobileNumber2,
            }),
            email: PersonalCards[1].Email,
            birth_date: PersonalCards[0].BirthDate,
            gender: PersonalCards[0].gender,
          }),
        });
        if (!response1.ok) {
          success = false;
        }
        if (success) {
          toast.success(
            'Personal information updated successfully',
            toastPlaceHolder
          );
          setEditing(false);
          setUpdatedCardID();
        } else {
          toast.error(
            'Something went wrong, please try again',
            toastPlaceHolder
          );
          setUpdatedCardID();
        }
      }
      updatePersonalInfo();
    } else if (updatedCardID === 2) {
      async function updateEmergencyInfo() {
        let success = true;
        for (let i = 0; i < EmergencyCards.length; i++) {
          console.log(EmergencyCards[i].Gender);
          const response = await fetch(
            apiUrl + 'records/emergency-contact/' + EmergencyCards[i].id + '/',
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `JWT ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify({
                first_name: EmergencyCards[i].FirstName,
                last_name: EmergencyCards[i].LastName,
                national_id: EmergencyCards[i].NationalId,
                phone_1: EmergencyCards[i].MobileNumber1,
                phone_2: EmergencyCards[i].MobileNumber2,
                email: EmergencyCards[i].Email,
                relative_relation: EmergencyCards[i].title,
                gender: EmergencyCards[i].Gender === 'female' ? 'F' : 'M',
                address: {
                  apartment_number: EmergencyCards[i].AppartmentNumber,
                  city: EmergencyCards[i].City,
                  country: EmergencyCards[i].Country,
                  street: EmergencyCards[i].FullStreet,
                },
              }),
            }
          );
          if (response.ok) {
          } else {
            success = false;
            break;
          }
        }
        if (success) {
          toast.success(
            'Emergency information updated successfully',
            toastPlaceHolder
          );
          setEditing(false);
          setUpdatedCardID();
        } else {
          toast.error(
            'Something went wrong, please try again',
            toastPlaceHolder
          );
          setUpdatedCardID();
        }
      }
      updateEmergencyInfo();
    } else if (updatedCardID === 3) {
      async function updateInsuranceInfo() {
        let success = true;
        for (let i = 0; i < InsuranceCards.length; i++) {
          const formData = new FormData();
          formData.append('card', insuranceFile[i]);
          formData.append('number', InsuranceCards[i].InsuranceNumber);
          formData.append(
            'expairy_date',
            InsuranceCards[i].InsuranceExpireDate
          );
          formData.append('coverage', InsuranceCards[i].InsuranceCoverage);
          formData.append(
            'coverage_percentage',
            InsuranceCards[i].InsuranceCoveragePercentage
          );
          formData.append('company', InsuranceCards[i].title);
          formData.append('patient', patientID);
          const response = await fetch(
            apiUrl + 'bills/insurancedetails/' + InsuranceCards[i].id + '/',
            {
              method: 'PUT',
              headers: {
                Authorization: `JWT ${localStorage.getItem('token')}`,
              },
              body: formData,
            }
          );
          if (!response.ok) {
            success = false;
            break;
          }
        }
        if (success) {
          toast.success(
            'Insurance information updated successfully',
            toastPlaceHolder
          );
          setEditing(false);
          setUpdatedCardID();
        } else {
          toast.error(
            'Something went wrong, please try again',
            toastPlaceHolder
          );
          setUpdatedCardID();
        }
      }
      updateInsuranceInfo();
    }
  }, [updatedCardID]);
  useEffect(() => {
    if (data.length > 0) {
      if (openWindow === 2) {
        async function postEmergencyInfo() {
          const response = await fetch(apiUrl + 'records/emergency-contact/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              first_name: data[0].FirstName,
              last_name: data[0].LastName,
              national_id: data[0].NationalId,
              phone_1: data[0].MobileNumber,
              relative_relation: data[0].RelativeRelation,
              gender:
                data[0].Gender === 'Male' || 'M' || 'm' || 'male' ? 'M' : 'F',
              address: {
                apartment_number: data[0].AppartmentNumber,
                city: data[0].City,
                country: data[0].Country,
                street: data[0].FullStreet,
              },
            }),
          });
          if (response.ok) {
            toast.success(
              'Emergency information added successfully',
              toastPlaceHolder
            );
            setPopUp(false);
            fetchDataHandler();
          } else {
            toast.error('Something went wrong, please try again');
          }
        }
        postEmergencyInfo();
      } else if (openWindow === 3) {
        async function postInsuranceInfo() {
          console.log(insuranceCard);
          const formData = new FormData();
          formData.append('card', insuranceCard[0]);
          formData.append('number', data[0].InsuranceNumber);
          formData.append('expairy_date', data[0].InsuranceExpireDate);
          formData.append('coverage', data[0].InsuranceCoverage);
          formData.append(
            'coverage_percentage',
            data[0].InsuranceCoveragePercentage
          );
          formData.append('company', data[0].InsuranceCompany);
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
            setPopUp(false);
            fetchDataHandler();
          } else {
            toast.error('Something went wrong, please try again');
          }
        }
        postInsuranceInfo();
      }
    }
  }, [data, insuranceCard]);
  const patientSideNav = [
    {
      id: 1,
      icon: (
        <FontAwesomeIcon
          icon={faUser}
          size='xl'
          style={{ color: openWindow === 1 && '#49A96E' }}
        />
      ),
    },
    {
      id: 2,
      icon: (
        <FontAwesomeIcon
          icon={faPeopleGroup}
          size='xl'
          style={{ color: openWindow === 2 && '#49A96E' }}
        />
      ),
    },
    {
      id: 3,
      icon: (
        <FontAwesomeIcon
          icon={faIdCard}
          size='xl'
          style={{ color: openWindow === 3 && '#49A96E' }}
        />
      ),
    },
  ];
  const otherSideNav = [
    {
      id: 1,
      icon: (
        <FontAwesomeIcon
          icon={faUser}
          size='xl'
          style={{ color: openWindow === 1 && '#49A96E' }}
        />
      ),
    },
  ];
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
        }}
      >
        <Loader cl={'#fff'} />
      </div>
    );
  }
  function checkRequired(card) {
    let isRequired = true;
    card.forEach(card => {
      Object.keys(card).forEach(key => {
        if (
          required.includes(key) &&
          (card[key] == null ||
            (typeof card[key] === 'string' && card[key].trim() === ''))
        ) {
          isRequired = false;
        }
      });
    });
    return isRequired;
  }
  return (
    !isLoading && (
      <div className={bodyClasses.container}>
        {popUp && (
          <PopUp
            popUp={popUp}
            setPopUp={setPopUp}
            formInput={true}
            rawData={openWindow === 2 ? emergencyRawData : insuranceRawData}
            title={
              openWindow === 2
                ? 'Add New Emergency Contact'
                : 'Add New Insurance Information'
            }
            selected={tempSelected}
            selectstate={setTempSelected}
            buttonFunction={() => {
              setData(tempSelected);
            }}
            buttonText={'Confirm'}
            reportFile={insuranceCard}
            setReportFile={setInsuranceCard}
          />
        )}
        <SideNavBar
          sideNav={userctx.role === 'patient' ? patientSideNav : otherSideNav}
          setOpenWindow={setOpenWindow}
        />
        <div className={classes.body}>
          <div className={classes.header}>
            <h1 className={classes.title}>
              {openWindow === 1
                ? 'User Information'
                : openWindow === 2
                ? 'Emergency Information'
                : openWindow === 3
                ? 'Insurance Information'
                : ''}
            </h1>
            <div className={classes.buttonsContainer}>
              {openWindow !== 1 && (
                <button
                  className={classes.buttonStyle}
                  onClick={() => {
                    setPopUp(true);
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} size='xl' />
                </button>
              )}
              {editing ? (
                <button
                  className={classes.buttonStyle}
                  onClick={() => {
                    if (openWindow === 1 && checkRequired(PersonalCards)) {
                      setUpdatedCardID(1);
                    } else if (
                      openWindow === 2 &&
                      checkRequired(EmergencyCards)
                    ) {
                      setUpdatedCardID(2);
                    } else if (
                      openWindow === 3 &&
                      checkRequired(InsuranceCards)
                    ) {
                      setUpdatedCardID(3);
                    } else {
                      toast.error(
                        'Please fill all required fields',
                        toastPlaceHolder
                      );
                    }
                  }}
                >
                  Confirm <FontAwesomeIcon icon={faCheck} size='xl' />
                </button>
              ) : (
                <button
                  className={classes.buttonStyle}
                  onClick={() => {
                    setEditing(true);
                  }}
                >
                  <FontAwesomeIcon icon={faPenToSquare} size='xl' />
                </button>
              )}
            </div>
          </div>
          <div className={classes.content}>
            {openWindow === 1 && PersonalCards ? (
              <InformationCard
                card={PersonalCards}
                editing={editing}
                setCard={setPersonalCards}
                required={required}
                notEditable={notEditable}
              />
            ) : openWindow === 2 && EmergencyCards ? (
              <InformationCard
                card={EmergencyCards}
                editing={editing}
                setCard={setEmergencyCards}
                required={required}
                notEditable={notEditable}
              />
            ) : (
              openWindow === 3 &&
              InsuranceCards && (
                <InformationCard
                  card={InsuranceCards}
                  editing={editing}
                  setCard={setInsuranceCards}
                  required={required}
                  notEditable={notEditable}
                />
              )
            )}
          </div>
        </div>
      </div>
    )
  );
}
export default Profile;
