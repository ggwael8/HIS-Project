import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Appointment from './Pages/Appointment';
import RootLayout from './Pages/RootLayout';
import Profile from './Pages/Profile';
const router = createBrowserRouter([
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

function App() {
  return <RouterProvider router={router} />;
}

export default App;
