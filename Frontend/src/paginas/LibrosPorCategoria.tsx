import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import LibroCard from '../componentes/LibroCard';
import { getLibrosPorCategoria } from '../services/libroService';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface Libro {
  id: number;
  titulo: string;
  autor: { nombre: string };
  imagen?: string;
}

export default function LibrosPorCategoria() {
  const { categoriaId } = useParams<{ categoriaId: string }>();
  const location = useLocation();
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibros = async () => {
      if (!categoriaId) return;
      try {
        const data = await getLibrosPorCategoria(Number(categoriaId));
        setLibros(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchLibros();
  }, [categoriaId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <DotLottieReact
          src="https://lottie.host/6d727e71-5a1d-461e-9434-c9e7eb1ae1d1/IWVmdeMHnT.lottie"
          loop
          autoplay
          style={{ width: 140, height: 140 }}
        />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 p-6 dark:from-gray-900 dark:to-gray-800">
      <h2 className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
        Libros por Categoría
      </h2>
      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {libros.map((libro) => (
          <Link
            key={libro.id}
            to={`/libro/${libro.id}`}
            state={{ from: location.pathname }}
            className="block"
          >
            <LibroCard
              title={libro.titulo}
              authors={[libro.autor.nombre]}
              image={libro.imagen || null}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
