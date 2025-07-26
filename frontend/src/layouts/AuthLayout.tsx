import Header from '../components/Header/Header'
import { Outlet } from 'react-router'
import Footer from '../components/Footer/Footer';
import {UserProvider} from "../context/userContext/usercontext";
export default function Layout() {
  
  return (
    <UserProvider>
      <Header/>
      <Outlet/>
      <Footer/>
    </UserProvider>
  )
}
