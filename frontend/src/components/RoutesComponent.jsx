import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import Jobs from '../pages/Jobs';
import Applications from '../pages/Applications';
import Notifications from '../pages/Notifications';
import Messages from '../pages/Messages';
import JobOffer from '../pages/JobOffer';
import Contact from '../pages/Contact';
import AdminManagement from '../pages/AdminManagement';
import JobDetails from '../pages/JobDetails';
import HelpPage from '../pages/HelpPage';
import PublicProfile from '../components/PublicProfile';
import SearchResults from '../pages/SearchResults';

import PrivateRoute from './PrivateRoute';

import Navbar from './Navbar';
import Footer from './Footer';
import '../styles/global.css';

function RoutesComponent() {
    const { user } = useContext(AuthContext);

    return (
        <Router>
            <Navbar />
            {user && user.role !== 'guest' && <Messages />}
            <div className="page-container">
                <div className='content-wrap'>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/profile/:userId" element={<PublicProfile />} />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute allowedRoles={['admin', 'employer', 'user']}>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/jobs" element={<Jobs />} />
                        <Route path="/applications" element={<Applications />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route
                            path="/settings"
                            element={
                                <PrivateRoute allowedRoles={['admin', 'employer', 'user']}>
                                    <Settings />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/dashboard" element={
                            <PrivateRoute allowedRoles={['admin', 'employer', 'user']}>
                                <Dashboard />
                            </PrivateRoute>
                            } 
                        />
                        <Route path="/joboffer" element={<JobOffer />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/help" element={<HelpPage />} />
                        <Route path="/jobs/:id" element={<JobDetails />} />
                        <Route
                            path="/admin"
                            element={
                                <PrivateRoute allowedRoles={['admin']}>
                                    <AdminManagement />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/admin/management"
                            element={
                                <PrivateRoute allowedRoles={['admin']}>
                                    <AdminManagement />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/search" element={<SearchResults />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default RoutesComponent;
