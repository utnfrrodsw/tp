import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
}

const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-gray-700', 'bg-amber-600', 'bg-green-500', 'bg-indigo-500', 'bg-red-500'];

const mockCategorias: Categoria[] = [
  { id: -1, nombre: 'Fantasy', descripcion: 'Narrativas que incluyen magia, criaturas míticas y mundos imaginarios.', imagen: 'https://i0.wp.com/xn--oo-yjab.cl/wp-content/uploads/2020/06/oso-polar-definicion-genero-de-la-fantasia.jpg?fit=980%2C589&ssl=1' },
  { id: -2, nombre: 'Fiction', descripcion: 'Historias basadas en futuros imaginados, tecnología avanzada y conceptos científicos.', imagen: 'https://yosoytuprofe.20minutos.es/wp-content/uploads/2022/11/peliculas-de-ciencia-ficcion.png' },
  { id: -3, nombre: 'Mystery', descripcion: 'Relatos de crimen, investigación y tramas que mantienen la intriga hasta el final.', imagen: 'https://i.blogs.es/9ad7ec/a-haunting-in-venice-2023-dolby-poster-z7-2560x1700/500_333.jpeg' },
  { id: -4, nombre: 'Romance', descripcion: 'Historias centradas en relaciones amorosas y su desarrollo.', imagen: 'https://alfayomega.es/wp-content/uploads/2019/01/TriunfoAmor1.jpg' },
  { id: -5, nombre: 'Comics & Graphic Novels', descripcion: 'Narrativa contada a través de viñetas e ilustraciones, incluyendo manga.', imagen: 'https://i.blogs.es/fded1e/erik-mclean-27kcu7bxgei-unsplash/500_333.webp' },
  { id: -6, nombre: 'History', descripcion: 'Libros de no ficción que exploran eventos, épocas y figuras del pasado.', imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/The_Intervention_of_the_Sabine_Women.jpg/500px-The_Intervention_of_the_Sabine_Women.jpg' },
  { id: -7, nombre: 'Self-Help', descripcion: 'Textos enfocados en el desarrollo personal, el bienestar psicológico y la salud.', imagen: 'https://s3.abcstatics.com/media/bienestar/2021/09/25/contra-la-autoayuda-k9cG--1248x698@abc.jpg' },
  { id: -8, nombre: 'Technology', descripcion: 'Guías, manuales y análisis sobre software, programación y tecnología.', imagen: 'https://media.licdn.com/dms/image/v2/C4D12AQHbZlpFTZ0JOQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1618508672269?e=2147483647&v=beta&t=J_BbUqPwVDGgiP8PfXix6kNrxGAn7HkdJPJMbzfuqn0' },
  { id: -9, nombre: 'Cooking', descripcion: 'Libros de recetas y textos sobre las artes culinarias y la gastronomía.', imagen: 'https://bansalgroup-assets.s3.ap-south-1.amazonaws.com/PRD/BansalOilAndFoods/2022/12/scale.jpg' },
  { id: -10, nombre: 'Economics', descripcion: 'Libros sobre finanzas, gestión, emprendimiento y teoría económica.', imagen: 'https://media.ambito.com/p/67b2bd94651dd61779a00fc63635e326/adjuntos/239/imagenes/039/809/0039809734/1200x675/smart/economia-del-conocimientojpg.jpg' },
];

export const CategoriasPage: React.FC = () => {
  // Usamos directamente las categorías mockeadas para la búsqueda en Google Books.
  // La llamada a getCategorias() se elimina para desacoplar esta página del backend.
  const [categorias] = useState<Categoria[]>(mockCategorias);

  // La categoría "Sin categoría" del backend se puede gestionar en otra parte,
  // como un panel de administración, si es necesario.

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-700 via-blue-600 to-indigo-700 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400">
                  Categorías
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Descubre libros organizados por categorías
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categorias.map((categoria, index) => (            
            <Link 
              key={categoria.id}
              to={`/libros?filtro=tema&termino=${encodeURIComponent(categoria.nombre)}`}
              className="block"
            >
              <motion.div
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 dark:border-gray-700/20 h-full flex flex-col"
                variants={cardVariants}
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="h-56 relative overflow-hidden">
                  <img
                    src={categoria.imagen || ''}
                    alt={categoria.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Error cargando imagen para ${categoria.nombre}: ${categoria.imagen}`);
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className={`${categoria.imagen ? 'hidden' : 'flex'} ${colors[index % colors.length]} items-center justify-center h-full absolute inset-0`}>
                    <Tag className="w-12 h-12 text-white" />
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg leading-tight">{categoria.nombre}</h3>
                    {categoria.descripcion && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 font-medium line-clamp-2">{categoria.descripcion}</p>
                    )}
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-medium mt-2">
                    Explorar categoría →
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
};



/* import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategorias } from '../services/categoriaService';

interface Categoria {
  id: number;
  nombre: string;
}

const CategoriasPage = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCategorias()
      .then(setCategorias)
      .catch((err) => console.error(err));
  }, []);

  const irALibros = (id: number) => {
    navigate(`/categoria/${id}`);
  };

  return (
    <div>
      <h2>Categorías</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {categorias.map((cat) => (
          <li key={cat.id} style={{ margin: '10px 0' }}>
            <button onClick={() => irALibros(cat.id)}>{cat.nombre}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriasPage;
 */