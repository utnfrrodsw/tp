import { useRef, useState } from "react";
import { defaultScroll } from "../../../libs/globalFunctions.tsx";
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';
import './Help.css';

export function Help() {
    defaultScroll()
    

    const form = useRef<HTMLFormElement | null>(null);
    const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        emailjs
            .sendForm(import.meta.env.VITE_SERIVICE_ID_HELP, import.meta.env.VITE_TEMPLATE_ID_HELP, form.current!, {
                publicKey: import.meta.env.VITE_PUBLIC_KEY_HELP,
            })
            .then(
                () => {
                    return toast.success('Mail enviado con éxito!');
                },
                (error) => {
                    return toast.error(error, { description: 'Ocurrió un error al enviar el Mail' });
                },
            );
    };

    const [formData, setFormData] = useState({ user_name: "", user_email: "", message: "" });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    return (
        <>
            <div className="help-container">
                <h1 className="help-title">Contact Us</h1>
                <form ref={form} onSubmit={sendEmail} className="help-form">
                    <label className="help-label">Name</label>
                    <div className="input-container">
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Your Name"
                            name="user_name"
                            value={formData.user_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <label className="help-label">Your Email</label>
                    <div className="input-container">
                        <input
                            type="email"
                            className="input-field"
                            placeholder="name@utimban.com"
                            name="user_email"
                            value={formData.user_email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <label className="help-label">Message</label>
                    <textarea
                        rows={4}
                        className="textarea-field"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                    <input type="submit" className="submit-button" value="Send" />
                </form>
            </div>
        </>
    );
}
