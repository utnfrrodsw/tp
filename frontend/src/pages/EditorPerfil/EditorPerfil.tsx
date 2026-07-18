import styles from "./EditorPerfil.module.css";
import { useEffect,useState } from "react";
import Nav from "./../Nav/Nav";
import { parseJwt } from "../App/App";
import  type {UserProfile}  from "../../types/types";
import { Dialog,  DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogPortal } from "@/components/ui/dialog";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from "@/components/ui/button";
import AlertSuccess from "@/components/Alert/AlertSuccess";
import Alert from "@/components/Alert/Alert";
import { useNavigate } from "react-router-dom";





const EditorPerfil = () =>{
    const [usuario, setUsuario] = useState<UserProfile | null>(null);
    const [modalPic, setModalPic] = useState<boolean>(false);
    const [preview, setPreview] = useState<string | null>(null);    
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [foto, setFoto] = useState<File | null>(null);
    const [modalPass, setModalPass] = useState<boolean>(false);

    const navigate = useNavigate();

    const changeModalPass = () => {
      setModalPass(true);
    }
    const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFoto(file);                              // ← guardá el File
        setPreview(URL.createObjectURL(file));      // ← esto solo es para mostrar
    };

    const removePhoto = () => {
      setPreview(null);
    };

    const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      const formData = new FormData();
      formData.append('username', (document.getElementById('username') as HTMLInputElement).value);
      formData.append('email', (document.getElementById('email') as HTMLInputElement).value);
      if (foto) {
        formData.append('foto', foto); // ← el File real, no el blob URL
      }

      try {
        const response = await fetch(
          `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/users/update/${usuario?.id_user}`,
          {
            method: 'PUT',
            body: formData,
          }
        );

        const {user, success} = await response.json();
        if (!response.ok) {
          throw new Error('Error al guardar cambios');
        }
        setUsuario(user);
        setSuccess(success);
      } catch (e) {
        console.error('Error al guardar cambios:', e);
        setError(e instanceof Error ? e.message : 'Error desconocido');
      }
};


    useEffect(() => {
        const cargarPerfil = async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No hay token');
    
            const decoded = parseJwt(token);
            if (!decoded?.id_user) throw new Error('Token inválido');
    
            const response = await fetch(
              `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/users/verifica/${decoded.id_user}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (!response.ok) throw new Error(`Error ${response.status}`);
    
            const data: UserProfile = await response.json();
            if (!data) throw new Error('Usuario no encontrado');
    
            setUsuario(data);
          } catch (e) {
            console.error('Error al cargar perfil:', e);
          }
        };
        
        cargarPerfil();
      }, []);
  const changeModalPic = () => {
    setModalPic(true);
  };

    return(
        <><Nav />
        <div className={styles.container}>
           <div className={styles.card}>
              {success && <AlertSuccess message={success} />}
              {success && <button type="button" className={styles.confirmButton}  onClick={() => navigate('/home')}>Inicio</button>}
              {error && <Alert message={error} />}
              <h1 className={styles.title}>Edicion de Perfil</h1>
              <form onSubmit={handleSaveChanges}>
                <div className={styles.cardForm}>            
                  <div className={styles.group}>
                    <label className={styles.subtitle}>Foto de perfil</label>
                    <img
                      src={preview ?? usuario?.urlPicture}
                      alt={usuario?.userName}
                      className={styles.avatarRoot}
                    />
                    <button type="button" className={styles.button2} onClick={changeModalPic}>Cambiar foto</button>
                  </div>
                </div>  
                <Dialog open={modalPic} onOpenChange={setModalPic}>
                  <DialogPortal >
                    <DialogContent className={styles.dialogContent} showCloseButton={false}>
                      <DialogHeader className={styles.dialog}>
                        <DialogTitle>Cambiar foto de perfil</DialogTitle>

                        <VisuallyHidden>
                          <DialogDescription>
                            Seleccioná una imagen para actualizar tu foto de perfil
                          </DialogDescription>
                        </VisuallyHidden>
                      </DialogHeader>

                      <div className={styles.group}>
                        <label className={styles.label} style={{ textAlign: 'center' }}>
                          Foto de perfil
                        </label>

                        {preview ? (
                          <div className={styles.previewWrap}>
                            <img
                              src={preview}
                              alt="Preview"
                              className={styles.preview}
                            />

                            <button
                              type="button"
                              className={styles.removeBtn}
                              onClick={removePhoto}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <label
                            className={styles.dropZone}
                            htmlFor="file-input"
                          >
                            <span className={styles.dropZoneIcon}>📷</span>

                            <span className={styles.dropZoneText}>
                              Hacé clic para subir una imagen
                            </span>
                          </label>
                        )}

                        <input
                          type="file"
                          id="file-input"
                          className={styles.fileInput}
                          onChange={handleFoto}
                        />
                      </div>
                    </DialogContent>
                  </DialogPortal>
                </Dialog>
                <Dialog open={modalPass} onOpenChange={setModalPass}>
                  <DialogPortal >
                    <DialogContent className={styles.dialogContentPass} showCloseButton={false}>
                      <DialogHeader className={styles.dialogPass}>
                        <DialogTitle className={styles.dialogTitle}>Cambio de contraseña</DialogTitle>
                        <DialogDescription className={styles.dialogDescriptionPass}>
                          Para cambiar tu contraseña tendra que ingresar un email al cual le llegara un enlace para restablecerla. A continuacion 
                          debes hacer click en el boton "Comenzar restablecimiento" para seguir el procedimiento. 
                        </DialogDescription>
                      </DialogHeader>
                    <button type="button" className={styles.button3} onClick={() => {
                      setModalPass(false);
                      navigate(`/forgot-password`);
                      }}>Comenzar restablecimiento</button>
                      </DialogContent>
                  </DialogPortal>
                </Dialog>

                <div className={styles.cardForm}>
                  <div className={styles.group}>
                    <label className={styles.subtitle} style={{ fontSize: '1.2rem' }}>
                      Datos personales
                    </label>
                    <label className={styles.label}>Nombre de usuario</label>
                    <input type="text" id="username" className={styles.input} defaultValue={usuario?.userName} />
                    <label className={styles.label}>Correo electrónico</label>
                    <input type="email" id="email" className={styles.input} defaultValue={usuario?.email} />
                    <button type="button" className={styles.linkButton} onClick={changeModalPass}>
                      Modificar contraseña
                    </button>
                  </div>
                </div>
                <Button className={styles.button2} style={{ marginTop: '20px' }} type="submit">
                  Guardar cambios
                </Button>
              </form>
            </div>
        </div>
        </>
    )
}
export default EditorPerfil;
