import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store';
import { Provider } from 'react-redux';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import StoreScreen from './screens/StoreScreen.jsx';
import RepairScreen from './screens/RepairScreen.jsx';
import AutoReclaimScreen from './screens/AutoReclaimScreen.jsx';
import ClaimsTreatmentScreen from './screens/ClaimsTreatmentScreen.jsx';
import LandingScreen from './screens/LandingScreen.jsx';
import Product from './screens/Product.jsx';



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='' element={<PrivateRoute />}>
        <Route path='/profile' element={<ProfileScreen />} />
        {/* An example for nested routing in React */} 
        <Route path='/store'>
          <Route index={true} element={<StoreScreen />} />
          <Route path='product' element={<Product />} />
        </Route>
        <Route path='/repair' element={<RepairScreen />} />
        <Route path='/auto_claim' element={<AutoReclaimScreen />} />
        <Route path='/claims_treatment' element={<ClaimsTreatmentScreen />} />
        <Route path='/landing' element={<LandingScreen />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
