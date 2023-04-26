import { Outlet } from "react-router-dom";
import NavBar from "../component/NavBar";
function RootLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
export default RootLayout;
