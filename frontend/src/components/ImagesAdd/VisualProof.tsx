import { useRef, useState } from "react";
import { Camera, X, Loader2 } from "lucide-react";
import styles from "./VisualProof.module.css";
import { uploadFoto } from "@/lib/upload";

interface VisualProofProps {
  value: string | null;

  onChange: (url: string | null) => void;
}

const VisualProof = ({ value, onChange }: VisualProofProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const displayedImage = localPreview ?? value;

  const uploadFile = async (file: File) => {
    setError(null);

    // Preview local inmediato
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setUploading(true);

    try {
      const result = await uploadFoto(file);

      // El backend devuelve { id, url }
      onChange(result.url);
    } catch (err) {
      console.error("Error al subir foto:", err);

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo subir la foto. Probá de nuevo."
      );

      setLocalPreview(null);
      onChange(null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile(file);
    e.target.value = ""; // Permite seleccionar nuevamente el mismo archivo
  };

  const handleRemove = () => {
    setLocalPreview(null);
    setError(null);
    onChange(null);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Prueba visual</h3>
          <p className={styles.subtitle}>
            Subí o tomá una foto del estado actual y cualquier daño visible.
          </p>
        </div>
        <Camera size={22} className={styles.headerIcon} />
      </div>

      <div className={styles.dropzone}>
        {displayedImage ? (
          <div className={styles.previewWrap}>
            <img
              src={displayedImage}
              alt="Foto del equipo"
              className={styles.previewImg}
            />

            {uploading && (
              <div className={styles.uploadingOverlay}>
                <Loader2 size={22} className={styles.spinner} />
              </div>
            )}
            {!uploading && (
              <button
                type="button"
                className={styles.removeBtn}
                onClick={handleRemove}
                aria-label="Quitar foto"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Camera size={28} />
            <span>Ninguna foto seleccionada</span>
          </div>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.buttonsRow}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          Elegir archivo
        </button>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => cameraInputRef.current?.click()}
          disabled={uploading}
        >
          Tomar foto
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default VisualProof;