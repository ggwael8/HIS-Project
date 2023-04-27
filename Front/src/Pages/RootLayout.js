import { Outlet } from 'react-router-dom';
import NavBar from '../component/navbar';
function RootLayout() {
  const links = [
    [
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
    <>
      <NavBar links={links} />
      <Outlet />
    </>
  );
}
export default RootLayout;
