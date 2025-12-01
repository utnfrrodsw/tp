import DashboardSection from '../DashboardSection/DashboardSection';
import ProfilePicture from '../ProfilePic/ProfilePicture';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usuariosApi } from '../../services/usuariosApi.ts';
import { useProtectRoute } from '../../cookie/useProtectRoute.tsx';
import { Alert, AlertTitle, AlertDescription } from '../Alerts/Alerts.tsx';

// ✅ Updated Zod schema to include photo
const profileSchema = z.object({
  mail: z
    .string()
    .min(1, 'El email es requerido')
    .email('Formato de email inválido')
    .max(100, 'El email no puede exceder 100 caracteres'),
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),
  apellido: z
    .string()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      'El apellido solo puede contener letras'
    ),
  direccion: z
    .string()
    .min(1, 'La dirección es requerida')
    .min(5, 'La dirección debe ser más específica')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  telefono: z
    .string()
    .min(8, 'El número de teléfono debe tener entre 8 y 12 dígitos')
    .max(12, 'El número de teléfono debe tener entre 8 y 12 dígitos')
    .regex(
      /^[1-9][0-9]{7,11}$/,
      'El número de teléfono debe tener entre 8 y 12 dígitos, no puede empezar con 0'
    ),
  foto: z.string().optional(),
  nombreFantasia: z
    .string()
    .min(2, 'El nombre fantasia debe tener al menos 2 caracteres')
    .max(30, 'El nombre fantasia no puede exceder 30 caracteres')
    .optional(),
  descripcion: z
    .string()
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .max(300, 'La descripción no puede exceder 300 caracteres')
    .optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

type PrestadorData = {
  id: number;
  mail: string;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  foto: string;
  nombreFantasia: string;
  descripcion: string;
};

