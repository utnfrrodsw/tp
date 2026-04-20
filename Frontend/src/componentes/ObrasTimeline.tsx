import React, { useMemo } from 'react';
import { Chrono } from 'react-chrono';
import { GoogleBooksVolume, extractPublicationYear } from '../services/googleBooksService';

interface ObrasTimelineProps {
  works: GoogleBooksVolume[];
  authorName: string;
}

const ObrasTimeline: React.FC<ObrasTimelineProps> = ({ works, authorName }) => {
  // Preparar datos para el timeline
  const timelineItems = useMemo(() => {
    // Filtrar obras con fecha y ordenar por fecha
    const worksWithDate = works
      .filter(work => work.volumeInfo.publishedDate)
      .map(work => ({
        ...work,
        year: extractPublicationYear(work.volumeInfo.publishedDate)
      }))
      .filter(work => work.year !== null)
      .sort((a, b) => (a.year || 0) - (b.year || 0));

    // Convertir a formato de react-chrono
    return worksWithDate.map(work => ({
      title: work.year?.toString() || '',
      cardTitle: work.volumeInfo.title,
      cardSubtitle: work.volumeInfo.publisher || '',
      cardDetailedText: work.volumeInfo.description 
        ? work.volumeInfo.description.substring(0, 200) + '...'
        : 'Sin descripción disponible',
      media: work.volumeInfo.imageLinks?.thumbnail 
        ? {
            type: 'IMAGE' as const,
            source: {
              url: work.volumeInfo.imageLinks.thumbnail.replace('http:', 'https:')
            }
          }
        : undefined
    }));
  }, [works]);

  if (timelineItems.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow text-center">
        <p className="text-gray-600">No hay información de fechas de publicación disponible para crear un timeline.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        📚 Línea de tiempo de obras de {authorName}
      </h3>
      
      <div className="relative">
        <Chrono
          items={timelineItems}
          mode="VERTICAL_ALTERNATING"
          theme={{
            primary: '#0ea5e9',
            secondary: '#f0f9ff',
            cardBgColor: '#ffffff',
            titleColor: '#0369a1',
            titleColorActive: '#0c4a6e',
          }}
          cardHeight={150}
          scrollable={{ scrollbar: false }}
          useReadMore={false}
          fontSizes={{
            cardSubtitle: '0.85rem',
            cardText: '0.8rem',
            cardTitle: '1rem',
            title: '1rem',
          }}
        />
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        {timelineItems.length} de {works.length} obras con fecha de publicación
      </div>
    </div>
  );
};

export default ObrasTimeline;
