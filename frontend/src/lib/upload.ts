import { BACKEND_URL } from '@/lib/config';

export const uploadFoto = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BACKEND_URL}/api/uploads`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Error al subir la imagen");
  }

  return result;
};