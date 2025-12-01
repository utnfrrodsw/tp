// Definición de tipos

export interface ProfilePictureProps {
  src?: string;
  onImageChange: (file: File) => void;
  uploading: boolean;
}

function ProfilePicture({
  src,
  onImageChange,
  uploading,
}: ProfilePictureProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="relative">
        <img
          src={src}
          alt="Foto de perfil"
          className={`w-24 h-24 rounded-full object-cover border-4 border-gray-100 transition-opacity ${
            uploading ? 'opacity-50' : 'opacity-100'
          }`}
        />

        {/* Loading overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}

        <label
          htmlFor="profile-image-input" //
          className={`absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 bg-orange-500 text-white rounded-full p-2 transition-colors ${
            uploading
              ? 'cursor-not-allowed opacity-50 bg-gray-400'
              : 'cursor-pointer hover:bg-orange-600'
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </label>

        <input
          id="profile-image-input" //
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading} //
        />
      </div>
    </div>
  );
}

export default ProfilePicture;
