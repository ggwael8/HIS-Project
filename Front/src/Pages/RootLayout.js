import { Outlet } from 'react-router-dom';
import NavBar from '../component/navbar';
import classes from './RootLayout.module.css';
import { useState, useEffect } from 'react';
import UserContext from '../context/user-context';
function RootLayout() {
  const [userInfo, setUserInfo] = useState({
    UserID: 3,
    role: 'receptionist',
    PersonalInformation: {
      title: 'Personal Information',
      FirstName: ' data.user.first_name',
      LastName: 'data.user.last_name',
      Gender: ' data.user.gender',
      NationalId: 'data.user.national_id',
      DateOfBirth: 'mstny te7a',
    },
    ContactInformation: {
      title: 'Contact Information',
      MobileNumber1: 'data.user.phone_1',
      MobileNumber2: 'data.user.phone_2',
      Email: 'data.user.email',
    },
    AddressInformation: {
      title: 'Address Information',
      FullStreet: 'data.address.street',
      AppartmentNumber: 'data.address.appartment_number',
      City: 'data.address.city',
      Country: 'data.address.country',
    },
  });
  const [dataFetched, setDataFetched] = useState(true);
  async function fetchUserHandler() {
    const response = await fetch(
      'https://504f-156-193-43-93.ngrok-free.app/records/patient/me/'
    );
    const data = await response.json();
    const transformedInfo = {
      UserID: data.user.id,
      role:
        data.user.id === 0
          ? 'admin'
          : data.user.id === 1
          ? 'doctor'
          : 'patient',
      PersonalInformation: {
        title: 'Personal Information',
        FirstName: data.user.first_name,
        LastName: data.user.last_name,
        Gender: data.user.gender,
        NationalId: data.user.national_id,
        //todo: waiting te7a to update this
        DateOfBirth: 'mstny te7a',
      },
      ContactInformation: {
        title: 'Contact Information',
        MobileNumber1: data.user.phone_1,
        MobileNumber2: data.user.phone_2,
        Email: data.user.email,
      },
      AddressInformation: {
        title: 'Address Information',
        FullStreet: data.address.street,
        AppartmentNumber: data.address.appartment_number,
        City: data.address.city,
        Country: data.address.country,
      },
    };
    setUserInfo(transformedInfo);
    setDataFetched(true);
  }
  // useEffect(() => {
  //   fetchUserHandler();
  // }, []);

  const links = [
    [
      /*Admin*/
    ],
    [
      /*Doctor*/
      {
        to: '/appointment',
        title: (
          <h1>
            <span>appointment</span>
          </h1>
        ),
        icon: (
          <h1>
            <i class='fa-solid fa-phone'></i>
          </h1>
        ),
      },
    ],
    [
      /*Patient*/
      {
        to: '/',
        title: (
          <h1>
            <span>home</span>
          </h1>
        ),
        icon: (
          <h1>
            <i class='fa-solid fa-house'></i>
          </h1>
        ),
      },
      {
        to: '/appointment',
        title: (
          <h1>
            <span>appointment</span>
          </h1>
        ),
        icon: (
          <h1>
            <i class='fa-solid fa-phone'></i>
          </h1>
        ),
      },
    ],
    [
      /*Receptionist*/
      {
        to: '/appointment',
        title: (
          <h1>
            <span>appointment</span>
          </h1>
        ),
        icon: (
          <h1>
            <i class='fa-solid fa-phone'></i>
          </h1>
        ),
      },
    ],
  ];
  return (
    <UserContext.Provider value={userInfo}>
      {
        <>
          {' '}
          <NavBar
            links={links[userInfo.UserID]}
            id='nav'
            firstname={userInfo.PersonalInformation.FirstName}
            role={userInfo.role}
          />
          <div className={classes.outletBody}>
            <Outlet />
          </div>{' '}
        </>
      }
    </UserContext.Provider>
  );
}
export default RootLayout;
