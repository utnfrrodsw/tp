import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { NavLink as Link } from 'react-router-dom';
import './Profile.css';

interface ProfileProps {
    id: string;
    username: string;
    email: string;
    phone: string;
    password: string;
}

export const Profile: React.FC<ProfileProps> = ({ id, username, email, phone, password }) => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(() => {
        return localStorage.getItem('profile-image-url') || null; // SE GUARDA TODO EN CLOUDINARY PERO SIN ESTO NO SE GUARDA AL ACTUALIZAR PAGINA!
    });
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const onDrop = (acceptedFiles: File[]) => {
        setFile(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const handleLogout = () => {
        const tokenLogout = localStorage.getItem('jwt-token');
        if (tokenLogout) {
            localStorage.removeItem('jwt-token');
            localStorage.removeItem('profile-image-url');
            navigate('/');
            window.location.reload();
        }
    };

    const handleUpload = async () => {
        if (file) {
            setUploading(true);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'cxjlq0x3'); 
            formData.append('api_key', '165262988318464');

            try {
                const response = await axios.post(
                    'https://api.cloudinary.com/v1_1/dgv9jbhzm/image/upload', 
                    formData
                );
                const imageUrl = response.data.secure_url;
                setImageUrl(imageUrl);
                localStorage.setItem('profile-image-url', imageUrl);

                console.log('Imagen subida correctamente:', imageUrl);

                closeModal();
            } catch (error) {
                console.error('Error al subir la imagen a Cloudinary:', error);
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <section className="profile-container">
            <div className="left-side">
                <div className="profile-header">
                    <img src={imageUrl || "../src/assets/images/avatar-deafault.webp"} alt="User Avatar" className="avatar" />
                    <div className="user-info">
                        <h1 className="name">{username}</h1>
                        <p className="id">ID: {id}</p>
                    </div>
                    <button className="change-button" onClick={openModal}>
                        Change Profile Picture
                    </button>
                </div>
                <nav className="menu">
                    <ul>
                        <li className="menu-item">Profile</li>
                        <Link to='/bettinghistory' className="menu-item">Betting history</Link>
                        <li className="menu-item">Transactions</li>
                        <li className="menu-item">Connections</li>
                    </ul>
                </nav>
                <button className="logout-button" onClick={handleLogout}>
                    Log Out
                </button>
            </div>
            <div className="right-side">
                <div className="user-info-section">
                    <h2 className="section-title font-extrabold">My Profile</h2>
                    <form>
                        <div className="user-details">
                            <label className="user-details-label">Username</label>
                            <input type="text" value={username || ''} readOnly className="input-field" />
                            <label className="user-details-label">Email</label>
                            <input type="email" value={email || ''} readOnly className="input-field" />
                            <label className="user-details-label">Phone</label>
                            <input type="tel" value={phone || ''} readOnly className="input-field" />
                            <label className="user-details-label">New Password</label>
                            <input
                                type="password"
                                placeholder='Enter your new password'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input-field text-gray-900"
                            />
                            <label className="user-details-label">Confirm Password</label>
                            <input
                                type="password"
                                placeholder='Enter your new password again'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-field text-gray-900"
                            />
                            <button type="button" className="change-button" >Change Password</button>
                        </div>
                    </form>
                </div>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Upload New Profile Picture</h2>
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop an image here, or click to select one</p>
                        </div>
                        {file && <p>Selected file: {file.name}</p>}
                        <div className="button-container">
                            <button className="upload-button" onClick={handleUpload} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
                            <button className="cancel-button" onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};
