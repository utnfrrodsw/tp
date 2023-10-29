import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

export interface Libro {
  id: number;
  isbn: string;
  titulo: string;
  descripcion: string;
  precio: number;
  imagen: string;
  autores: string[];
  editorial: string;
  fechaEdicion: Date;
  calificacion: number;
  categorias: string[];
  formatos: string[];
  sinopsis: string;
}

@Injectable({
  providedIn: 'root',
})
export class LibrosService {
  private libros: Libro[] = [
    {
      id: 1,
      isbn: '978-0132350884',
      titulo: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      descripcion:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. ...',
      precio: 3500,
      imagen: 'assets/img/Libros/Clean Code.webp',
      autores: ['Robert C. Martin'],
      editorial: 'Prentice Hall',
      fechaEdicion: new Date(2008, 7, 11),
      calificacion: 4.4,
      categorias: ['Programación', 'Desarrollo de Software'],
      formatos: ['Físico', 'Digital'],
      sinopsis: '"Clean Code: A Handbook of Agile Software Craftsmanship" es un libro escrito por Robert C. Martin, conocido como "Uncle Bob", que se ha convertido en una referencia fundamental para los desarrolladores de software en la búsqueda de la excelencia en la escritura de código. Publicado en 2008, Clean Code se ha convertido en una lectura obligada para quienes buscan comprender los principios fundamentales de la programación limpia y efectiva.\nEn este libro, Robert C. Martin presenta un enfoque práctico y accesible para mejorar la calidad del código y fomentar una mentalidad centrada en la artesanía del software. A través de numerosos ejemplos y casos de estudio, Martin expone una serie de principios y prácticas que permiten a los desarrolladores crear software flexible, mantenible y de alta calidad. Desde la importancia de elegir nombres significativos para las variables hasta la estructuración adecuada de funciones y clases, Clean Code aborda una variedad de temas esenciales para el desarrollo de software sostenible en el tiempo.\nAl explorar conceptos como la simplicidad, la claridad, la modularidad y la refactorización, el autor destaca la importancia de adoptar una mentalidad proactiva hacia la limpieza del código y la reducción de la deuda técnica. Mediante la aplicación de principios ágiles y el fomento de una cultura de colaboración y responsabilidad, Clean Code proporciona un marco de trabajo práctico y valioso para los desarrolladores de todos los niveles de experiencia en su búsqueda de la excelencia en la artesanía del software.\nEn resumen, Clean Code es una guía esencial para aquellos que desean mejorar su habilidad para escribir y mantener código limpio, legible y fácilmente comprensible. Con su enfoque pragmático y sus numerosos ejemplos, el libro brinda a los desarrolladores las herramientas y estrategias necesarias para elevar la calidad de sus proyectos de software y fomentar una cultura de excelencia en la programación.'
    },
    {
      id: 2,
      isbn: '978-8448129833',
      titulo: 'Introducción a la Programación Estructurada en C',
      descripcion:
        'Este libro proporciona una introducción sólida a la programación estructurada en el lenguaje C. Cubre los fundamentos de la programación y la sintaxis de C de manera clara y concisa..',
      precio: 15999,
      imagen:
        'assets/img/Libros/Introducción a la Programación Estructurada en C.jpg',
      autores: ['Luis Joyanes Aguilar'],
      editorial: 'McGraw Hill',
      fechaEdicion: new Date(2000, 0, 1),
      calificacion: 4,
      categorias: ['Programación', 'Desarrollo de Software'],
      formatos: ['Físico', 'Digital'],
      sinopsis: '"Introducción a la Programación Estructurada en C" es un libro escrito por Luis Joyanes Aguilar, que se ha convertido en una referencia fundamental para aquellos que buscan comprender los fundamentos de la programación estructurada utilizando el lenguaje de programación C. Publicado originalmente en 1989 y actualizado en ediciones posteriores, el libro proporciona una sólida introducción a los conceptos esenciales de la programación y la lógica de programación.\nA lo largo de sus páginas, Joyanes Aguilar ofrece una explicación detallada y accesible de los elementos clave de la programación estructurada, utilizando el lenguaje C como base para ilustrar estos conceptos. El libro comienza con una introducción a los fundamentos de la programación, cubriendo temas como la estructura básica de un programa, tipos de datos, operadores y expresiones. A medida que avanza, el autor presenta conceptos más avanzados, como el uso de estructuras de control, funciones, punteros y arrays, proporcionando ejemplos prácticos y ejercicios que refuerzan el aprendizaje.\nAdemás de explicar los conceptos teóricos, el autor enfatiza la importancia de la resolución de problemas y el diseño de algoritmos eficientes, lo que permite a los lectores adquirir una comprensión profunda de la lógica subyacente en el desarrollo de programas en C. El enfoque paso a paso y la claridad en la presentación de la información hacen que este libro sea una herramienta valiosa tanto para principiantes como para aquellos que deseen afianzar sus conocimientos en programación estructurada.\nEn resumen, "Introducción a la Programación Estructurada en C" es una guía práctica y completa que proporciona a los lectores una base sólida en los principios de la programación estructurada, con un enfoque específico en el lenguaje C. Al abordar conceptos desde lo básico hasta temas más avanzados, el libro se convierte en un recurso fundamental para estudiantes y profesionales que buscan comprender los fundamentos de la programación y fortalecer sus habilidades en el desarrollo de software.'
    },
    {
      id: 3,
      isbn: '978-1449355739',
      titulo: 'Learning Python, 5th Edition',
      descripcion:
        'Este libro es una guía completa para aprender Python, desde los conceptos básicos hasta temas avanzados. Ideal para principiantes y programadores experimentados que deseen dominar Python.',
      precio: 19999,
      imagen: 'assets/img/Libros/Learning Python.png',
      autores: ['Mark Lutz'],
      editorial: 'O’Reilly Media',
      fechaEdicion: new Date(2013, 6, 6),
      calificacion: 4,
      categorias: ['Programación', 'Desarrollo de Software'],
      formatos: ['Físico', 'Digital'],
      sinopsis: '"Learning Python, 5th Edition" es un libro de programación escrito por Mark Lutz, un reconocido autor en el campo de la programación y la informática. Esta quinta edición del libro sigue siendo una guía integral y detallada para aprender el lenguaje de programación Python, desde sus conceptos básicos hasta técnicas más avanzadas.\nEl libro está diseñado para ser accesible tanto para principiantes como para programadores experimentados que deseen mejorar sus habilidades en Python. Con un enfoque práctico y orientado a proyectos, el autor guía a los lectores a través de los fundamentos de Python, incluyendo sintaxis, tipos de datos, operadores, estructuras de control, funciones y módulos. Además, aborda temas más avanzados como la programación orientada a objetos, el manejo de excepciones, el manejo de archivos y la integración de bases de datos.\nLa quinta edición se actualiza para reflejar las últimas mejoras en Python, incluyendo características clave de Python 3.x, así como consejos y trucos para aprovechar al máximo las capacidades del lenguaje. También cubre aspectos relevantes de programación web, ciencia de datos, inteligencia artificial y otras aplicaciones prácticas de Python en el mundo real.\nCon ejemplos de código claros y explicaciones detalladas, "Learning Python, 5th Edition" es una guía imprescindible para cualquiera que desee adquirir una comprensión sólida y práctica de Python y sus aplicaciones en diversos campos de la informática y la tecnología.'
    },
    {
      id: 4,
      isbn: '978-0133591620',
      titulo: 'Sistemas Operativos Modernos',
      descripcion:
        'Este libro explora los principios y conceptos fundamentales de los sistemas operativos modernos. Ofrece una comprensión profunda de cómo funcionan los sistemas operativos en la práctica.',
      precio: 19899,
      imagen: 'assets/img/Libros/Sistemas Operativos Modernos.webp',
      autores: ['Andrew S. Tanenbaum'],
      editorial: 'Pearson',
      fechaEdicion: new Date(2015, 1, 15),
      calificacion: 3,
      categorias: ['Programación', 'Desarrollo de Software'],
      formatos: ['Físico', 'Digital'],
      sinopsis: '"Sistemas Operativos Modernos" es un influyente libro escrito por Andrew S. Tanenbaum, que ha sido ampliamente adoptado en cursos de sistemas operativos en todo el mundo. Publicado por primera vez en 1992 y actualizado en varias ediciones, el libro se ha convertido en un recurso indispensable para estudiantes, profesionales y entusiastas de la informática interesados en comprender a fondo los fundamentos de los sistemas operativos modernos.\nTanenbaum presenta una visión profunda y exhaustiva de los principios fundamentales de los sistemas operativos, abarcando una amplia gama de temas que van desde la administración de procesos y la gestión de memoria hasta la planificación de la CPU y la comunicación entre procesos. A lo largo del libro, el autor aborda conceptos clave como la concurrencia, la sincronización y la comunicación entre procesos, proporcionando ejemplos y casos de estudio para ilustrar de manera clara y práctica estos temas complejos.\nAdemás de discutir los conceptos básicos, el autor también analiza temas más avanzados, como los sistemas de archivos, la protección y la seguridad, así como los sistemas distribuidos y la virtualización. Al integrar ejemplos del mundo real y casos de estudio actuales, Tanenbaum demuestra la relevancia de los sistemas operativos en el panorama tecnológico actual y su papel fundamental en la administración eficiente de recursos y la garantía de la estabilidad y seguridad del sistema.\nCon su enfoque didáctico y su atención a los desarrollos más recientes en el campo de los sistemas operativos, "Sistemas Operativos Modernos" se ha consolidado como un texto de referencia clave para estudiantes de informática y profesionales de la industria, proporcionando una comprensión sólida y profunda de los principios esenciales que sustentan el funcionamiento de los sistemas informáticos contemporáneos.'
    },
    {
      id: 5,
      isbn: '978-0201633610',
      titulo: 'Design Patterns',
      descripcion:
        'Este clásico libro introduce patrones de diseño en la programación de software. Explora soluciones probadas para problemas comunes de diseño de software.',
      precio: 5099,
      imagen: 'assets/img/Libros/Design Patterns.jpg',
      autores: ['Erich Gamma'],
      editorial: 'Addison-Wesley Professional',
      fechaEdicion: new Date(1994, 10, 10),
      calificacion: 5,
      categorias: ['Programación', 'Desarrollo de Software'],
      formatos: ['Físico', 'Digital'],
      sinopsis: 'Lamento la confusión, pero Erich Gamma es conocido por ser coautor del libro "Design Patterns: Elements of Reusable Object-Oriented Software" junto con otros tres autores: Richard Helm, Ralph Johnson y John Vlissides, también conocido como el "Gang of Four". Este libro revolucionario, publicado en 1994, ha sido un recurso fundamental en el campo de la ingeniería de software y el diseño de software orientado a objetos.\nEl libro "Design Patterns: Elements of Reusable Object-Oriented Software" es una obra maestra que introduce a los lectores en el concepto de patrones de diseño, proporcionando soluciones probadas y bien documentadas a problemas comunes en el desarrollo de software. A través de ejemplos prácticos y explicaciones detalladas, los autores presentan una colección de patrones de diseño fundamentales, como el patrón Singleton, el patrón Factory, el patrón Observer y muchos otros, que han influido significativamente en la forma en que los desarrolladores abordan el diseño de software.\nEste libro ha sido elogiado por su enfoque en la reutilización de código y la mejora de la eficiencia en el desarrollo de software, al ofrecer soluciones elegantes y flexibles para desafíos comunes en el diseño y la implementación de sistemas orientados a objetos. Con un énfasis en la claridad y la practicidad, el libro proporciona una comprensión profunda de cómo aplicar los patrones de diseño de manera efectiva en una amplia gama de contextos de desarrollo de software.\nEn resumen, "Design Patterns: Elements of Reusable Object-Oriented Software" ha dejado un legado duradero en la ingeniería de software, al proporcionar a los profesionales y estudiantes de informática un marco de trabajo sólido para abordar problemas comunes en el diseño de software. Su enfoque atemporal y su enfoque práctico han convertido este libro en un recurso indispensable para cualquiera que busque mejorar sus habilidades en el diseño de software orientado a objetos.'
    },
    {
      id: 6,
      isbn: '978-9702606624',
      titulo: 'Ingeniería de Software: Un Enfoque Práctico',
      descripcion:
        'Una guía práctica para la ingeniería de software que aborda los aspectos esenciales del desarrollo de software, desde la planificación hasta la entrega.',
      precio: 39990,
      imagen:
        'assets/img/Libros/Ingeniería de Software. Un Enfoque Práctico.webp',
      autores: ['Roger S. Pressman'],
      editorial: 'McGraw-Hill Interamericana',
      fechaEdicion: new Date(2006, 6, 30),
      calificacion: 4.5,
      categorias: ['Programación', 'Desarrollo de Software'],
      formatos: ['Físico', 'Digital'],
      sinopsis: '"Ingeniería de Software: Un Enfoque Práctico" es un libro escrito por Roger S. Pressman, un texto influyente que ha desempeñado un papel crucial en la educación y comprensión de la disciplina de la ingeniería de software. Desde su primera publicación en 1982, ha sido una lectura fundamental en cursos de ingeniería de software y disciplinas afines.\nEl libro aborda una amplia gama de temas relacionados con la ingeniería de software, incluyendo el proceso de desarrollo de software, la gestión de proyectos, la ingeniería de requisitos, el diseño y la arquitectura de software, la implementación y el mantenimiento de software, así como temas emergentes en la disciplina. A lo largo del texto, Pressman enfatiza un enfoque práctico y centrado en la aplicación de métodos y herramientas de ingeniería de software en contextos del mundo real.\nAdemás de presentar conceptos teóricos fundamentales, el autor incorpora numerosos estudios de casos y ejemplos prácticos para ilustrar la aplicación de los principios de ingeniería de software en situaciones reales. Esto ayuda a los lectores a comprender mejor la aplicación de la teoría en la práctica, fomentando un enfoque equilibrado y comprensivo hacia la construcción de software de calidad.\nEl libro también aborda aspectos relevantes como la gestión de riesgos, la calidad del software y la gestión de la configuración, lo que lo convierte en una referencia integral para aquellos que buscan comprender los fundamentos y las mejores prácticas de la ingeniería de software en la industria actual.\nEn resumen, "Ingeniería de Software: Un Enfoque Práctico" es una obra esencial que proporciona una base sólida y completa para el entendimiento de la ingeniería de software. Con su enfoque equilibrado en la teoría y la práctica, el libro se ha convertido en un recurso invaluable para estudiantes, profesionales y expertos que desean comprender y aplicar los principios clave de la ingeniería de software en entornos de desarrollo de software de la vida real.'
    },
    {
      id: 7,
      isbn: '978-1493652493',
      titulo: 'Python para todos',
      descripcion:
        'Un libro introductorio que enseña programación en Python desde cero. Contiene ejemplos y ejercicios para ayudar a los lectores a comprender los conceptos básicos de la programación.',
      precio: 23990,
      imagen: 'assets/img/Libros/Python para todos.jpg',
      autores: ['Raúl González Duque'],
      editorial: 'Publicado Independientemente',
      fechaEdicion: new Date(2013, 6, 1),
      calificacion: 4.5,
      categorias: ['Programación', 'Desarrollo de Software'],
      formatos: ['Físico', 'Digital'],
      sinopsis: '"Python para todos" es un libro escrito por Raúl González Duque que se ha convertido en una referencia fundamental para aquellos que buscan aprender o mejorar sus habilidades en el lenguaje de programación Python. Publicado con el objetivo de hacer que Python sea accesible para todos, el libro ofrece una introducción completa y amigable al lenguaje, orientada tanto a principiantes como a programadores más experimentados.\nEn sus páginas, el autor cubre una amplia gama de temas, comenzando desde los conceptos básicos de la sintaxis de Python, los tipos de datos y las estructuras de control, hasta temas más avanzados como la programación orientada a objetos, el manejo de archivos y el desarrollo de aplicaciones web con frameworks populares. A través de ejemplos claros y ejercicios prácticos, el libro permite a los lectores adquirir una comprensión sólida de los fundamentos de Python y su aplicación en diversos contextos de programación.\nAdemás de presentar el lenguaje en sí, "Python para todos" también explora el uso de Python en áreas específicas, como la ciencia de datos, el análisis de datos, la inteligencia artificial y la automatización de tareas. Al destacar casos de uso prácticos y aplicaciones del mundo real, el autor demuestra la versatilidad y potencial de Python en diferentes campos y su relevancia en la industria actual.\nEn resumen, "Python para todos" es una guía completa y accesible que brinda a los lectores los conocimientos y las habilidades necesarias para aprovechar al máximo el poder de Python. Con su enfoque práctico y su cobertura integral, el libro se ha convertido en un recurso valioso para estudiantes, profesionales y entusiastas de la programación que buscan comprender y dominar el lenguaje de programación Python en todas sus facetas.'
    },
    {
      id: 8,
      isbn: '978-6074422744',
      titulo: 'Introducción a la Inteligencia Artificial',
      descripcion:
        'Este libro ofrece una introducción clara y accesible a la inteligencia artificial, cubriendo conceptos clave y técnicas utilizadas en el campo.',
      precio: 27990,
      imagen: 'assets/img/Libros/Introducción a la Inteligencia Artificial.jpg',
      autores: ['Wolfgang Ertel'],
      editorial: 'Thomson Learning',
      fechaEdicion: new Date(2008, 15, 3),
      calificacion: 4.2,
      categorias: ['Programación', 'Desarrollo de Software'],
      formatos: ['Físico', 'Digital'],
      sinopsis: '"Introducción a la Inteligencia Artificial" es un libro escrito por Wolfgang Ertel que proporciona una visión completa y accesible de los conceptos fundamentales y las aplicaciones de la inteligencia artificial. Publicado con el objetivo de servir como una introducción clara y concisa al campo de la inteligencia artificial, el libro es adecuado tanto para principiantes en el tema como para aquellos que buscan una comprensión más profunda de sus aplicaciones y metodologías.\nA lo largo de sus páginas, Ertel explora una amplia gama de temas, que van desde los conceptos básicos de la inteligencia artificial, incluyendo agentes inteligentes y métodos de búsqueda, hasta áreas más avanzadas como el aprendizaje automático, la minería de datos y la inteligencia artificial en juegos. El autor utiliza ejemplos claros y casos de estudio para ilustrar los conceptos teóricos, lo que permite a los lectores comprender cómo se aplican estos principios en situaciones del mundo real.\nAdemás de abordar la teoría subyacente, el autor también analiza los desafíos éticos y sociales asociados con el desarrollo y la implementación de la inteligencia artificial en diversos contextos. Esto ayuda a los lectores a comprender el impacto de la inteligencia artificial en la sociedad y a considerar las implicaciones éticas al utilizar estas tecnologías en aplicaciones prácticas.\nEn resumen, "Introducción a la Inteligencia Artificial" es una guía exhaustiva y accesible que proporciona a los lectores una base sólida en los conceptos y aplicaciones de la inteligencia artificial. Con su enfoque equilibrado en la teoría y la práctica, el libro se ha convertido en un recurso esencial para estudiantes, profesionales y cualquier persona interesada en comprender el campo de la inteligencia artificial y su impacto en el mundo moderno.'
    },
  ];

  constructor(private datePipe: DatePipe) { }

  getLibros(): Libro[] {
    return this.libros;
  }
  getLibroById(id: number): Libro | undefined {
    // Buscar el libro por su ID en la lista de libros
    return this.libros.find((libro) => libro.id === id);
  }
}
