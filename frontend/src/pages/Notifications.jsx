import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role === 'guest') {
            navigate('/login');
            return;
        }

        const fetchNotifications = async () => {
            try {
                if (!user.userId) {
                    console.error('User ID is missing:', user);
                    setError('User ID is missing. Please try logging in again.');
                    setLoading(false);
                    return;
                }

                console.log('Fetching notifications for user:', user.userId);
                const response = await axios.get(
                    `http://localhost:8080/api/applications/notifications/${user.userId}`,
                    { withCredentials: true }
                );
                console.log('Notifications received:', response.data);
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error.response?.data || error.message);
                setError('Failed to load notifications');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [user, navigate]);

    if (loading) {
        return <div className="loading">Loading notifications...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="notifications-page">
            <div className="notifications-content">
                <h2>Notifications</h2>
                {notifications.length === 0 ? (
                    <p className="no-notifications">No notifications yet</p>
                ) : (
                    <ul className="notifications-list">
                        {notifications.map(notification => (
                            <li 
                                key={notification.id} 
                                className={`notification ${notification.isRead ? 'read' : 'unread'}`}
                            >
                                <div className="notification-content">
                                    <p>{notification.content}</p>
                                    <small>{new Date(notification.createdAt).toLocaleString()}</small>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Notifications;
