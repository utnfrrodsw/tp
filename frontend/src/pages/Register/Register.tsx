import styles from "./Register.module.css";
import { useState } from "react";
import Alert from "../../components/Alert/Alert";
import AlertSuccess from "../../components/Alert/AlertSuccess";
import { BACKEND_URL } from '@/lib/config';
import CustomButton1 from "../../components/Common/Buttons/Button1";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { X, Camera } from "lucide-react";
import { uploadFoto } from "@/lib/upload";

type FieldErrors = {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    foto?: string;
};

type Touched = {
    username: boolean;
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
};

const MAX_FOTO_MB = 2;

const Register = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [foto, setFoto] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [touched, setTouched] = useState<Touched>({
        username: false,
        email: false,
        password: false,
        confirmPassword: false,
    });
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [isRegistered, setIsRegistered] = useState<boolean>(false);

    const markTouched = (field: keyof Touched) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    // Cuando el usuario elige una imagen, generamos preview local
    const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_FOTO_MB * 1024 * 1024) {
            setFieldErrors((prev) => ({ ...prev, foto: `La imagen no puede superar ${MAX_FOTO_MB} MB` }));
            return;
        }

        setFieldErrors((prev) => ({ ...prev, foto: undefined }));
        setFoto(file);
        setPreview(URL.createObjectURL(file));
    };

    const removePhoto = () => {
        setFoto(null);
        setPreview(null);
        setFieldErrors((prev) => ({ ...prev, foto: undefined }));
    };

    const validate = (): boolean => {
        const errors: FieldErrors = {};

        if (!username.trim()) {
            errors.username = 'Ingresá un usuario';
        } else if (username.trim().length < 3) {
            errors.username = 'Debe tener al menos 3 caracteres';
        }

        if (!email.trim()) {
            errors.email = 'Ingresá tu email';
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            errors.email = 'Ingresá un email válido';
        }

        if (!password) {
            errors.password = 'Ingresá una contraseña';
        } else if (password.length < 8) {
            errors.password = 'Debe tener al menos 8 caracteres';
        }

        if (!confirmPassword) {
            errors.confirmPassword = 'Confirmá tu contraseña';
        } else if (confirmPassword !== password) {
            errors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setFieldErrors((prev) => ({ ...prev, ...errors }));
        setTouched({ username: true, email: true, password: true, confirmPassword: true });

        return Object.keys(errors).length === 0;
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!validate()) return;

        setSubmitting(true);

        try {
            let urlPicture: string | undefined;

            if (foto) {
                const uploadResult = await uploadFoto(foto);
                urlPicture = uploadResult.url;
            }

            const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: username.trim(),
                    email: email.trim(),
                    password,
                    urlPicture,
                }),
            });

            const result = await response.json();

            if (response.ok && result.message === 'Usuario registrado exitosamente, valida tu cuenta a través del enlace enviado a tu correo electrónico') {
                setIsRegistered(true);
            } else {
                setError(result.message || 'Error en el registro');
            }
        } catch (error) {
            console.error("Error:", error);

            setError(
                error instanceof Error
                    ? error.message
                    : "No se pudo completar el registro"
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Helpers para el estado visual de cada input (neutro / error / válido)
    const usernameState = !touched.username ? '' : fieldErrors.username ? styles.inputError : styles.inputValid;
    const emailState = !touched.email ? '' : fieldErrors.email ? styles.inputError : styles.inputValid;
    const passwordState = !touched.password ? '' : fieldErrors.password ? styles.inputError : styles.inputValid;
    const confirmState = !touched.confirmPassword ? '' : fieldErrors.confirmPassword ? styles.inputError : styles.inputValid;

    return (
        <div className={styles.container}>
            {isRegistered ? (
                <div className={styles.card}>
                    <div className={styles.successWrapper}>
                        <AlertSuccess message="¡Registro exitoso! Revisá tu email." />
                        <p className={styles.successText}>
                            Te enviamos un enlace de confirmación para activar tu cuenta.
                        </p>
                        <CustomButton1
                            onClick={() => window.location.href = '/login'}
                            text="Ir al Login"
                        />
                    </div>
                </div>
            ) : (
                <div className={styles.card}>
                    <h1 className={styles.title}>Crear Cuenta</h1>
                    <p className={styles.subtitle}>Regístrate para gestionar el taller</p>

                    {error && <Alert message={error} />}

                    <form className={styles.form} onSubmit={handleRegister} noValidate>

                        {/* ── Foto de perfil ── */}
                        <div className={styles.group}>
                            <label className={styles.label}>
                                Foto de perfil <span className={styles.optionalTag}>(opcional)</span>
                            </label>

                            {preview ? (
                                <div className={styles.previewWrap}>
                                    <img src={preview} alt="Preview foto de perfil" className={styles.preview} />
                                    <button type="button" className={styles.removeBtn} onClick={removePhoto}><X size={16} /></button>
                                </div>
                            ) : (
                                <label className={styles.dropZone} htmlFor="file-input">
                                    <span className={styles.dropZoneIcon}><Camera size={30} /></span>
                                    <span className={styles.dropZoneText}>Hacé clic o arrastrá una imagen</span>
                                    <span className={styles.dropZoneHint}>JPG, PNG o WEBP · máx. {MAX_FOTO_MB} MB</span>
                                </label>
                            )}

                            <input
                                type="file"
                                id="file-input"
                                accept="image/jpeg,image/png,image/webp"
                                className={styles.fileInput}
                                onChange={handleFoto}
                            />
                            {fieldErrors.foto && <span className={styles.errorText}>{fieldErrors.foto}</span>}
                        </div>

                        <div className={styles.group}>
                            <label htmlFor="username" className={styles.label}>Usuario</label>
                            <input
                                type="text"
                                id="username"
                                className={`${styles.input} ${usernameState}`}
                                placeholder="Ej: TomasDev"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    if (touched.username) setFieldErrors((p) => ({ ...p, username: undefined }));
                                }}
                                onBlur={() => markTouched('username')}
                            />
                            {touched.username && fieldErrors.username && (
                                <span className={styles.errorText}>{fieldErrors.username}</span>
                            )}
                        </div>

                        <div className={styles.group}>
                            <label htmlFor="email" className={styles.label}>Email</label>
                            <input
                                type="email"
                                id="email"
                                className={`${styles.input} ${emailState}`}
                                placeholder="correo@ejemplo.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (touched.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                                }}
                                onBlur={() => markTouched('email')}
                            />
                            {touched.email && fieldErrors.email && (
                                <span className={styles.errorText}>{fieldErrors.email}</span>
                            )}
                        </div>

                        <div className={styles.group}>
                            <label htmlFor="password" className={styles.label}>Contraseña</label>
                            <div className={styles.caja_password}>
                                <PasswordInput
                                    id="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (touched.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                                    }}
                                    onBlur={() => markTouched('password')}
                                    className={`${styles.input} ${passwordState}`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {touched.password && fieldErrors.password ? (
                                <span className={styles.errorText}>{fieldErrors.password}</span>
                            ) : (
                                <span className={styles.hintText}>Mínimo 8 caracteres</span>
                            )}
                        </div>

                        <div className={styles.group}>
                            <label htmlFor="confirmPassword" className={styles.label}>Confirmar Contraseña</label>
                            <div className={styles.caja_password}>
                                <PasswordInput
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (touched.confirmPassword) setFieldErrors((p) => ({ ...p, confirmPassword: undefined }));
                                    }}
                                    onBlur={() => markTouched('confirmPassword')}
                                    className={`${styles.input} ${confirmState}`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {touched.confirmPassword && fieldErrors.confirmPassword && (
                                <span className={styles.errorText}>{fieldErrors.confirmPassword}</span>
                            )}
                        </div>

                        <button type="submit" className={styles.button} disabled={submitting}>
                            {submitting ? 'Creando cuenta…' : 'Registrarse'}
                        </button>
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