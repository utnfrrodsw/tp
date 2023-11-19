const Recomendacion = require('../models/recomendacion');


exports.createRecomendacion = async (req, res) => {
//     const fs = require('fs');
// const Papa = require('papaparse');
// const natural = require('natural');

// // Cargar el archivo CSV
// const csvFilePath = '/Users/bautistaguerra/Documents/source/TP-TTADS/tp-backend/nospeak-api-node/data_songs.csv';
// const data = fs.readFileSync(csvFilePath, 'utf8');
// let parsedData = Papa.parse(data, { header: true }).data;

// // parsedData.forEach(item => {
// //     // Limpia la cadena y formatea como JSON
// //     item['Genre'] = JSON.parse(`[${item['Genre'].replace(/'/g, '"')}]`);
// // });

// parsedData = parsedData.filter(item => {
//     // Verificar si el campo "Genre" no es undefined y no contiene comillas dobles en el medio
//     return item['Genre'] !== undefined && !item['Genre'].includes('""');
// });

// // Obtener el arreglo de nombres de canciones desde la solicitud POST
// const songNames = req.body.song_names;

// // Función para calcular similitud de género entre dos canciones
// function calculateGenreSimilarity(song1, song2) {
//     const genre1 = JSON.parse(song1.Genre);
//     const genre2 = JSON.parse(song2.Genre);
    
//     // Usar Jaccard Index para calcular similitud de género
//     const jaccard = natural.JaccardIndex(genre1, genre2);
//     return jaccard;
// }

// // Función para obtener recomendaciones basadas en género
// function getGenreBasedRecommendations(songNames) {
//     const recommendations = [];
    
//     // Iterar sobre las canciones de entrada
//     for (const inputSongName of songNames) {
//         // Encontrar la canción de entrada en los datos
//         const inputSong = parsedData.find(song => song['Track Name'] === inputSongName);
        
//         if (inputSong) {
//             // Calcular similitud de género con otras canciones
//             const genreSimilarities = parsedData.map(song => ({
//                 trackName: song['Track Name'],
//                 similarity: calculateGenreSimilarity(inputSong, song),
//             }));
            
//             // Ordenar por similitud descendente y filtrar la canción de entrada
//             const sortedSimilarities = genreSimilarities
//                 .filter(song => song.trackName !== inputSongName)
//                 .sort((a, b) => b.similarity - a.similarity);
            
//             // Tomar las 10 canciones más similares
//             const topRecommendations = sortedSimilarities.slice(0, 10).map(song => ({
//                 titulo: song.trackName,
//                 similitud: song.similarity,
//             }));
            
//             recommendations.push({
//                 inputSong: inputSongName,
//                 recommendations: topRecommendations,
//             });
//         }
//     }
    
//     return recommendations;
// }

// // Obtener recomendaciones para las canciones proporcionadas en la solicitud
// const recommendations = getGenreBasedRecommendations(songNames);

// // Devolver las recomendaciones como respuesta
// res.json({ recommendations });

};
