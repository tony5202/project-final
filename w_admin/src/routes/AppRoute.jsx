import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../pages/Login';
import Booking from '../pages/Supper_admin/Booking';
import Product from '../pages/Supper_admin/Product';
import Stadil from '../pages/Supper_admin/Stadium';
import Employee from '../pages/Supper_admin/Employee';
import LayOut_Admin from '../LayOut/LayOut_Admin';
import Dasboard from '../pages/Dasboard';
import Checkin from '../pages/Admin/Checkin';
import Reports from '../LayOut/Reports';
import Sela from '../LayOut/Sela';
import SaleProduct from '../pages/Admin/Sale/SaleProduct';
import Playment from '../pages/Admin/Sale/Playment';
import Report_user from '../pages/Admin/Reports/Report_user';
import Income_statement from '../pages/Admin/Reports/Income_statement';
import Report_booking from '../pages/Admin/Reports/Report_booking';
import Report_checkIn from '../pages/Admin/Reports/Report_checkIn';
import Report_product from '../pages/Admin/Reports/Report_product';
import Expen from '../pages/Expen';
import Expenditure_report from '../pages/Admin/Reports/Expenditure_report';
import LayOut_icome from '../LayOut/LayOut_icome';
import Icome_stadium from '../pages/Admin/Reports/Icome_stadium';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/home',
    element: <Dasboard />,
  },
  {
    path: '/expen',
    element: <Expen />,
  },
  {
    path: '/admin',
    element: <LayOut_Admin />,
    children: [
      { index: true, element: <Employee /> },
      { path: 'booking', element: <Booking /> },
      { path: 'stadil', element: <Stadil /> },
      { path: 'product', element: <Product /> },
    ],
  },
  {
    path: '/checkin',
    element: <Checkin />,
    children: [
      { index: true, element: <Employee /> },
    ],
  },
  {
    path: '/sale',
    element: <SaleProduct />,
  },
  {
    path: '/report',
    element: <Reports />, // Layout หลักของ report
    children: [
      { index: true, element: <Report_user /> },
      { path: 'expenditure', element: <Expenditure_report /> },
      
      {
        path: 'income',
        element:<LayOut_icome/>,
      children: [
        { index: true, element: <Income_statement /> }, 
      
        { path: 'income_stadium', element: <Icome_stadium /> },
        { path: 'expenditure', element: <Expenditure_report /> },

      ]
 },
  
      { path: 'booking', element: <Report_booking /> },
      { path: 'checkin', element: <Report_checkIn /> },
      { path: 'product', element: <Report_product /> },
    ],
  }
  

]);

const AppRoute = () => {
  return <RouterProvider router={router} />;
};

export default AppRoute;