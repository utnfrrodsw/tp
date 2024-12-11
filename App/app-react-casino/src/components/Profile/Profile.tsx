import { useState } from 'react';
import { defaultScroll } from "../../libs/globalFunctions.tsx";
import { useDropzone } from 'react-dropzone';
import { useContext } from "react";
import { userContext } from '../../App.tsx';
import axios from '../../libs/axios.tsx'
import { useNavigate } from 'react-router-dom';
import { NavLink as Link } from 'react-router-dom';
import './Profile.css';
import { toast } from 'sonner';

export const Profile = () => {
    const contextData = useContext(userContext);
    defaultScroll()
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(() => {
        return localStorage.getItem('profile-image-url') || null;
    });

    const onDrop = (acceptedFiles: File[]) => {
        setFile(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({ 
        onDrop, 
        accept: { 'image/*': [] }
    });

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const handleLogout = () => {
        const tokenLogout = localStorage.getItem('jwt-token');
        if (tokenLogout) {
            localStorage.removeItem('jwt-token');
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
                    import.meta.env.VITE_PROFILE_IMAGE_URL, 
                    formData
                );
                const imageUrl = response.data.secure_url;
                setImageUrl(imageUrl);
                localStorage.setItem('profile-image-url', imageUrl);

                closeModal();
            } catch (error) {
                toast.error('There was an error uploading the image')

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
                        <h1 className="name">{contextData.username}</h1>
                        <p className="id">ID: {contextData.id_user}</p>
                    </div>
                    <button className="change-button" onClick={openModal}>
                        Change Profile Picture
                    </button>
                </div>
                <nav className="menu">
                    <ul>
                        <li className="menu-item">Profile</li>
                        <Link to='/bettinghistory' className="menu-item">Betting history</Link>
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
                            <input type="text" value={contextData.username || ''} readOnly className="input-field" />
                            <label className="user-details-label">Email</label>
                            <input type="email" value={contextData.email || ''} readOnly className="input-field" />
                            <label className="user-details-label">Phone</label>
                            <input type="tel" value={contextData.phone || ''} readOnly className="input-field" />
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
                            <p>Drag and drop an image here, or click to select one</p>
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
