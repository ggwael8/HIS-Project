import { Outlet } from 'react-router-dom';
import NavBar from '../component/NavBar/navbar';
import { useState, useEffect } from 'react';
import UserContext from '../context/user-context';
import { checkAuth } from '../utils/auth';
function RootLayout() {
  const [userInfo, setUserInfo] = useState();
  const [dataFetched, setDataFetched] = useState(false);
  //todo: fetch organization
  async function fetchUserHandler() {
    const response = await fetch(
      'https://hospital-information-system-production-b18b.up.railway.app/auth/users/me/'
    );
    const data = await response.json();

    const transformedInfo = {
      role: data.role,
      UserID: data.id,
      PersonalInformation: {
        title: 'Personal Information',
        FirstName: data.first_name,
        LastName: data.last_name,
        Gender: data.gender === 'M' ? 'Male' : 'Female',
        NationalId: data.national_id,
        DateOfBirth: data.birth_date,
      },
      ContactInformation: {
        title: 'Contact Information',
        MobileNumber1: data.phone_1,
        MobileNumber2: data.phone_2,
        Email: data.email,
      },
    };
    setUserInfo(transformedInfo);
    setDataFetched(true);
  }
  useEffect(() => {
    fetchUserHandler();
  }, []);

  const links = {
    patient: [
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
    doctor: [
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
    admin: [
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
    ],
    receptionist: [
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
  };
  return (
    dataFetched && (
      <UserContext.Provider value={userInfo}>
        {
          <>
            {checkAuth() && (
              <NavBar
                links={links[userInfo.role]}
                id='nav'
                firstname={userInfo.PersonalInformation.FirstName}
                role={userInfo.role}
              />
            )}
            <div
              style={{
                height: checkAuth() ? '90vh' : '100vh',
                display: 'flex',
              }}
            >
              <Outlet />
            </div>
          </>
        }
      </UserContext.Provider>
    )
  );
}
export default RootLayout;