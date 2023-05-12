import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Appointment from './Pages/Appointment';
import RootLayout from './Pages/RootLayout';
import Profile from './Pages/Profile';
import SignUpLogin from './Pages/SignUpLogin';
import SignUpAddress from './Pages/SignUpAddress';
import SignUpPersonal from './Pages/SignUpPersonal';
import SignIn from './Pages/SignIn';
import ForgetPassword from './Pages/ForgetPassword';
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/appointment', element: <Appointment /> },
      { path: '/profile', element: <Profile /> },
      { path: '/signup/login/', element: <SignUpLogin /> },
      { path: '/signup/personal/', element: <SignUpPersonal /> },
      { path: '/signup/address/', element: <SignUpAddress /> },
      { path: '/signin/', element: <SignIn /> },
      { path: '/forgetpassword/', element: <ForgetPassword /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
