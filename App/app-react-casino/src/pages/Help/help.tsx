import { useEffect, useRef, useState } from "react";
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';

export function Help() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const form = useRef<HTMLFormElement | null>(null);
    const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        emailjs
            .sendForm('service_ypyb48j', 'template_iejz0rb', form.current!, {
                publicKey: 'cO0nIpEJQcJ5Fdgqc',
            })
            .then(
                () => {
                    console.log('SUCCESS');
                    return toast.success('Mail enviado con éxito!');
                },
                (error) => {
                    console.log('FAILED', error.text);
                    return toast.error('Ocurrió un error al enviar el Mail');
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
            <div className="mt-[100px] p-5">
                <h1 className="text-2xl font-bold">Contact Us</h1>
                <form ref={form} onSubmit={sendEmail} className="max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto p-5 bg-[#23222F] rounded-lg">
                    <label className="block mb-1 text-sm font-medium pt-2">Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                            </svg>
                        </div>
                        <input type="text" className="border border-gray-300 text-gray-900 bg-[#fafafa] text-sm rounded-lg block w-full ps-10 p-2.5" placeholder="Your Name" name="user_name" value={formData.user_name} onChange={handleChange} required />
                    </div>
                    <label className="block mb-1 text-sm font-medium pt-2">Your Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                                <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                            </svg>
                        </div>
                        <input type="email" className="border border-gray-300 text-gray-900 text-sm bg-[#fafafa] rounded-lg block w-full ps-10 p-2.5" placeholder="name@utimban.com" name="user_email" value={formData.user_email} onChange={handleChange} required />
                    </div>
                    <label className="block mb-1 text-sm font-medium pt-2">Message</label>
                    <textarea rows={4} className="block p-2.5 w-full text-gray-900 text-sm bg-[#fafafa] rounded-lg border border-gray-300" name="message" value={formData.message} onChange={handleChange} required />
                    <input type="submit" className="flex m-auto w-full items-center p-2 mt-2 focus:outline-none bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 cursor-pointer" value="Send" />
                </form>
            </div>
        </>
    );
}
