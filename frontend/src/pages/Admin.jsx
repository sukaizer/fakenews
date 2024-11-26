import React, { useState, useEffect } from 'react';
import api from '../api';

function Admin() {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        const fetchPassword = async () => {
            try {
                const response = await api.get('/api/admin-password/');
                setPassword(response.data.admin_password);
                console.log(response.data);
                
            } catch (error) {
                console.error('Error fetching password:', error);
            }
        };

        fetchPassword();
    }, []);

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handlePasswordUpdate = async () => {
        try {
            await api.patch('/api/admin-password/', { admin_password: newPassword });
            setPassword(newPassword);
            setNewPassword('');
        } catch (error) {
            console.error('Error updating password:', error);
        }
    };

    return (
        <div className="experiment-home">
            <h1>Admin Page</h1>
            <div 
                style={{ display: 'flex', alignItems: 'center' }}
                >
                <p>Current Password : <b>{password}</b></p>
            </div>
            <div>
                <h3>Update Password</h3>
                <input
                    type="text"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    className='feed-form'
                />
                <button onClick={handlePasswordUpdate}>Update Password</button>
            </div>
        </div>
    );
}

export default Admin;