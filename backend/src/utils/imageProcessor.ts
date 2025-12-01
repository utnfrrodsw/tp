import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url'; //
import { dirname } from 'path'; //

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function processProfileImage(
  inputPath: string,
  userId: number
): Promise<string> {
  const outputDir = path.join(__dirname, '../../public/uploads/profiles');
  //Renombramos la imagen con el id del usuario
  const outputPath = path.join(outputDir, `profile_${userId}.webp`);

  await sharp(inputPath)
    .resize(300, 300, {
      //cambia el tamaño de la imagen
      fit: 'cover',
      position: 'center', //si hay que recortar ,  lo hace desde el centro
    })
    .webp({ quality: 85 }) //cambia el formato a uno más eficiente
    .toFile(outputPath);
  return `/uploads/profiles/profile_${userId}.webp`; // Devuelve la ruta relativa para almacenar en la base de datos
}
