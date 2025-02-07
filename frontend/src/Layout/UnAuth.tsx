import { Outlet } from 'react-router';
import { useState, useEffect } from 'react';
import ThemeSwitcher from '../components/Toogle/ThemeSwithcer';


export default function UnAuth() {
 

  return (
    <div>
      <ThemeSwitcher isAuth={false}/>
      <Outlet />
    </div>
  );
}