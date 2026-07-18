// Register.tsx
import styles from "./Register.module.css";
import { useState } from "react";
import Alert from "../../components/Alert/Alert";
import AlertSuccess from "../../components/Alert/AlertSuccess";
import CustomButton1 from "../../components/Buttons/Button1";
import { PasswordInput } from "../../components/ui/PasswordInput";

const Register = () => {
    const [username, setUsername]               = useState<string>('');
    const [email, setEmail]                     = useState<string>('');
    const [password, setPassword]               = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [foto, setFoto]                       = useState<File | null>(null);
    const [preview, setPreview]                 = useState<string | null>(null);
    const [error, setError]                     = useState<string | null>(null);
    const [, setSuccess]                        = useState<string | null>(null);    
    const [isRegistered, setIsRegistered]       = useState<boolean>(false);


    // Cuando el usuario elige una imagen, generamos preview local
    const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
    };

    const removePhoto = () => {
    setPreview(null);
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        //  FormData en lugar de JSON porque enviamos un archivo
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        if (foto) {
            formData.append('foto', foto); 
        }

        try {
            const response = await fetch(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/auth/Register`, {
                method: 'POST',
                body: formData,
                //  Sin Content-Type — el browser lo setea solo con el boundary correcto
            });

            const result = await response.json();

            if (response.ok && result.message === 'Usuario registrado exitosamente, valida tu cuenta a través del enlace enviado a tu correo electrónico') {
                setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
                setIsRegistered(true);
            } else {
                setError(result.message || 'Error en el registro');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('No se pudo conectar con el servidor');
        }
    };

    return (
        <div className={styles.container}>
            {isRegistered ? (
                <div className={styles.successWrapper}>
                    <AlertSuccess message="¡Registro exitoso! Revisa tu email." />
                    <p>Hemos enviado un enlace de confirmación.</p>
                    <CustomButton1
                        onClick={() => window.location.href = '/login'}
                        text="Ir al Login"
                    />
                </div>
            ) : (
                <div className={styles.card}>
                    <h1 className={styles.title}>Crear Cuenta</h1>
                    <p className={styles.subtitle}>Regístrate para gestionar el taller</p>

                    {error && <Alert message={error} />}

                    <form className={styles.form} onSubmit={handleRegister}>

                        {/* ── Foto de perfil ── */}
                            <div className={styles.group}>
                                <label className={styles.label}>
                                    Foto de perfil <span style={{ fontWeight: 400, color: '#9ca3af' }}>(opcional)</span>
                                </label>

                                {preview ? (
                                    <div className={styles.previewWrap}>
                                    <img src={preview} alt="Preview foto de perfil" className={styles.preview} />
                                    <button type="button" className={styles.removeBtn} onClick={removePhoto}>✕</button>
                                    </div>
                                ) : (
                                    <label className={styles.dropZone} htmlFor="file-input">
                                    <span className={styles.dropZoneIcon}>📷</span>
                                    <span className={styles.dropZoneText}>Hacé clic o arrastrá una imagen</span>
                                    <span className={styles.dropZoneHint}>JPG, PNG o WEBP · máx. 2 MB</span>
                                    </label>
                                )}

                                <input
                                    type="file"
                                    id="file-input"
                                    accept="image/jpeg,image/png,image/webp"
                                    className={styles.fileInput}
                                    onChange={handleFoto}
                                />
                            </div>

                        <div className={styles.group}>
                            <label htmlFor="username" className={styles.label}>Usuario</label>
                            <input
                                type="text"
                                id="username"
                                className={styles.input}
                                placeholder="Ej: TomasDev"
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.group}>
                            <label htmlFor="email" className={styles.label}>Email</label>
                            <input
                                type="email"
                                id="email"
                                className={styles.input}
                                placeholder="correo@ejemplo.com"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.group}>
                            <label htmlFor="password" className={styles.label}>Contraseña</label>
                            <div className={styles.caja_password}>
                                <PasswordInput
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={password.length >=8 ? styles.input_green : styles.input_red}
                                    required
                                    placeholder="••••••••"
                                    />
                            </div>
                        </div>

                        <div className={styles.group}>
                            <label htmlFor="confirmPassword" className={styles.label}>Confirmar Contraseña</label>
                            <div className={styles.caja_password}>
                                <PasswordInput
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={confirmPassword === password ? styles.input_green : styles.input_red}
                                    required
                                    placeholder="••••••••"
                                    />
                            </div>
                        </div>

                        <button type="submit" className={styles.button}>Registrarse</button>
                    </form>

                    <div className={styles.footer}>
                        <span>¿Ya tienes cuenta?</span>
                        <a href="/login" className={styles.link}>Inicia sesión</a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;
