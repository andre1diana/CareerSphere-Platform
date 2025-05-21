import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


import { AuthProvider } from './context/AuthContext';
import { UsersProvider } from './context/UsersContext';
import { JobOfferProvider } from './context/JobOfferContext'; 
import RoutesComponent from './components/RoutesComponent';
function App() {
  return (
    <div className='page-container'>
        <AuthProvider>
          <UsersProvider>
          <JobOfferProvider>
            <RoutesComponent />
          </JobOfferProvider>
          </UsersProvider>
        </AuthProvider>
    </div>
  );
}

export default App;
