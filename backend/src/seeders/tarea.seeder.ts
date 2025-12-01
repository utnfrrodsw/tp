// src/seeders/TareaSeeder.ts
import { Seeder } from '@mikro-orm/seeder';
import { faker } from '@faker-js/faker';
import { EntityManager } from '@mikro-orm/core';
import { Tarea } from '../tarea/tarea.entity.js';
import { TipoServicio } from '../tipoServicio/tipoServ.entity.js';

export class TareaSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log(
      'Iniciando TareaSeeder........................................................................................................'
    );

    // Verificar si ya existen tareas
    const existingCount = await em.count(Tarea);
    if (existingCount > 0) {
      console.log(
        `Tarea ya tiene ${existingCount} registros. Omitiendo seeder.`
      );
      return;
    }

    // Traemos todos los tipos de servicio ya creados
    const tipos = await em.find(TipoServicio, {});
    let insertadas = 0;

    for (const tipo of tipos) {
      // Creamos 5 tareas por tipo de servicio
      for (let i = 1; i <= 5; i++) {
        // Creamos nombres y descripciones coherentes
        let nombreTarea = '';
        let descripcionTarea = '';
        switch (tipo.nombreTipo) {
          case 'Limpieza Residencial':
            const tareasLimpiezaRes = [
              {
                nombre: 'Limpieza de cocina',
                desc: 'Limpieza completa de cocina incluyendo mesadas, electrodomésticos, azulejos y pisos',
              },
              {
                nombre: 'Limpieza de baño',
                desc: 'Desinfección y limpieza profunda de sanitarios, azulejos, espejos y accesorios',
              },
              {
                nombre: 'Limpieza de habitaciones',
                desc: 'Aspirado, limpieza de superficies, organización y cambio de ropa de cama',
              },
              {
                nombre: 'Limpieza de sala',
                desc: 'Limpieza de muebles, aspirado de alfombras, limpieza de superficies y decoración',
              },
              {
                nombre: 'Limpieza de ventanas',
                desc: 'Limpieza interior y exterior de cristales, marcos y alféizares',
              },
              {
                nombre: 'Limpieza profunda',
                desc: 'Limpieza integral del hogar incluyendo áreas de difícil acceso y desinfección general',
              },
              {
                nombre: 'Limpieza de fachada',
                desc: 'Lavado y limpieza de la parte exterior de la vivienda',
              },
            ];
            const tareaLimpRes = faker.helpers.arrayElement(tareasLimpiezaRes);
            nombreTarea = tareaLimpRes.nombre;
            descripcionTarea = tareaLimpRes.desc;
            break;
          case 'Limpieza Industrial':
            const tareasLimpiezaInd = [
              {
                nombre: 'Limpieza de musgo',
                desc: 'Eliminación de musgo y hongos en superficies exteriores con productos especializados',
              },
              {
                nombre: 'Limpieza de ventanas en edificios',
                desc: 'Limpieza profesional de ventanales en altura con equipos de seguridad',
              },
              {
                nombre: 'Limpieza profunda de cocinas',
                desc: 'Desengrase y sanitización de cocinas industriales y equipamiento',
              },
              {
                nombre: 'Limpieza de vereda',
                desc: 'Limpieza con hidrolavadora de veredas, patios y superficies de concreto',
              },
              {
                nombre: 'Puesta a tono de exteriores',
                desc: 'Acondicionamiento y limpieza general de espacios exteriores',
              },
            ];
            const tareaLimpInd = faker.helpers.arrayElement(tareasLimpiezaInd);
            nombreTarea = tareaLimpInd.nombre;
            descripcionTarea = tareaLimpInd.desc;
            break;
          case 'Plomería':
            const tareasPlomeria = [
              {
                nombre: 'Reparación de cañerías',
                desc: 'Diagnóstico y reparación de tuberías con fugas o daños estructurales',
              },
              {
                nombre: 'Instalación de grifería',
                desc: 'Instalación y conexión de grifos, canillas y accesorios sanitarios',
              },
              {
                nombre: 'Destape de pileta',
                desc: 'Desobstrucción de desagües y cañerías utilizando herramientas especializadas',
              },
              {
                nombre: 'Revisión de fugas',
                desc: 'Detección y reparación de pérdidas de agua en el sistema de plomería',
              },
              {
                nombre: 'Instalación de sanitarios',
                desc: 'Colocación e instalación completa de inodoros, bidets y lavatorios',
              },
              {
                nombre: 'Mantenimiento de bombas',
                desc: 'Revisión y mantenimiento de bombas de agua y sistemas de presión',
              },
            ];
            const tareaPlomeria = faker.helpers.arrayElement(tareasPlomeria);
            nombreTarea = tareaPlomeria.nombre;
            descripcionTarea = tareaPlomeria.desc;
            break;
          case 'Electricidad':
            const tareasElectricidad = [
              {
                nombre: 'Instalación de enchufes',
                desc: 'Instalación de tomas de corriente y cableado eléctrico siguiendo normas de seguridad',
              },
              {
                nombre: 'Reparación de cortocircuitos',
                desc: 'Diagnóstico y reparación de fallas eléctricas y cortocircuitos',
              },
              {
                nombre: 'Cambio de iluminación',
                desc: 'Instalación y reemplazo de luminarias, lámparas y sistemas de iluminación',
              },
              {
                nombre: 'Instalación de cables',
                desc: 'Tendido de cables eléctricos y conexiones para nuevas instalaciones',
              },
              {
                nombre: 'Mantenimiento de panel eléctrico',
                desc: 'Revisión y mantenimiento del tablero principal y llaves térmicas',
              },
              {
                nombre: 'Revisión de tableros',
                desc: 'Inspección completa de tableros eléctricos y sistemas de distribución',
              },
            ];
            const tareaElectricidad =
              faker.helpers.arrayElement(tareasElectricidad);
            nombreTarea = tareaElectricidad.nombre;
            descripcionTarea = tareaElectricidad.desc;
            break;
          case 'Jardinería':
            const tareasJardineria = [
              {
                nombre: 'Corte de césped',
                desc: 'Corte y perfilado del césped manteniendo la altura y forma adecuada',
              },
              {
                nombre: 'Poda de árboles',
                desc: 'Poda técnica de árboles y arbustos para su correcto crecimiento y salud',
              },
              {
                nombre: 'Plantación de flores',
                desc: 'Diseño y plantación de flores y plantas ornamentales en jardines',
              },
              {
                nombre: 'Riego de jardines',
                desc: 'Sistema de riego y mantenimiento de la humedad en plantas y césped',
              },
              {
                nombre: 'Limpieza de hojas',
                desc: 'Recolección y limpieza de hojas secas y restos vegetales',
              },
              {
                nombre: 'Diseño paisajístico',
                desc: 'Planificación y diseño de espacios verdes y jardines ornamentales',
              },
            ];
            const tareaJardineria =
              faker.helpers.arrayElement(tareasJardineria);
            nombreTarea = tareaJardineria.nombre;
            descripcionTarea = tareaJardineria.desc;
            break;
          case 'Pintura':
            const tareasPintura = [
              {
                nombre: 'Pintura de paredes interiores',
                desc: 'Preparación y pintura de paredes interiores con acabado profesional',
              },
              {
                nombre: 'Pintura de fachadas',
                desc: 'Pintura exterior de edificaciones con pinturas resistentes a la intemperie',
              },
              {
                nombre: 'Pintura de techos',
                desc: 'Aplicación de pintura en techos y cielorrasos con técnicas especializadas',
              },
              {
                nombre: 'Aplicación de barniz',
                desc: 'Tratamiento y barnizado de superficies de madera para protección y acabado',
              },
              {
                nombre: 'Preparación de superficies',
                desc: 'Lijado, masillado y preparación de superficies antes del pintado',
              },
              {
                nombre: 'Pintura decorativa',
                desc: 'Técnicas decorativas especiales como espongeado, estarcido y efectos',
              },
            ];
            const tareaPintura = faker.helpers.arrayElement(tareasPintura);
            nombreTarea = tareaPintura.nombre;
            descripcionTarea = tareaPintura.desc;
            break;
          case 'Carpintería':
            const tareasCarpinteria = [
              {
                nombre: 'Fabricación de muebles',
                desc: 'Diseño y construcción de muebles a medida según especificaciones del cliente',
              },
              {
                nombre: 'Reparación de puertas',
                desc: 'Ajuste, reparación y restauración de puertas de madera y marcos',
              },
              {
                nombre: 'Instalación de estanterías',
                desc: 'Diseño e instalación de estanterías y sistemas de almacenamiento',
              },
              {
                nombre: 'Reparación de ventanas',
                desc: 'Reparación de marcos de ventanas y reemplazo de componentes dañados',
              },
              {
                nombre: 'Trabajo con madera',
                desc: 'Trabajos generales de carpintería y manipulación de madera',
              },
              {
                nombre: 'Barnizado de muebles',
                desc: 'Aplicación de barniz y acabados protectores en muebles de madera',
              },
            ];
            const tareaCarpinteria =
              faker.helpers.arrayElement(tareasCarpinteria);
            nombreTarea = tareaCarpinteria.nombre;
            descripcionTarea = tareaCarpinteria.desc;
            break;
          case 'Construcción':
            const tareasConstruccion = [
              {
                nombre: 'Levantamiento de paredes',
                desc: 'Construcción de paredes divisorias y estructurales con materiales de calidad',
              },
              {
                nombre: 'Colocación de pisos',
                desc: 'Instalación de diferentes tipos de pisos: cerámicos, laminados, porcellanatos',
              },
              {
                nombre: 'Construcción de techos',
                desc: 'Construcción e instalación de techos y cubiertas estructurales',
              },
              {
                nombre: 'Trabajos de albañilería',
                desc: 'Trabajos generales de construcción y albañilería especializada',
              },
              {
                nombre: 'Reparación estructural',
                desc: 'Reparación de elementos estructurales y refuerzos de construcción',
              },
              {
                nombre: 'Ampliaciones',
                desc: 'Proyectos de ampliación de espacios y construcción de nuevas áreas',
              },
            ];
            const tareaConstruccion =
              faker.helpers.arrayElement(tareasConstruccion);
            nombreTarea = tareaConstruccion.nombre;
            descripcionTarea = tareaConstruccion.desc;
            break;
          case 'Cerrajería':
            const tareasCerrajeria = [
              {
                nombre: 'Cambio de cerraduras',
                desc: 'Instalación y reemplazo de cerraduras de seguridad para puertas',
              },
              {
                nombre: 'Instalación de rejas',
                desc: 'Diseño e instalación de rejas de seguridad para ventanas y accesos',
              },
              {
                nombre: 'Reparación de llaves',
                desc: 'Reparación y duplicado de llaves para diferentes tipos de cerraduras',
              },
              {
                nombre: 'Apertura de puertas',
                desc: 'Servicio de apertura de puertas bloqueadas sin dañar la cerradura',
              },
              {
                nombre: 'Instalación de sistemas de seguridad',
                desc: 'Instalación de sistemas de seguridad y control de acceso',
              },
              {
                nombre: 'Duplicado de llaves',
                desc: 'Servicio de copiado y duplicado de llaves de diferentes tipos',
              },
            ];
            const tareaCerrajeria =
              faker.helpers.arrayElement(tareasCerrajeria);
            nombreTarea = tareaCerrajeria.nombre;
            descripcionTarea = tareaCerrajeria.desc;
            break;
          case 'Climatización':
            const tareasClimatizacion = [
              {
                nombre: 'Instalación de aire acondicionado',
                desc: 'Instalación completa de equipos de aire acondicionado split y central',
              },
              {
                nombre: 'Mantenimiento de split',
                desc: 'Limpieza y mantenimiento preventivo de equipos de aire acondicionado',
              },
              {
                nombre: 'Reparación de ventiladores',
                desc: 'Reparación y mantenimiento de ventiladores de techo y pie',
              },
              {
                nombre: 'Limpieza de filtros',
                desc: 'Limpieza especializada de filtros de aire y sistemas de ventilación',
              },
              {
                nombre: 'Carga de gas refrigerante',
                desc: 'Recarga de gas refrigerante en equipos de aire acondicionado',
              },
              {
                nombre: 'Revisión de ductos',
                desc: 'Inspección y limpieza de ductos de ventilación y climatización',
              },
            ];
            const tareaClimatizacion =
              faker.helpers.arrayElement(tareasClimatizacion);
            nombreTarea = tareaClimatizacion.nombre;
            descripcionTarea = tareaClimatizacion.desc;
            break;
          case 'Reparaciones Generales':
            const tareasReparaciones = [
              {
                nombre: 'Reparación de goteras',
                desc: 'Detección y reparación de filtraciones en techos y paredes',
              },
              {
                nombre: 'Arreglo de grietas',
                desc: 'Reparación de grietas en paredes y aplicación de selladores',
              },
              {
                nombre: 'Reparación de azulejos',
                desc: 'Reemplazo y reparación de azulejos dañados en baños y cocinas',
              },
              {
                nombre: 'Mantenimiento preventivo',
                desc: 'Revisión general y mantenimiento preventivo de instalaciones',
              },
              {
                nombre: 'Reparaciones menores',
                desc: 'Pequeñas reparaciones y ajustes en el hogar u oficina',
              },
              {
                nombre: 'Solución de problemas diversos',
                desc: 'Diagnóstico y solución de diversos problemas domésticos',
              },
            ];
            const tareaReparacion =
              faker.helpers.arrayElement(tareasReparaciones);
            nombreTarea = tareaReparacion.nombre;
            descripcionTarea = tareaReparacion.desc;
            break;
          case 'Servicios Técnicos':
            const tareasTecnicos = [
              {
                nombre: 'Diagnóstico técnico',
                desc: 'Evaluación técnica especializada de equipos y sistemas',
              },
              {
                nombre: 'Instalación de equipos',
                desc: 'Instalación y puesta en marcha de equipos técnicos especializados',
              },
              {
                nombre: 'Mantenimiento especializado',
                desc: 'Mantenimiento técnico de equipos industriales y especializados',
              },
              {
                nombre: 'Calibración de instrumentos',
                desc: 'Calibración y ajuste de instrumentos de medición y control',
              },
              {
                nombre: 'Soporte técnico',
                desc: 'Asistencia técnica especializada y resolución de problemas complejos',
              },
              {
                nombre: 'Análisis de sistemas',
                desc: 'Análisis y optimización de sistemas técnicos y procesos',
              },
            ];
            const tareaTecnica = faker.helpers.arrayElement(tareasTecnicos);
            nombreTarea = tareaTecnica.nombre;
            descripcionTarea = tareaTecnica.desc;
            break;
          case 'Servicios del Hogar':
            const tareasHogar = [
              {
                nombre: 'Organización de espacios',
                desc: 'Organización y optimización de espacios para mejor funcionalidad',
              },
              {
                nombre: 'Limpieza de electrodomésticos',
                desc: 'Limpieza profunda y mantenimiento de electrodomésticos',
              },
              {
                nombre: 'Mantenimiento doméstico',
                desc: 'Mantenimiento general de instalaciones y equipos del hogar',
              },
              {
                nombre: 'Cuidado de plantas',
                desc: 'Cuidado, riego y mantenimiento de plantas de interior',
              },
              {
                nombre: 'Servicios de lavandería',
                desc: 'Lavado, planchado y cuidado de ropa y textiles',
              },
              {
                nombre: 'Gestión del hogar',
                desc: 'Administración y gestión integral de tareas domésticas',
              },
            ];
            const tareaHogar = faker.helpers.arrayElement(tareasHogar);
            nombreTarea = tareaHogar.nombre;
            descripcionTarea = tareaHogar.desc;
            break;
          case 'Servicios Integrales':
            const tareasIntegrales = [
              {
                nombre: 'Mantenimiento completo',
                desc: 'Servicio integral de mantenimiento de instalaciones y equipos',
              },
              {
                nombre: 'Renovación integral',
                desc: 'Renovación completa de espacios con múltiples especialidades',
              },
              {
                nombre: 'Servicios combinados',
                desc: 'Combinación de diferentes servicios en un proyecto integral',
              },
              {
                nombre: 'Gestión total',
                desc: 'Gestión completa de proyectos de múltiples especialidades',
              },
              {
                nombre: 'Soluciones integrales',
                desc: 'Soluciones completas que abarcan múltiples áreas de servicio',
              },
              {
                nombre: 'Administración de servicios',
                desc: 'Coordinación y administración de múltiples servicios especializados',
              },
            ];
            const tareaIntegral = faker.helpers.arrayElement(tareasIntegrales);
            nombreTarea = tareaIntegral.nombre;
            descripcionTarea = tareaIntegral.desc;
            break;
          case 'Hogar y Jardín':
            const tareasHogarJardin = [
              {
                nombre: 'Mantenimiento de patios',
                desc: 'Cuidado y mantenimiento integral de patios y espacios exteriores',
              },
              {
                nombre: 'Cuidado de jardines',
                desc: 'Mantenimiento completo de jardines incluyendo plantas y césped',
              },
              {
                nombre: 'Limpieza de exteriores',
                desc: 'Limpieza de espacios exteriores, terrazas y áreas de jardín',
              },
              {
                nombre: 'Decoración de espacios verdes',
                desc: 'Diseño y decoración de jardines y espacios verdes',
              },
              {
                nombre: 'Mantenimiento de terrazas',
                desc: 'Cuidado y mantenimiento de terrazas y balcones',
              },
              {
                nombre: 'Servicios combinados hogar-jardín',
                desc: 'Servicios integrales combinando tareas del hogar y jardín',
              },
            ];
            const tareaHogarJardin =
              faker.helpers.arrayElement(tareasHogarJardin);
            nombreTarea = tareaHogarJardin.nombre;
            descripcionTarea = tareaHogarJardin.desc;
            break;
          case 'Control de Plagas':
            const tareasPlagas = [
              {
                nombre: 'Fumigación de hormigas',
                desc: 'Eliminación especializada de hormigas con productos seguros y efectivos',
              },
              {
                nombre: 'Control de cucarachas',
                desc: 'Tratamiento integral para eliminación y prevención de cucarachas',
              },
              {
                nombre: 'Eliminación de roedores',
                desc: 'Control y eliminación de ratones y ratas con métodos seguros',
              },
              {
                nombre: 'Desinsectación',
                desc: 'Eliminación de insectos voladores y rastreros con técnicas especializadas',
              },
              {
                nombre: 'Tratamiento de termitas',
                desc: 'Tratamiento especializado para eliminación y prevención de termitas',
              },
              {
                nombre: 'Prevención de plagas',
                desc: 'Servicios preventivos para evitar infestaciones de plagas',
              },
            ];
            const tareaPlagas = faker.helpers.arrayElement(tareasPlagas);
            nombreTarea = tareaPlagas.nombre;
            descripcionTarea = tareaPlagas.desc;
            break;
          case 'Mantenimiento Integral':
            const tareasMantenimiento = [
              {
                nombre: 'Mantenimiento de edificios',
                desc: 'Mantenimiento completo de edificios residenciales y comerciales',
              },
              {
                nombre: 'Revisión de instalaciones',
                desc: 'Inspección y revisión de todas las instalaciones del inmueble',
              },
              {
                nombre: 'Mantenimiento preventivo',
                desc: 'Programa de mantenimiento preventivo para evitar averías',
              },
              {
                nombre: 'Gestión de mantenimiento',
                desc: 'Gestión integral de todos los aspectos del mantenimiento',
              },
              {
                nombre: 'Servicios de conserje',
                desc: 'Servicios de conserjería y mantenimiento diario de edificios',
              },
              {
                nombre: 'Mantenimiento correctivo',
                desc: 'Reparación y corrección de fallas en sistemas e instalaciones',
              },
            ];
            const tareaMantenimiento =
              faker.helpers.arrayElement(tareasMantenimiento);
            nombreTarea = tareaMantenimiento.nombre;
            descripcionTarea = tareaMantenimiento.desc;
            break;
          case 'Servicios de Piscinas':
            const tareasPiscinas = [
              {
                nombre: 'Limpieza de piscinas',
                desc: 'Limpieza completa de piscinas incluyendo aspirado y cepillado',
              },
              {
                nombre: 'Mantenimiento de filtros',
                desc: 'Limpieza y mantenimiento de sistemas de filtración de piscinas',
              },
              {
                nombre: 'Control de químicos',
                desc: 'Análisis y ajuste de niveles químicos del agua de la piscina',
              },
              {
                nombre: 'Reparación de bombas',
                desc: 'Reparación y mantenimiento de bombas de filtración y circulación',
              },
              {
                nombre: 'Limpieza de fondo',
                desc: 'Aspirado y limpieza profunda del fondo y paredes de la piscina',
              },
              {
                nombre: 'Mantenimiento estacional',
                desc: 'Preparación y mantenimiento de piscinas según la temporada',
              },
            ];
            const tareaPiscinas = faker.helpers.arrayElement(tareasPiscinas);
            nombreTarea = tareaPiscinas.nombre;
            descripcionTarea = tareaPiscinas.desc;
            break;
          case 'Decoración Interior':
            const tareasDecoracion = [
              {
                nombre: 'Diseño de ambientes',
                desc: 'Diseño y planificación de espacios interiores funcionales y estéticos',
              },
              {
                nombre: 'Selección de colores',
                desc: 'Asesoramiento en paletas de colores y combinaciones para interiores',
              },
              {
                nombre: 'Decoración de salas',
                desc: 'Decoración completa de salas de estar y espacios sociales',
              },
              {
                nombre: 'Ambientación de espacios',
                desc: 'Creación de ambientes acogedores y funcionales en el hogar',
              },
              {
                nombre: 'Asesoramiento decorativo',
                desc: 'Consultoría especializada en decoración y diseño de interiores',
              },
              {
                nombre: 'Renovación de interiores',
                desc: 'Renovación completa de espacios interiores con nuevo diseño',
              },
            ];
            const tareaDecoracion =
              faker.helpers.arrayElement(tareasDecoracion);
            nombreTarea = tareaDecoracion.nombre;
            descripcionTarea = tareaDecoracion.desc;
            break;
          case 'Refrigeración':
            const tareasRefrigeracion = [
              {
                nombre: 'Reparación de heladeras',
                desc: 'Diagnóstico y reparación de heladeras domésticas y comerciales',
              },
              {
                nombre: 'Mantenimiento de freezers',
                desc: 'Mantenimiento preventivo y reparación de equipos de congelación',
              },
              {
                nombre: 'Instalación de cámaras frías',
                desc: 'Instalación de sistemas de refrigeración industrial y comercial',
              },
              {
                nombre: 'Reparación de sistemas de frío',
                desc: 'Reparación especializada de sistemas de refrigeración',
              },
              {
                nombre: 'Carga de gas refrigerante',
                desc: 'Recarga de gas refrigerante en equipos de refrigeración',
              },
              {
                nombre: 'Diagnóstico de equipos',
                desc: 'Diagnóstico técnico de fallas en equipos de refrigeración',
              },
            ];
            const tareaRefrigeracion =
              faker.helpers.arrayElement(tareasRefrigeracion);
            nombreTarea = tareaRefrigeracion.nombre;
            descripcionTarea = tareaRefrigeracion.desc;
            break;
          case 'Tecnología y Automatización':
            const tareasTecnologia = [
              {
                nombre: 'Instalación de domótica',
                desc: 'Instalación de sistemas domóticos para automatización del hogar',
              },
              {
                nombre: 'Configuración de sistemas inteligentes',
                desc: 'Configuración de sistemas inteligentes de control y monitoreo',
              },
              {
                nombre: 'Automatización de luces',
                desc: 'Instalación de sistemas de iluminación automatizada e inteligente',
              },
              {
                nombre: 'Instalación de sensores',
                desc: 'Instalación de sensores de movimiento, temperatura y seguridad',
              },
              {
                nombre: 'Programación de sistemas',
                desc: 'Programación y configuración de sistemas automatizados',
              },
              {
                nombre: 'Mantenimiento tecnológico',
                desc: 'Mantenimiento de sistemas tecnológicos y equipos automatizados',
              },
            ];
            const tareaTecnologia =
              faker.helpers.arrayElement(tareasTecnologia);
            nombreTarea = tareaTecnologia.nombre;
            descripcionTarea = tareaTecnologia.desc;
            break;
          default:
            nombreTarea = `${tipo.nombreTipo} - Tarea ${i}`;
            descripcionTarea = `Descripción para ${nombreTarea}`;
        }

        // Verificar si ya existe una tarea con este nombre
        const existing = await em.findOne(Tarea, { nombreTarea });
        if (!existing) {
          // Duración aleatoria en minutos entre 30 y 180
          const duracionTarea = faker.number.int({ min: 30, max: 180 });

          // Creamos la tarea asociada al tipo de servicio
          em.create(Tarea, {
            nombreTarea,
            descripcionTarea,
            duracionTarea,
            tipoServicio: tipo, // asignamos el tipo de servicio
          });
          insertadas++;
        }
      }
    }

    if (insertadas > 0) {
      await em.flush();
      console.log(`Insertadas ${insertadas} nuevas tareas.`);
    } else {
      console.log('Todas las tareas ya existen en la base de datos.');
    }
  }
}
