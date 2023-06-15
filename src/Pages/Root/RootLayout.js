import { Outlet } from 'react-router-dom';
import NavBar from '../../component/NavBar/navbar';
import { useContext } from 'react';
import UserContext from '../../context/user-context';
import { checkAuth } from '../../utils/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileMedical, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function RootLayout() {
  const userctx = useContext(UserContext);
  const links = {
    patient: [
      {
        to: '/',
        title: (
          <h1>
            <span>Home</span>
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
            <span>Appointment</span>
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
        to: '/',
        title: (
          <h1>
            <span>Appointment</span>
          </h1>
        ),
        icon: (
          <h1>
            <i class='fa-solid fa-phone'></i>
          </h1>
        ),
      },
      {
        to: '/medicalrecord',
        title: (
          <h1>
            <span>Medical Record</span>
          </h1>
        ),
        icon: (
          <h1>
            <FontAwesomeIcon icon={faFileMedical} />
          </h1>
        ),
      },
    ],
    admin: [
      {
        to: '/',
        title: (
          <h1>
            <span>Home</span>
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
        to: '/',
        title: (
          <h1>
            <span>Appointment</span>
          </h1>
        ),
        icon: (
          <h1>
            <i class='fa-solid fa-phone'></i>
          </h1>
        ),
      },
      {
        to: '/requests',
        title: (
          <h1>
            <span>Requests</span>
          </h1>
        ),
        icon: (
          <h1>
            <FontAwesomeIcon icon={faFileMedical} />
          </h1>
        ),
      },
      {
        to: '/signup',
        title: (
          <h1>
            <span>signup</span>
          </h1>
        ),
        icon: (
          <h1>
            <FontAwesomeIcon icon={faUserPlus} />
          </h1>
        ),
      },
    ],
    lab: [
      {
        to: '/',
        title: (
          <h1>
            <span>Home</span>
          </h1>
        ),
        icon: (
          <h1>
            <i class='fa-solid fa-house'></i>
          </h1>
        ),
      },
    ],
    radiologist: [
      {
        to: '/',
        title: (
          <h1>
            <span>Home</span>
          </h1>
        ),
        icon: (
          <h1>
            <i class='fa-solid fa-house'></i>
          </h1>
        ),
      },
    ],
    pharmacist: [
      {
        to: '/',
        title: (
          <h1>
            <span>Home</span>
          </h1>
        ),
        icon: (
          <h1>
            <i class='fa-solid fa-house'></i>
          </h1>
        ),
      },
    ],
    medical_secretary: [
      {
        to: '/',
        title: (
          <h1>
            <span>Home</span>
          </h1>
        ),
        icon: (
          <h1>
            <i class='fa-solid fa-house'></i>
          </h1>
        ),
      },
    ],
  };
  return (
    <>
      {checkAuth() && (
        <NavBar
          links={links[userctx.role]}
          id='nav'
          firstname={userctx.PersonalInformation.FirstName}
          role={userctx.role}
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
      <ToastContainer autoClose={3000} />
    </>
  );
}
export default RootLayout;
