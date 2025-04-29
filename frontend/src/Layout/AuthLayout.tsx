<<<<<<< HEAD
import React from 'react'
=======

>>>>>>> 4d81fdd (Saving progress before branch change)
import Header from '../components/Header/Header'
import { Outlet } from 'react-router'
import Footer from '../components/Footer/Footer';
import {UserProvider} from "../context/userContext/usercontext";
export default function Layout() {
<<<<<<< HEAD
=======
  
>>>>>>> 4d81fdd (Saving progress before branch change)
  return (
    <UserProvider>
      <Header/>
      <Outlet/>
<<<<<<< HEAD
      {/* <Footer/> */}
=======
      <Footer/>
>>>>>>> 4d81fdd (Saving progress before branch change)
    </UserProvider>
  )
}
