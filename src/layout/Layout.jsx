import Footer from "../common/Footer/Footer";
import Navbar from "../common/Navbar/Navbar";
import {Outlet} from 'react-router-dom'
export default function Layout() {
  return (
    <>
      <Navbar/>
        <Outlet/>
      <Footer/>

    </>
  )
}
