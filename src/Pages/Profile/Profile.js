import classes from './Profile.module.css';
import InformationCard from '../../component/NavBar/InformationCard';
import { useEffect, useState, useContext } from 'react';
import UserContext from '../../context/user-context';
import ExtraContext from '../../context/extra-context';
import { apiUrl } from '../../utils/api';
import Loader from '../../component/Loader/Loader';

function Profile(props) {
  const [isLoading, setIsLoading] = useState();
  const userctx = useContext(UserContext);
  const extraCtx = useContext(ExtraContext);
  const [patientAddress, setPatientAddress] = useState({});
  const [patientEmergencyInfo, setPatientEmergencyInfo] = useState([]);
  const [patientInsuranceInfo, setPatientInsuranceInfo] = useState([]);
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
      console.log(patientEmergencyInfo);
      const patientInsuranceData = await response[2].json();
      setPatientInsuranceInfo(
        patientInsuranceData.results.map((info, index) => {
          return {
            title: info.company,
            InsuranceNumber: info.number,
            InsuranceExpireDate: info.expairy_date,
            InsuranceCoverage: info.coverage,
            InsuranceCoveragePercentage: info.coverage_percentage,
          };
        })
      );
      console.log(patientInsuranceInfo);
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
      InsuranceID: 3,
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
      InsuranceCards:
        userctx.role === 'patient' &&
        patientInsuranceInfo?.map(info => {
          return info;
        }),
    });
  }, [patientAddress, patientEmergencyInfo, patientInsuranceInfo]);

  const [selectedHeader, SetSelectedHeader] = useState(1);
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
  return (
    isLoading === false && (
      <div className={classes.profile}>
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
              <span
                style={{ display: userctx.role !== 'patient' && 'none' }}
              ></span>
              <h2
                className={
                  profileContent.InsuranceID === selectedHeader
                    ? classes.active
                    : undefined
                }
                style={{ display: userctx.role !== 'patient' && 'none' }}
                onClick={() => {
                  SetSelectedHeader(profileContent.InsuranceID);
                }}
              >
                Insurance Information
              </h2>
            </div>
            <hr></hr>
            <div className={classes.content}>
              {selectedHeader === profileContent.PersonalInformationID
                ? profileContent.Personalcards.map((card, index) => (
                    <InformationCard card={card} key={index} />
                  ))
                : selectedHeader === profileContent.EmergencyInformationID
                ? profileContent.EmergencyCards.map((card, index) => (
                    <InformationCard card={card} key={index} />
                  ))
                : selectedHeader === profileContent.InsuranceID &&
                  profileContent.InsuranceCards.map((card, index) => (
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
