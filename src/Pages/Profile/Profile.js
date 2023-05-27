import classes from './Profile.module.css';
import InformationCard from '../../component/NavBar/InformationCard';
import { useEffect, useState, useContext } from 'react';
import UserContext from '../../context/user-context';
import ExtraContext from '../../context/extra-context';
import { apiUrl } from '../../utils/api';

function Profile(props) {
  const [isLoading, setIsLoading] = useState();
  const userctx = useContext(UserContext);
  const extraCtx = useContext(ExtraContext);
  const [patientAddress, setPatientAddress] = useState({});
  const [patientEmergencyInfo, setPatientEmergencyInfo] = useState([]);
  const [profileContent, setProfileContent] = useState({});
  //todo: fetch organization
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
      ]);
      console.log(response);
      const patientAddressData = await response[0].json();
      setPatientAddress({
        title: 'Address Information',
        FullStreet: patientAddressData.address.street,
        AppartmentNumber: patientAddressData.address.appartment_number,
        City: patientAddressData.address.city,
        Country: patientAddressData.address.country,
      });
      const patientEmergencyData = await response[1].json();
      setPatientEmergencyInfo(
        patientEmergencyData.results.map((info, index) => {
          return {
            title: info.relative_relation,
            FirstName: info.first_name,
            LastName: info.last_name,
            NationalId: info.national_id,
            Gender: info.gender === 'M' ? 'Male' : 'Female',
            Email: info.email,
            PhoneNumber1: info.phone_1,
            PhoneNumber2: info.phone_2,
            FullStreet: info.address.street,
            AppartmentNumber: info.address.apartment_number,
            City: info.address.city,
          };
        })
      );
    }
    setIsLoading(false);
  }
  useEffect(() => {
    fetchDataHandler();
  }, []);
  useEffect(() => {
    setProfileContent({
      PersonalInformationID: 1,
      EmergencyInformationID: 2,
      Personalcards: [
        userctx.PersonalInformation,
        userctx.ContactInformation,
        userctx.role === 'doctor'
          ? extraCtx
          : userctx.role === 'patient' && patientAddress,
      ],
      EmergencyCards:
        userctx.role === 'patient' &&
        patientEmergencyInfo?.map(info => {
          return info;
        }),
    });
  }, [patientAddress, patientEmergencyInfo]);

  const [selectedHeader, SetSelectedHeader] = useState(1);
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  return (
    isLoading === false && (
      <div className={classes.profile}>
        {console.log(userctx.role)}
        {
          <>
            <div className={classes.header}>
              {console.log('prf: ', profileContent)}
              <h2
                className={
                  profileContent.PersonalInformationID === selectedHeader
                    ? classes.active
                    : undefined
                }
                onClick={() => {
                  SetSelectedHeader(profileContent.PersonalInformationID);
                }}
              >
                Personal Information
              </h2>
              <span
                style={{ display: userctx.role !== 'patient' && 'none' }}
              ></span>
              <h2
                className={
                  profileContent.EmergencyInformationID === selectedHeader
                    ? classes.active
                    : undefined
                }
                style={{ display: userctx.role !== 'patient' && 'none' }}
                onClick={() => {
                  SetSelectedHeader(profileContent.EmergencyInformationID);
                }}
              >
                Emergency Information
              </h2>
            </div>
            <hr></hr>
            <div className={classes.content}>
              {selectedHeader === profileContent.PersonalInformationID
                ? profileContent.Personalcards.map((card, index) => (
                    <InformationCard card={card} key={index} />
                  ))
                : profileContent.EmergencyCards.map((card, index) => (
                    <InformationCard card={card} key={index} />
                  ))}
            </div>
          </>
        }
      </div>
    )
  );
}
export default Profile;
