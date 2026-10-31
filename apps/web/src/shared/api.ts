const API_URL = 'http://localhost:4000';

// Las consultas leen el JSON tanto en éxito como en error.
export async function requestJson<T>(
  path: string,
  errorMessage: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options);
  const data: T & { error?: string } = await response.json();
  if (!response.ok) throw new Error(data.error || errorMessage);
  return data;
}

// Los borrados no necesitan leer el cuerpo cuando salen bien.
export async function requestDelete(
  path: string,
  errorMessage: string,
  options?: RequestInit
): Promise<void> {
  const response = await fetch(`${API_URL}${path}`, options);
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || errorMessage);
  }
}