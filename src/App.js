import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Appointment from './Pages/Appointment/Appointment';
import RootLayout from './Pages/Root/RootLayout';
import Profile from './Pages/Profile/Profile';
import SignUpLogin from './Pages/SignUpLogin';
import SignUpAddress from './Pages/SignUpAddress';
import SignUpPersonal from './Pages/SignUpPersonal';
import SignIn from './Pages/SignIn';
import ForgetPassword from './Pages/ForgetPassword';
import Labs from './Pages/Labs/Labs';
import MedicalRecord from './Pages/MedicalRecord/MedicalRecord';
import MedicalSecretary from './Pages/MedicalSecretary/MedicalSecretary';
import Pharmacy from './Pages/Pharmacy/Pharmacy';
import { checkAuth, auth } from './utils/auth';
import UserContext from './context/user-context';
import { apiUrl } from './utils/api';
function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  //todo: fetch organization

  const adminRouter = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { path: '/', element: <Dashboard /> },
        { path: '/profile', element: <Profile /> },
      ],
    },
  ]);
  const medicalSecrtaryRouter = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [{ path: '/', element: <MedicalSecretary /> }],
    },
  ]);
  const pharmacyRouter = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { path: '/', element: <Pharmacy /> },
        { path: '/profile', element: <Profile /> },
      ],
    },
  ]);
  const patientRouter = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { path: '/', element: <Dashboard /> },
        { path: '/appointment', element: <Appointment /> },
        { path: '/profile', element: <Profile /> },
      ],
    },
  ]);
  const doctorRouter = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { path: '/', element: <Appointment /> },
        { path: '/medicalrecord', element: <MedicalRecord /> },
        { path: '/profile', element: <Profile /> },
      ],
    },
  ]);
  const receptionistRouter = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { path: '/', element: <Appointment /> },
        { path: '/requests', element: <MedicalRecord /> },
        { path: '/profile', element: <Profile /> },
      ],
    },
  ]);
  const labortoryRouter = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { path: '/', element: <Labs /> },
        { path: '/profile', element: <Profile /> },
      ],
    },
  ]);
  const radiologistRouter = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { path: '/', element: <Labs /> },
        { path: '/profile', element: <Profile /> },
      ],
    },
  ]);
  const loginRouter = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { path: '/', element: <SignUpLogin /> },
        { path: '/signup/login/', element: <SignUpLogin /> },
        { path: '/signup/personal/', element: <SignUpPersonal /> },
        { path: '/signup/address/', element: <SignUpAddress /> },
        { path: '/signin/', element: <SignIn /> },
        { path: '/forgetpassword/', element: <ForgetPassword /> },
      ],
    },
  ]);

  async function fetchUserHandler() {
    if (checkAuth()) {
      setIsLoading(true);  
      const response = await fetch(apiUrl + 'auth/users/me/',{
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth,
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        setIsLoading(false);
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
        return;
      }
    } else setIsLoading(false);
  }
  useEffect(() => {
    fetchUserHandler();
  }, []);

  const ChooseRouterRole = () => {
    if (checkAuth()) {
      if (userInfo.role === 'admin') {
        return (
          <UserContext.Provider value={userInfo}>
            <RouterProvider router={adminRouter} />
          </UserContext.Provider>
        );
      } else if (userInfo.role === 'patient') {
        return (
          <UserContext.Provider value={userInfo}>
            <RouterProvider router={patientRouter} />
          </UserContext.Provider>
        );
      } else if (userInfo.role === 'doctor') {
        return (
          <UserContext.Provider value={userInfo}>
            <RouterProvider router={doctorRouter} />
          </UserContext.Provider>
        );
      } else if (userInfo.role === 'receptionist') {
        return (
          <UserContext.Provider value={userInfo}>
            <RouterProvider router={receptionistRouter} />
          </UserContext.Provider>
        );
      } else if (userInfo.role === 'lab') {
        return (
          <UserContext.Provider value={userInfo}>
            <RouterProvider router={labortoryRouter} />
          </UserContext.Provider>
        );
      } else if (userInfo.role === 'radiologist') {
        return (
          <UserContext.Provider value={userInfo}>
            <RouterProvider router={radiologistRouter} />
          </UserContext.Provider>
        );
      } else if (userInfo.role === 'pharmacist') {
        return (
          <UserContext.Provider value={userInfo}>
            <RouterProvider router={pharmacyRouter} />
          </UserContext.Provider>
        );
      } else if (userInfo.role === 'medical_secretary') {
        return (
          <UserContext.Provider value={userInfo}>
            <RouterProvider router={medicalSecrtaryRouter} />
          </UserContext.Provider>
        );
      }
    } else {
      return <RouterProvider router={loginRouter} />;
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return ChooseRouterRole();
}

export default App;