function PerfilSection() {
  // State management
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState<PrestadorData | null>(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<{
    error: string;
    message: string;
  } | null>(null);
  // State para manejar la imagen pendiente de subir
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);

  const { usuario, loading: authLoading } = useProtectRoute(['prestador']);

  // Hook form con validación de Zod
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      mail: '',
      nombre: '',
      apellido: '',
      direccion: '',
      telefono: '',
      foto: '',
      nombreFantasia: '',
      descripcion: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    setValue,
  } = form;

  useEffect(() => {
    if (!authLoading && usuario) {
      fetchPrestador(usuario.id.toString());
    }
  }, [usuario, authLoading]);

  // Actualizar form cuando profileData cambia
  useEffect(() => {
    if (profileData) {
      console.log('Updating form with profile data:', profileData);
      reset({
        mail: profileData.mail || '',
        nombre: profileData.nombre || '',
        apellido: profileData.apellido || '',
        direccion: profileData.direccion || '',
        telefono: profileData.telefono || '',
        foto: profileData.foto || '',
        nombreFantasia: profileData.nombreFantasia || '',
        descripcion: profileData.descripcion || '',
      });
    }
  }, [profileData, reset]);

  const fetchPrestador = async (id: string) => {
    try {
      setError(null);
      console.log('Fetching user with id:', id);

      const response = await usuariosApi.getByIdOnlyInfo(id);
      console.log('API Response:', response);

      if (response.data && response.data.data) {
        setProfileData(response.data.data);
        setDataFetched(true);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error: unknown) {
      console.error('Error fetching prestador data:', error);
      setError(
        error instanceof Error ? error.message : 'Error loading profile data'
      );
      setDataFetched(false);
    }
  };

  // Early returns
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">No autorizado</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  // Maneja cuando se elige una foto nueva
  const handleImageChange = async (file: File) => {
    if (!file) return;

    // Store the file for later upload
    setPendingImageFile(file);

    // Create a temporary URL for preview
    const tempUrl = URL.createObjectURL(file);

    setValue('foto', tempUrl, { shouldDirty: true });
    setProfileData((prev) => (prev ? { ...prev, foto: tempUrl } : null));

    console.log('📸 Image selected, form is now dirty');
  };

  // Handler de submit
  const onSubmit = async (data: ProfileFormData) => {
    try {
      setUpdateError(null);
      setUploading(true);
      console.log('Form data to save:', data);

      let updatedImageUrl = profileData?.foto;
      if (pendingImageFile) {
        console.log('📤 Uploading new image...');
        try {
          const imageResponse = await usuariosApi.uploadProfileImage(
            usuario.id.toString(),
            pendingImageFile
          );

          if (imageResponse.data && imageResponse.data.imageUrl) {
            updatedImageUrl = `${imageResponse.data.imageUrl}?t=${Date.now()}`;
            console.log('✅ Image uploaded successfully:', updatedImageUrl);
          }
        } catch (imageError) {
          console.error('❌ Image upload failed:', imageError);
          throw new Error('Error al subir la imagen');
        }
      }

      const updateData = {
        ...profileData,
        ...data,
        foto: updatedImageUrl, // Use the uploaded image URL
      };
      console.log('Updating user data with:', updateData);
      await usuariosApi.update(usuario.id.toString(), updateData);

      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              ...data,
              foto: updatedImageUrl || prev.foto,
            }
          : null
      );

      setPendingImageFile(null);
      reset({
        ...data,
        foto: updatedImageUrl || data.foto,
      });

      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);

      console.log('Perfile modificado con éxito');
    } catch (error: unknown) {
      console.error('Error modificando perfil:', error);
      const errorResponse = error as {
        response?: { data?: { error?: string; message?: string } };
      };
      setUpdateError({
        error: errorResponse.response?.data?.error || 'Error',
        message:
          errorResponse.response?.data?.message ||
          'Error al actualizar el perfil',
      });
    } finally {
      setUploading(false);
    }
  };

  if (dataFetched && profileData) {
    return (
      <DashboardSection>
        {/* Success Alert - Mobile responsive */}
        {updateSuccess && (
          <Alert
            variant="success"
            className="mb-4 mx-4 sm:max-w-xl sm:mx-auto"
            autoClose={true}
            autoCloseDelay={5000}
            onClose={() => setUpdateSuccess(false)}
          >
            <AlertTitle>¡Perfil actualizado!</AlertTitle>
            <AlertDescription>
              Los datos del perfil se han guardado correctamente.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert - Mobile responsive */}
        {updateError && (
          <Alert
            variant="danger"
            className="mb-4 mx-4 sm:max-w-xl sm:mx-auto"
            onClose={() => setUpdateError(null)}
          >
            <AlertTitle>{updateError.error}</AlertTitle>
            <AlertDescription>{updateError.message}</AlertDescription>
          </Alert>
        )}

        <div className="mx-4 sm:max-w-2xl sm:mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-8">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            <div className="flex justify-center mb-6 sm:mb-8">
              <ProfilePicture
                src={profileData.foto}
                onImageChange={handleImageChange}
                uploading={uploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección de email
              </label>
              <input
                type="email"
                {...register('mail')}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 outline-none text-sm sm:text-base ${
                  errors.mail ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="tu@email.com"
              />
              {errors.mail && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.mail.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  {...register('nombre')}
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 outline-none text-sm sm:text-base ${
                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tu nombre"
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  {...register('apellido')}
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 outline-none text-sm sm:text-base ${
                    errors.apellido ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tu apellido"
                />
                {errors.apellido && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.apellido.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre fantasia
              </label>
              <input
                type="text"
                {...register('nombreFantasia')}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 outline-none text-sm sm:text-base ${
                  errors.nombreFantasia ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Tu nombre fantasia"
              />
              {errors.nombreFantasia && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nombreFantasia.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <input
                type="text"
                {...register('descripcion')}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 outline-none text-sm sm:text-base ${
                  errors.descripcion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Tu descripción"
              />
              {errors.descripcion && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.descripcion.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <input
                type="text"
                {...register('direccion')}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 outline-none text-sm sm:text-base ${
                  errors.direccion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Tu dirección completa"
              />
              {errors.direccion && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.direccion.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                {...register('telefono')}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 outline-none text-sm sm:text-base ${
                  errors.telefono ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+54 11 1234-5678"
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.telefono.message}
                </p>
              )}
            </div>

            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting || (!isDirty && !pendingImageFile)}
                className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                  isSubmitting || (!isDirty && !pendingImageFile)
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600 cursor-pointer'
                }`}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
              </button>

              {!isDirty && !pendingImageFile && (
                <p className="mt-2 text-sm text-gray-500 text-center sm:text-left">
                  No hay cambios para guardar
                </p>
              )}

              {pendingImageFile && (
                <p className="mt-2 text-sm text-naranja-1 text-center sm:text-left">
                  📸 Imagen seleccionada - haz clic en "Guardar cambios" para
                  aplicar
                </p>
              )}
            </div>
          </form>
        </div>
      </DashboardSection>
    );
  } else {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">
          No se pudo cargar la información del perfil
        </div>
      </div>
    );
  }
}

export default PerfilSection;
