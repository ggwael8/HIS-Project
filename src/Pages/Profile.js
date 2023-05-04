import classes from './Profile.module.css';
import InformationCard from '../component/InformationCard';
import { useEffect, useState, useContext } from 'react';
import UserContext from '../context/user-context';
function Profile(props) {
  const [isLoading, setIsLoading] = useState();
  const userctx = useContext(UserContext);
  const [patientAddress, setPatientAddress] = useState({});
  const [profileContent, setProfileContent] = useState({});
  //todo: fetch organization
  async function fetchPatientAddressHandler() {
    setIsLoading(true);
    if (userctx.role === 'patient') {
      const response = await fetch(
        'https://hospital-information-system-production-b18b.up.railway.app/hospital/patient/me/'
      );
      console.log(response);
      const data = await response.json();
      setPatientAddress({
        title: 'Address Information',
        FullStreet: data.address.street,
        AppartmentNumber: data.address.appartment_number,
        City: data.address.city,
        Country: data.address.country,
      });
      console.log(patientAddress);
    }
    setIsLoading(false);
  }
  useEffect(() => {
    fetchPatientAddressHandler();
  }, []);

  const [selectedHeader, SetSelectedHeader] = useState(1);
  const setProfile = () => {
    setProfileContent({
      PersonalInformationID: 1,
      EmergencyInformationID: 2,
      Personalcards: [
        userctx.PersonalInformation,
        userctx.ContactInformation,
        patientAddress,
      ],
      EmergencyCards: [],
    });
  };
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  return (
    isLoading === false && (
      <div className={classes.profile}>
        {console.log()}
        {Object.keys(profileContent).length === 0 ? (
          <>{setProfile()}</>
        ) : (
          <>
            <div className={classes.header}>
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
              <span></span>
              <h2
                className={
                  profileContent.EmergencyInformationID === selectedHeader
                    ? classes.active
                    : undefined
                }
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
        )}

        {console.log(profileContent)}
      </div>
    )
  );
}
export default Profile;
