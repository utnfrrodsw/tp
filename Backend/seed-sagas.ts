import path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '..', '.env') });

import ormConfig from './src/mikro-orm.config';
import { MikroORM } from '@mikro-orm/mysql';
import { Saga } from './src/entities/saga.entity';
import { Libro } from './src/entities/libro.entity';
import { Autor } from './src/entities/autor.entity';
import { Categoria } from './src/entities/categoria.entity';
import { Editorial } from './src/entities/editorial.entity';

/**
 * Script para crear Sagas de master data y asociarlas a libros existentes.
 * Este archivo fue generado automáticamente desde la base de datos.
 * Fecha de generación: 2025-11-04T15:52:32.887Z
 * Uso: npx ts-node seed-sagas.ts
 */

interface AutorData {
  id: number;
  nombre: string;
  apellido: string;
  createdAt: Date;
}

interface CategoriaData {
  id: number;
  nombre: string;
  createdAt: Date;
}

interface EditorialData {
  id: number;
  nombre: string;
  createdAt: Date;
}

interface LibroData {
  id: number;
  nombre: string;
  slug: string;
  sinopsis: string;
  imagen: string;
  enlace: string;
  externalId: string;
  source: string;
  autorId: number | null;
  categoriaId: number | null;
  editorialId: number | null;
  createdAt: Date;
}

interface SagaData {
  id: number;
  nombre: string;
  libroExternalIds: string[];
  createdAt: Date;
}

(async () => {
  const orm = await MikroORM.init(ormConfig);
  const em = orm.em.fork();

  try {
    console.log('Creando sagas de master data...');

    // Datos de master data exportados de la base de datos
    const masterData: {
      autores: AutorData[];
      categorias: CategoriaData[];
      editoriales: EditorialData[];
      libros: LibroData[];
      sagas: SagaData[];
    } = {
      autores: [
        {
          id: 1,
          nombre: "Rebecca",
          apellido: "Yarros",
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 2,
          nombre: "Eva",
          apellido: "García Sáenz de Urturi",
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 3,
          nombre: "Ana",
          apellido: "Huang",
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 4,
          nombre: "Holly",
          apellido: "Jackson",
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 5,
          nombre: "Colleen",
          apellido: "Hoover",
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 6,
          nombre: "Richard",
          apellido: "Osman",
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 7,
          nombre: "J.K.",
          apellido: "Rowling",
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 8,
          nombre: "J.",
          apellido: "K. Rowling",
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 9,
          nombre: "J.",
          apellido: "R. R. Tolkien",
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 10,
          nombre: "John",
          apellido: "Ronald Reuel Tolkien",
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 11,
          nombre: "J.R.R.",
          apellido: "Tolkien",
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        }
      ],
      categorias: [
      ],
      editoriales: [
      ],
      libros: [
        {
          id: 1,
          nombre: "Alas de sangre (Empíreo 1)",
          sinopsis: "<p> <b>«¡El libro de fantasía más adictivo que he leído en una década!».—Tracy Wolff, autora bestseller del New York Times </b> </p> <p> <b> <i>Bestseller</i> del <i>New York Times </i> </b> </p> <p> <b>Un dragón sin su jinete es una tragedia. Un jinete sin su dragón está muerto.</b> <br> <b>—Artículo uno, sección uno del Código de jinetes de dragones</b> </p> <p>Violet Sorrengail creía que a sus veinte años se uniría al Cuadrante de los Escribas para vivir una vida tranquila, estudiando sus amados libros y las historias antiguas que tanto le fascinan. Sin embargo, por órdenes de su madre, la temida comandante general, Violet debe unirse a los miles de candidatos que luchan por formar parte de la élite de Navarre: los jinetes de dragones.</p> <p>Cuando eres más pequeña y frágil que los demás tu vida corre peligro, porque los dragones no se vinculan con humanos débiles; de hecho, los incineran. Sumado a esto, con más jinetes que dragones disponibles, buena parte de los candidatos mataría a Violet con tal de mejorar sus probabilidades de éxito; otros, como el despiadado Xaden Riorson, el líder de ala más poderoso del Cuadrante, la asesinarían simplemente por ser la hija de la comandante general. Para sobrevivir, necesitará aprovechar al máximo todo su ingenio.</p> <p>Día tras día, la guerra que se libra al exterior del Colegio se torna más letal, las defensas del reino se debilitan y los muertos aumentan. Por si fuera poco, Violet sospecha que los líderes de Navarre esconden un terrible secreto.</p> <p>Amistad, rivalidad y pasión... en el Colegio de Guerra de Basgiath todos tienen una agenda oculta y saben que una vez adentro solo hay dos posibilidades: graduarse o morir.</p>",
          imagen: "http://books.google.com/books/publisher/content?id=6PjIEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE72QDFVHPKKW8XJBHBSWz8gxIokb587d72pElamkcYAYyvd9TsJovjfy7B0aEglXSVfGYhi57ei0Ie9mNzZ76iM9eZMQZYGEA074tNuwXPgf_WYdq3wWq5SUxBb2Kp1Kg9A51PwG&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=6PjIEAAAQBAJ&source=gbs_api",
          slug: "alas-de-sangre-empireo-1",
          externalId: "6PjIEAAAQBAJ",
          source: "google",
          autorId: 1,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 2,
          nombre: "Alas de hierro (Empíreo 2)",
          sinopsis: "<p> <b>«En el primer año algunos pierden la vida. En el segundo año, los que sobrevivimos perdemos la compasión». —Xaden Riorson</b> </p> <p>Todos esperaban que Violet Sorrengail muriera en su primer año en el Colegio de Guerra de Basgiath, incluso ella misma. Pero la Trilla fue tan solo la primera de una serie de pruebas imposibles destinadas a deshacerse de los pusilánimes, los indignos y los desafortunados.</p> <p>Ahora comienza el verdadero entrenamiento y Violet no sabe cómo logrará superarlo. No solo porque es brutal y agotador ni porque está diseñado para llevar al límite el umbral del dolor de los jinetes, sino porque el nuevo vicecomandante está empeñado en demostrar a Violet lo débil que es a menos que traicione al hombre que ama.</p> <p>Aunque el cuerpo de Violet es más frágil que el de sus compañeros, su fuerza radica en su ingenio y voluntad de hierro. Además, los líderes están olvidando la lección más importante que Basgiath les ha enseñado: los jinetes de dragones crean sus propias reglas.</p> <p>La voluntad de sobrevivir no será suficiente este año, porque Violet conoce el secreto que se oculta entre los muros del colegio y nada, ni siquiera el fuego de dragón, será suficiente para salvarlos.</p>",
          imagen: "http://books.google.com/books/publisher/content?id=OJjkEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70RxDlJ2XlBsUtpvD6GE-3AFc7WJ6GnRt3TjthR8AiJ9Q5yrtwOzvC79pFAVgD0dbo0ec3F2HO0YVawuWnTMJK7RA5JXMbCaw0IDqFfQHaDf_5Pbjd-GP_xwLzGnwnUBTDR85Bx&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=OJjkEAAAQBAJ&source=gbs_api",
          slug: "alas-de-hierro-empireo-2",
          externalId: "OJjkEAAAQBAJ",
          source: "google",
          autorId: 1,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 3,
          nombre: "Alas de ónix (Empíreo 3)",
          sinopsis: "<p> <b>Una tormenta se aproxima y no todos sobrevivirán a su furia.</b> </p> <p>Tras casi dieciocho meses en el Colegio de Guerra Basgiath, Violet Sorrengail tiene claro que no queda tiempo para entrenar. Hay que tomar decisiones. La batalla ha comenzado y, con enemigos acercándose a las murallas e infiltrados en sus propias filas, es imposible saber en quién confiar.</p> <p>Ahora Violet deberá emprender un viaje fuera de los límites de Aretia en busca de aliados de tierras desconocidas que acepten pelear por Navarre. La misión pondrá a prueba su suerte, y la obligará a usar todo su ingenio y fortaleza para salvar a quienes más ama: sus dragones, su familia, su hogar y a <i>él</i>.</p> <p>Aunque eso signifique tener que guardar un secreto tan peligroso que podría destruirlo todo.</p> <p>Navarre necesita un ejército. Necesita poder. Necesita magia. Y necesitará algo que solo Violet puede encontrar: la verdad.</p> <p>Pero una tormenta se aproxima... y no todos sobrevivirán a su furia.</p>",
          imagen: "http://books.google.com/books/publisher/content?id=VpQnEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE73Tx3bI6SY9GX-gvTf05uuLwz5-XSz9lX6IHLNvHrNwDT5RCgR0xpkiu-NlsZoq3rvskf9LBmQaVAh24T5qKOY7mSE_SQrZEU10g7z_D4TaRq6zU2W3uFBtTeCFqChwdAlTnW3c&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=VpQnEQAAQBAJ&source=gbs_api",
          slug: "alas-de-onix-empireo-3",
          externalId: "VpQnEQAAQBAJ",
          source: "google",
          autorId: 1,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 4,
          nombre: "La saga de los longevos 1. La Vieja Familia",
          sinopsis: "<p> <b>Nunca olvides que ser longevo no te hace inmortal. COMIENZA LA CUENTA ATRÁS. NO TE PIERDAS LA SAGA MÁS ESPERADA.</b> </p> <p>Iago del Castillo es un <b>carismático y atractivo longevo</b> de 10.300 años de edad con un cerebro prodigioso. <br> Sin embargo, cuando una mañana <b>despierta en San Francisco</b>, lejos de su hogar en Santander, no es capaz de recordar ni su nombre ni los detalles de la <b>misteriosa investigación </b>que le ha llevado hasta allí; una investigación con la que pretende descifrar los motivos por los que ni él ni los demás miembros de su familia envejecen. <br> Pero ni Iago ni Héctor, su padre, tienen intención de compartir los resultados; ellos <b>son conscientes de los riesgos</b> y el sufrimiento que implica su modo de vida. Son sus hermanos Jairo (un conflictivo escita de casi 3000 años) y Kyra (una huidiza celta de 2500 años) los que, <b>cansados de transitar solos</b> a través de los siglos y hastiados de tener que enterrar a sus hijos, están empeñados en <b>crear una estirpe de longevos</b> como ellos. <br> Al mismo tiempo, Adriana, una arqueóloga especializada en Prehistoria, está dispuesta a aprovechar que el destino la ha traído de vuelta a su Santander natal para <b>aclarar el extraño suicidio de su madre</b> ocurrido quince años atrás. <br> Desde el principio, Iago y ella <b>sentirán una poderosa atracción</b> el uno por el otro, aunque ambos intenten ignorarlo.</p>",
          imagen: "http://books.google.com/books/publisher/content?id=RRQTEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70kd1s4n3IPHpDnLbWyoFU952oe9OJfBlSWHx59NxuwsP212o1HCA_8p6oLc_Z48JSY2WowG2n-GhC9ipB_1K06PIHq9xMd5ZYByYlK-03jJd32Z7lZsM4u6VuahfqOR4xu5YoG&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=RRQTEQAAQBAJ&source=gbs_api",
          slug: "la-saga-de-los-longevos-1-la-vieja-familia",
          externalId: "RRQTEQAAQBAJ",
          source: "google",
          autorId: 2,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 5,
          nombre: "La saga de los longevos 2. Los Hijos de Adán",
          sinopsis: "<p> <b>Para un longevo el pasado siempre vuelve en forma de problemas LA CUENTA ATRÁS ESTÁ LLEGANDO A SU FIN NO TE PIERDAS LA SAGA MÁS ESPERADA DE LA AUTORA DE EL SILENCIO DE LA CIUDAD BLANCA</b> </p> <p> <b>La inesperada vuelta de Gunnarr,</b> el hijo que Iago del Castillo creyó muerto en 1602, alterará la tranquila vida que este y Adriana habían conseguido construir en Santander.</p> <p> <b>23 <i>.</i>000 a. C., Europa:</b> Lür, que teme ser el único hombre sobre la tierra, recorre un continente desolado <b>en busca del clan de Los Hijos de Adán</b> y de su legendaria matriarca, Adana, de quien se dice que no envejece.</p> <p> <b>800 d. C., Dinamarca:</b> Gunnarr se convierte en berserker, un guerrero perteneciente a <b>un grupo de mercenarios vikingos</b> que no sienten dolor.</p> <p> <b>1620 d. C., Nueva Inglaterra:</b> Urko se embarca en el Mayflower para construir la colonia de Plymouth. Allí conocerá a Manon Adams, <b>una mujer que dejará huella en él a pesar del paso del tiempo</b>.</p> <p>La Vieja Familia está a punto de descubrir que ha estado en peligro desde antes de su nacimiento, porque, para un longevo, <b>el pasado siempre vuelve en forma de problemas,</b> y estos solo acaban de empezar.</p>",
          imagen: "http://books.google.com/books/publisher/content?id=rJw0EQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE72Bs1p6XSte111ISm3BUS_UTRP1Qm84Ts_Uz_fSYrDakgVxpSyX2_CHAndAv3_xpGhThR5RhAN_AJVVOwN0Cz6dDs6WE9VV_4_1xMkxnMSgKTM-VsesM3c3v97TmoOg9J0oX_sy&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=rJw0EQAAQBAJ&source=gbs_api",
          slug: "la-saga-de-los-longevos-2-los-hijos-de-adan",
          externalId: "rJw0EQAAQBAJ",
          source: "google",
          autorId: 2,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 6,
          nombre: "La saga de los longevos 3. El Camino del Padre",
          sinopsis: "<p> <b>¿Y si la mayor amenaza para los longevos son ellos mismos? LA CUENTA ATRÁS HA LLEGADO A SU FIN. NO TE PIERDAS LA SAGA MÁS ESPERADA DE LA AUTORA DE EL SILENCIO DE LA CIUDAD BLANCA</b> </p> <p>Cinco cadáveres aparecen <b>calcinados tras una brutal explosión</b> en la clínica de Nueva York donde han operado a Nagorno para tratar de salvar su vida. Temiendo que los cuerpos pertenezcan a la Vieja Familia, en venganza por el asesinato de la sanguinaria matriarca de los Hijos de Adán, <b>Gunnarr huye con Adriana</b> para evitar ser ellos los siguientes.</p> <p> <b> <i>Bristol, 1352:</i> </b> Gunnarr vive un romance con Madre, pero cuando ella descubre que él es <b>descendiente de su gran enemigo Lür</b>, Gunnarr comprende que toda <b>la Vieja Familia está en peligro</b>.</p> <p> <b> <i>Presente, Massachusetts:</i> </b> Iago sufre una nueva laguna de memoria tras <b>ver morir a Adriana</b>. Cuando despierta, comienza a sospechar que Manon quiere <b>entregarlo a sus enemigos</b>.</p> <p> <b> <i>Presente, Java:</i> </b> Lür trata de localizar a Iago y rastrear a los líderes de las ramas del clan para <b>pactar una tregua</b>. Lo que no imagina es que Nagorno tiene sus propios planes: ser el <b>patriarca de los Hijos de Adán</b>.</p>",
          imagen: "http://books.google.com/books/publisher/content?id=K1hVEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70ZNc9VPEumzvkBs6Fxj3N3-cxXNva-IG68YP5jt05N0C0RL0q_Q4TlgAju5JPavbpc2Xq351I8aRziphnih4MvxuUAjXR-btIFWmmgl0a8uLRIOVLXJhKvH9KwrbidiwejAWff&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=K1hVEQAAQBAJ&source=gbs_api",
          slug: "la-saga-de-los-longevos-3-el-camino-del-padre",
          externalId: "K1hVEQAAQBAJ",
          source: "google",
          autorId: 2,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 7,
          nombre: "Pecados 1. Rey de la ira",
          sinopsis: "<p> <b>Déjate tentar por la nueva serie Pecados de Ana Huang.</b> </p> <p> <b>Ella es la esposa que él nunca quiso... y la debilidad que no vio venir.</b> <b> </b> </p> <p> <b>Implacable. Meticuloso. Arrogante.</b> </p> <p>Nada escapa al control del multimillonario Dante Russo, ya sea en su trabajo o en su vida.</p> <p>Nunca planeó casarse... pero el chantaje lo obliga a <b>comprometerse con Vivian Lau</b>, la heredera de un imperio de la joyería e hija de su mayor enemigo.</p> <p>No le importa lo <b> hermosa o encantadora</b> que sea. Hará todo lo que esté en su mano para liberarse de la <b>extorsión y de su compromiso</b>.</p> <p>El único problema es que <b> ahora que la tiene, no quiere dejarla ir.</b> </p> <p> <p> <b>Elegante. Ambiciosa. Cortés.</b> </p> <p>Vivian Lau es la <b>hija perfecta</b>.</p> <p>Casarse con un Russo significa abrir las puertas de un mundo que ni su familia es capaz de comprar. Dante está lejos de ser el marido que ella imaginaba para sí, pero el deber es más fuerte que cualquiera de sus deseos.</p> <p> <b>Ansiar su tacto</b> nunca fue parte del plan...</p> <p> <b>Y enamorarse de su futuro marido</b>, tampoco.</p> <p> <p>• Matrimonio de conveniencia</p> <p>• <i>Fake dating</i> </p> <p>• <i>Enemies to lovers</i> </p> <p>• Proximidad forzada</p> <p>• Billonarios</p> <p>• <i>Spicy</i> </p>",
          imagen: "http://books.google.com/books/publisher/content?id=X9QCEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71-39140sk6uRdg_as6QZi8s3qU-cjs3chPtS6EwzH4_zTISOqhPjxxAoGHT95iST_-_uN3HaBwuXCWLa16tzE1061ncRshLb2EGH-lwwqN5dRHlIYgxz1Q-cfY5-wHgh7Y6Ag-&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=X9QCEQAAQBAJ&source=gbs_api",
          slug: "pecados-1-rey-de-la-ira",
          externalId: "X9QCEQAAQBAJ",
          source: "google",
          autorId: 3,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 8,
          nombre: "Pecados 2. Rey de la soberbia",
          sinopsis: "<p> <b>Déjate tentar por la segunda entrega de la nueva serie Pecados de Ana Huang.</b> </p> <p> <b>INTROVERTIDO. CAUTELOSO. EXTREMADAMENTE CORRECTO.</b> <br> Kai depende de una votación para convertirse en el <b>CEO de su imperio familiar</b>, por lo que el <b>billonario</b> no puede permitirse el lujo de distraerse con Isabella. <b>Sofocado por responsabilidades y promesas</b>, cuando están juntos siente que finalmente puede respirar.</p> <p> <b>AUDAZ. IMPULSIVA. ALEGRE.</b> <br> Isabella no ha asistido a una sola fiesta en la que no fuera el <b>centro de atención</b> ni ha conocido a un hombre al que no <br> pueda enamorar..., excepto a Kai, que es miembro del club exclusivo en el que <b>trabaja como camarera</b>. <br> Pero aunque les cueste todo lo que tienen, no pueden resistirse a <b>caer en la tentación de sus deseos prohibidos.</b> </p> <p> <b> </p> <p>• Polos opuestos</p> <p>• Romance prohibido</p> <p>• <i>Slow burn</i> </p> <p>• Billonarios</p> <p>• <i>Spicy</i> </p>",
          imagen: "http://books.google.com/books/publisher/content?id=JW8WEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE713mim3_0Ok4hJeQ99gjoTt35gxzr9XY4w1NOjPUnrFPE33yIgAP7SUz2VKMOQlWY17uqlSssXIJFZMuDZg9MH8PfL5lPmBIYhGaVYF0WcONwo69BtUgL8CacD9lpb3N7VTpWuz&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=JW8WEQAAQBAJ&source=gbs_api",
          slug: "pecados-2-rey-de-la-soberbia",
          externalId: "JW8WEQAAQBAJ",
          source: "google",
          autorId: 3,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 9,
          nombre: "Pecados 3. Rey de la codicia",
          sinopsis: "<p> <b>Déjate tentar por la tercer entrega de la serie Pecados de Ana Huang.</b> </p> <p> <b>La tuvo, la perdió... y hará todo lo posible para recuperarla. </b> </p> <p> <b>Poderoso. Brillante. Ambicioso.</b> </p> <p> <b>Dominic Davenport</b> se convirtió en el <b>rey de Wall Street</b> a base de sangre, sudor y lágrimas.</p> <p> <b>Lo tiene todo</b>: una enorme casa, una hermosa esposa y más dinero que podría gastar en su vida.</p> <p>Pero no importa cuánto acumule, <b>nunca es suficiente</b>, y enfocado en siempre tener más, aleja a la única persona que siempre estuvo a su lado.</p> <p>Y cuando se va, Dominic se da cuenta de que hay cosas más importantes que riquezas y gloria... pero <b>ya es tarde</b>.</p> <p>La tuvo, la perdió y hará cualquier cosa por recuperarla.</p> <p> </p> <p>***</p> <p> <br> <b>Amable. Inteligente. Reflexiva.</b> </p> <p> <b>Alessandra Davenport</b> ha desempeñado el papel de <b>esposa perfecta</b> durante años.</p> <p>Acompañó a su marido mientras construía su <b>imperio</b>, pero ahora que han llegado a la <b>cima</b>, se da cuenta de que ya no es el hombre del que se enamoró.</p> <p>Cuando le queda claro que siempre estará en segundo lugar después de su trabajo, decide ponerse a sí misma en primer lugar, incluso si eso significa dejar al único hombre que ha amado.</p> <p>Pero no contaba con que Dominic se negara a dejarla ir... ni con que luchara por <b>reconstruir su matrimonio</b>, a cualquier precio.</p> <p> <p>• Segundas oportunidades</p> <p>• Crisis de pareja</p> <p>• Billonarios</p> <p>• <i>Spicy</i> </p>",
          imagen: "http://books.google.com/books/publisher/content?id=ke9BEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE72uiJaEr4cBcu89MjAlF25r-VSXSUTQXQNA7Ibe8z_WLmATrZqBQIV3ef4plHv0AM5XgFRVSo8HU1Do5iOWaaYCjAyAw8r9D7TWLSbZ7g3tQw-jd02AtAMlEu---3s97QNF7KRe&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=ke9BEQAAQBAJ&source=gbs_api",
          slug: "pecados-3-rey-de-la-codicia",
          externalId: "ke9BEQAAQBAJ",
          source: "google",
          autorId: 3,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 10,
          nombre: "Pecados 4. Rey de la desidia",
          sinopsis: "<p> <b>Déjate tentar por la cuarta entrega de la serie Pecados de Ana Huang.</b> </p> <p> <b>Encantador. Tranquilo. Despreocupado.</b> </p> <p> <b>Xavier Castillo</b> tiene el mundo a sus pies, pero, para disgusto de su padre, no tiene ningún interés en el <b>imperio familiar</b>.</p> <p>Nada le alegra más que irritar a su <b>publicista</b> y vivir de <b>fiesta</b> en fiesta, pero cuando una <b>tragedia</b> los acerca más que nunca, debe lidiar con la <b>incertidumbre</b> de su futuro y la comprensión de que la única persona inmune a sus encantos es la única a la que realmente quiere.</p> <p> <b>***</b> </p> <p> <b>Reservada. Inteligente. Ambiciosa.</b> </p> <p> <b>Sloane Kensington</b> es una <b>publicista</b> poderosa que está acostumbrada a tratar con <b>clientes difíciles</b>.</p> <p>Sin embargo, nadie la enfurece o tienta más que cierto heredero <b>multimillonario</b>, con sus estúpidos hoyuelos y su actitud relajada. </p> <p>Puede que se vea obligada a <b>trabajar con él</b>, pero nunca se <b>enamorará</b> de él... no importa lo rápido que le haga latir <b>el corazón</b> o lo considerado que sea bajo su personalidad fiestera. </p> <p>Él es su cliente y eso es todo lo que será...</p> <p> <p>• Proximidad forzada</p> <p>• <i>Grumpy/sunshine</i> </p> <p>• Billonarios</p> <p>• <i>Spicy</i> </p>",
          imagen: "http://books.google.com/books/publisher/content?id=af5cEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE73k-zD5o-qzBsFqUCyL4BKUIaMH3s9tog7kahmMEnI0Xu3Z4wqFNjVbZgW6K9EselhNffWzjrHBkeJTzeEa_vL9ZJkr4Sy5IK9CdHtkdB7PsbQ41pvRKKOGPxW4VueaJOgvwycQ&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=af5cEQAAQBAJ&source=gbs_api",
          slug: "pecados-4-rey-de-la-desidia",
          externalId: "af5cEQAAQBAJ",
          source: "google",
          autorId: 3,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 11,
          nombre: "Twisted 1. Twisted love",
          sinopsis: "<p> <b>Él tiene el corazón de hielo. Pero por ella, quemaría el mundo. </b> </p> <p>Aunque Ava Chen y Alex Volkov se conocen desde hace años, él siempre se ha mostrado distante y frío. Pero ahora que el hermano de Ava se ha ido y lo ha dejado encargado de la protección de ella, Alex parece algo menos indiferente.... Y su relación, poco a poco, se va haciendo más estrecha, hasta que llegan a confiarse sus secretos y traumas más profundos... A ella, su madre intentó ahogarla en un arrebato de locura; mientras que Alex presenció el brutal asesinato de toda su familia.</p> <p>Tras compartir sus más íntimos pensamientos, su relación dará un giro. No pueden negar que existe una fuerte atracción entre ellos, pero ninguno de los dos se atreve a dar un paso adelante. Finalmente, Ava admite la pasión que está surgiendo, y, aunque Alex intenta resistirse tanto como puede, las chispas acaban saltando... y prenden un fuego ardiente. Sin embargo, cuando todo empezaba a funcionar entre ellos, unas sorprendentes revelaciones sobre la verdad de su pasado dinamitarán su relación y pondrán en riesgo sus propias vidas.</p> <p>«Una de mis mejores lecturas del año. La química entre los protagonistas es brutal, muy adictiva y explícita. ¡Tenéis que conocer a Alex Volkov y su corazón de hielo!» <b>kay_entreletras</b> </p> <p> <b> </b>«Una historia que nos llena de aprendizaje y nos muestra la oscuridad y la luz de la vida. Para mí un 10/10.» <b>jud_books</b> </p>",
          imagen: "http://books.google.com/books/publisher/content?id=MGl1EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE72lN7b_pqoh2_k_DLXvGjydqGVucuDT24tMx14Z2wU4isXbmQCBTFWcKYt5zrVcwDOIJMRYBHLe_hdJ4hvcmt7sTpVKISFWklSOcTQOYse3tXUH9-VWCbjj47Vl166Ppq41VeAD&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=MGl1EAAAQBAJ&source=gbs_api",
          slug: "twisted-1-twisted-love",
          externalId: "MGl1EAAAQBAJ",
          source: "google",
          autorId: 3,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 12,
          nombre: "Twisted 2. Twisted Games",
          sinopsis: "<p> <b>Ella es inalcanzable... excepto para </b> <b>é</b> <b>l. Descubre la saga más explosiva del momento. </b> </p> <p>Arrogante y engreído, Rhys Larsen es un guardaespaldas de lujo que tiene dos normas:</p> <p>1) Proteger a sus clientes a toda costa.</p> <p>2) No vincularse emocionalmente. Jamás.</p> <p> <br> Y nunca tuvo la menor tentación de romper estas reglas... hasta que llegó ella.</p> <p>Ella es Bridget von Ascheberg: una princesa con un temperamento incontenible y un fuego escondido capaz de reducir a ceniza cualquier regla de Rhys.</p> <p>Esta es la historia de un amor inesperado e imposible... y lleno de fantasías prohibidas.</p>",
          imagen: "http://books.google.com/books/publisher/content?id=8BWiEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE73y178RxEB7rThRVdgk5npRK93ZHVtq7R73UF_nxu-OqcpXn1_ZoztBZigcEcJmE0EB4BTvV2RLYHfh20LBo8HbBxs5B6Q5NGlTwxb0BeuJ8kI1s5OB1pzGsFqTvUJ5bMed2sHm&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=8BWiEAAAQBAJ&source=gbs_api",
          slug: "twisted-2-twisted-games",
          externalId: "8BWiEAAAQBAJ",
          source: "google",
          autorId: 3,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 13,
          nombre: "Twisted 3. Twisted Hate",
          sinopsis: "<p> <b>Déjate seducir por la saga MÁS EXPLOSIVA.</b> </p> <p> <b>Más de 3 millones de lectoras ya han caído en la tentación de Ana Huang.</b> </p> <p> <b>Él la odia... casi tanto como la desea.</b> </p> <p> <b>Josh Chen</b> es ambicioso, arrogante y no se le resiste ninguna mujer. Ninguna excepto <b>Jules Ambrose</b>. La <b>enemistad</b> entre ellos es tan obvia como lo es su <b>deseo</b> que, desde que se conocen, no hace más que aumentar. Y, cuando la tensión por fin estalle, Josh propondrá un trato imposible de rechazar: un acuerdo entre enemigos con beneficios y <b>3 sencillas reglas</b>:</p> <p>Sin celos</p> <p>Sin condiciones.</p> <p>Y, por supuesto, sin enamorarse.</p> <p>Extrovertida y ambiciosa, Jules Ambrose ha dejado atrás un pasado de desenfreno para centrarse en un objetivo: convertirse en abogada. Y ahora mismo, lo último que necesita es involucrarse con un hombre que es tan <b>insufrible como atractivo</b>. Pero con el paso del tiempo, se dará cuenta de que Josh es mucho más de lo que aparenta.</p> <p>El hermano de su mejor amiga.</p> <p>Su némesis.</p> <p>Y su único refugio</p> <p>La suya es una pareja hecha en el infierno, y cuando los demonios de su pasado los alcancen, se enfrentarán a <b>verdades que podrían salvarlos</b>... o <b>destruirlos por completo</b>.</p>",
          imagen: "http://books.google.com/books/publisher/content?id=U47OEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71BWWJJqmCpffAV_3lvIgkzB3vGEcaJEiPX6obg7qodovnYvcBJCm00xwXXpMvVEAtumqBNDiiU8Ao-oVxfM1MXOuBue4UA4abJC41rN6PYv9FyzNaPlWN3AFmCo8JdsVCC09_y&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=U47OEAAAQBAJ&source=gbs_api",
          slug: "twisted-3-twisted-hate",
          externalId: "U47OEAAAQBAJ",
          source: "google",
          autorId: 3,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 14,
          nombre: "Twisted 4. Twisted Lies",
          sinopsis: "<p> <b>Déjate seducir por la saga MÁS EXPLOSIVA.</b> </p> <p> <b>Más de 3 millones de lectoras ya han caído en la tentación de Ana Huang.</b> </p> <p> <b>Él hará lo que sea para tenerla... incluido mentir.</b> </p> <p>Encantador, peligroso y lo suficientemente inteligente como para ocultarlo, a Christian Harper le resulta poco útil la moral y aún menos el amor, pero no puede negar la extraña atracción que siente hacia la mujer que vive justo un piso debajo de él. Ella es el objeto de sus deseos más oscuros, el único rompecabezas que no puede resolver. Y cuando surge la oportunidad de acercarse a ella, rompe sus propias reglas para ofrecerle un trato imposible de rechazar. Todos tenemos un punto débil. Ella es el suyo.</p> <p>Su obsesión.</p> <p>Su adicción.</p> <p>Su única excepción.</p> <p>Dulce, tímida e introvertida a pesar de su fama en las redes sociales, Stella Alonso es una romántica que mantiene su corazón a buen recaudo. Entre sus dos trabajos, tiene poco tiempo y ninguna gana de iniciar una relación. Pero cuando una amenaza del pasado la lleva a los brazos (y a la casa) del hombre más peligroso que jamás haya conocido, caerá en la tentación de permitirse sentir algo por primera vez en mucho tiempo. Porque, a pesar de la naturaleza fría de Christian, él la hace sentir completa cuando están juntos.</p> <p>Apasionada.</p> <p>Protegida.</p> <p>Anhelada.</p> <p>El suyo es un amor amenazado por mentiras y secretos... y cuando las verdades por fin salgan a la luz, podrían destrozarlo todo.</p>",
          imagen: "http://books.google.com/books/publisher/content?id=JYfnEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70tdhPw45YVOTX_fwihEr-HOWZyG6z71w6qCtxCJJ8e-GDoad1t0iW-c7dn5cMLKzVPWg-JDiOHTnMt307WD4cjp9jigtke78hxePcdOSX1P7IqlNnm2k0T4n6gyD6Ozi66WzGf&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=JYfnEAAAQBAJ&source=gbs_api",
          slug: "twisted-4-twisted-lies",
          externalId: "JYfnEAAAQBAJ",
          source: "google",
          autorId: 3,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 15,
          nombre: "Asesinato para principiantes",
          sinopsis: "<p>Hace cinco años, la estudiante Andie Bell fue <b>asesinada</b> por Sal Singh. La policía sabe que fue él. Sus compañeros también. Todo el mundo lo sabe.</p> <p>Pero Pippa ha crecido en la misma ciudad que ha sido y no lo tiene tan claro... Decidida a <b>desenterrar la verdad</b>, Pippa convierte este asesinato en el tema de su proyecto de final de curso. Poco a poco, empezará a <b>descubrir secretos</b> que alguien se ha empeñado en <b>ocultar</b>. Si el asesino sigue suelto ¿qué será capaz de hacer para mantener a Pippa alejada de la verdad?</p>",
          imagen: "http://books.google.com/books/publisher/content?id=Ig_MDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE73W_T-sYZ_JB6M9bxDIs31WKUMaydMcDnIN85xGrNkXOfQ6flYcCp2NlANGTfAOidPrPPEBtH8RIsvSwAOJRntMrMh9age1YztTf85HFRMxfWbIp4Qf50IecfPHoeRQQ6EPdPJ1&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=Ig_MDwAAQBAJ&source=gbs_api",
          slug: "asesinato-para-principiantes",
          externalId: "Ig_MDwAAQBAJ",
          source: "google",
          autorId: 4,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 16,
          nombre: "Desaparición para expertos",
          sinopsis: "<p>Pippa no quiere dedicarse a la <b>investigación</b>: el precio a pagar es demasiado alto. Después de <b> resolver el asesinato</b> de Andie Bell, Pippa decidió cerrar esa etapa para siempre. Y, aunque el pódcast que grabó con Ravi sobre el caso se ha hecho viral, insiste en que sus <b>días de detective</b> quedaron atrás...</p> <p>O eso es lo que ella cree. Porque cuando Jamie Reynolds desaparece y la policía no logra encontrarlo, a Pippa no le queda más remedio que volver a las andadas... Pero esta vez, todo el mundo <b>la vigila</b>.</p>",
          imagen: "http://books.google.com/books/publisher/content?id=P_sqEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE73v3dOId3q8uQL4gMPDlQ5gCUj5oUDCIHKd6LoWopo7uEmM0ATtZouzEaFJw64xDGD0VNDnWT5syTmP0vc_TsO3mhIN9J-x8ITyFat8vCrsug4hIeDGvyQza5aRX-qIcKSyNp0J&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=P_sqEAAAQBAJ&source=gbs_api",
          slug: "desaparicion-para-expertos",
          externalId: "P_sqEAAAQBAJ",
          source: "google",
          autorId: 4,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 17,
          nombre: "Venganza para víctimas",
          sinopsis: "<p> <b>Uno de los <i>thrillers</i> más absorbentes que leerás jamás. </b> </p> <p>Pip está acostumbrada a recibir <b>amenazas</b>. Tiene un podcast de <b> <i>true crime</i> </b> que se ha vuelto viral y, además, su trabajo como investigadora le ha supuesto crearse algún que otro enemigo de más. Pero de entre todos esos mensajes que le llegan, hay unos que le preocupan. Se repiten constantemente. Tan solo le hacen una pregunta, siempre la misma: «¿Quién te buscará cuando seas tú la que desaparezca?»</p> <p>Sus <b>sospechas</b> se confirman cuando se da cuenta de que, quien le envía esos anónimos, ha pasado de amenazarla a perseguirla. Y todo irá a peor cuando encuentre similitudes entre la forma de actuar de <b>su acosador y un asesino</b> que, en teoría, está en la cárcel desde hace años... O ¿puede ser que un inocente esté entre rejas y el asesino ande suelto? Sea como sea, Pip debe encontrar las respuestas necesarias o, esta vez sí, será ella la que desaparecerá...</p>",
          imagen: "http://books.google.com/books/publisher/content?id=eXltEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71s-Ugpcl0lVkdWCTmndpphw09FDjISODwrZSFXq_5d5qbpouJbcUG48FvnqbPex7IyCPU0HjZKN3gDU0fpn7Qv2ESfFx-iuxWB0KTlMAx4k-yRm5b1ymcDTiibjE_OcSCy4G1-&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=eXltEAAAQBAJ&source=gbs_api",
          slug: "venganza-para-victimas",
          externalId: "eXltEAAAQBAJ",
          source: "google",
          autorId: 4,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 18,
          nombre: "Romper el círculo (It Ends with Us)",
          sinopsis: "<p>A veces, quien más te quiere es quién más daño te hace. <br> <b> </p> <p>Lily no siempre lo ha tenido fácil. Por eso, su idílica relación con un magnífico neurocirujano llamado Ryle Kincaid, parece demasiado buena para ser verdad. Cuando Atlas, su primer amor, reaparece repentinamente y Ryle comienza a mostrar su verdadera cara, todo lo que Lily ha construido con él se ve amenazado. </p> <p>«Nadie escribe sobre sentimientos como Colleen Hoover.» Anna Todd</p> <p> <b> </p>",
          imagen: "http://books.google.com/books/publisher/content?id=6fNjEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE72iJVYClGvzhWcvDud9iQLwbq67N1tQ6wKdKZTGbEWsmoD1nOCPV35_8W81EvpUt3I48GaHeS3_-y0MI7gIsyYuKdgHLX0oG8OYbJLUPemtvTG6kwKOBjFe6do4mvJiZn6LvS4l&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=6fNjEAAAQBAJ&source=gbs_api",
          slug: "romper-el-circulo-it-ends-with-us",
          externalId: "6fNjEAAAQBAJ",
          source: "google",
          autorId: 5,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 19,
          nombre: "Volver a empezar (It Starts with Us)",
          sinopsis: "<p> <b>Todo final tiene un principio. Y todo empezó con Atlas.</b> </p> <p> <b>La esperada continuación de <i>Romper el círculo (It Ends with Us)</i>.</b> </p> <p> Lily y su exmarido, Ryle, acaban de pactar la custodia compartida de su niña cuando Lily se encuentra de nuevo con su primer amor, Atlas. Después de casi dos años separados, está entusiasmada porque, por una vez, el tiempo está de su lado, e inmediatamente dice que sí cuando Atlas le pide una cita. </p> <p> Pero su alegría se desvanece cuando piensa que, aunque ya no están casados, Ryle sigue teniendo un papel en la familia, y no consentirá que Atlas Corrigan esté presente en su vida y en la de su hija. </p> <p>V <i> olver a empezar </i> alterna entre las perspectivas de Lily y Atlas y continúa justo donde nos dejó <i>Romper el círculo</i>. Descubriremos más sobre el pasado de Atlas y seguiremos a Lily en busca de una segunda oportunidad de encontrar el amor verdadero mientras tiene que lidiar con un exmarido celoso. <b> </p>",
          imagen: "http://books.google.com/books/publisher/content?id=SPSaEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71zBxznWeJ27CCEVRp9sitfYqM41GERsnlEfuS90lCGT66aMhsGucUfET4KH0x_SYd8kGycX3G8DSlu7QqPa3kDidnm8t-O8khPuratHOueQbkSH3w0DcdzrzPDavoTctepJnuI&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=SPSaEAAAQBAJ&source=gbs_api",
          slug: "volver-a-empezar-it-starts-with-us",
          externalId: "SPSaEAAAQBAJ",
          source: "google",
          autorId: 5,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 20,
          nombre: "El Club del Crimen de los Jueves",
          sinopsis: "<p> <b>Descubre la novela que ha inspirado la nueva película de Netflix. Producida por Steven Spielberg y con un reparto liderado por Helen Mirren y Pierce Brosnan. ¿Listo para unirte al club?</b> </p> <p>En un pacífico complejo privado para jubilados, cuatro improbables amigos se reúnen una vez a la semana para revisar antiguos casos de asesinatos locales que quedaron sin resolver. Ellos son Ron, un exactivista socialista lleno de tatuajes y revolución; la dulce Joyce, una viuda que no es tan ingenua como aparenta; Ibrahim, un antiguo psiquiatra con una increíble capacidad de análisis, y la tremenda y enigmática Elizabeth, que, a sus 81 años, lidera el grupo de investigadores aficionados... o no tanto.</p> <p>Cuando un promotor inmobiliario de la zona es hallado muerto con una misteriosa fotografía junto al cuerpo, El Club del Crimen de los Jueves se encuentra en medio de su primer caso real. Aunque sean octogenarios, los cuatro amigos guardan algunos trucos en la manga.</p> <p> <b>¿Podrá este grupo poco ortodoxo pero brillante atrapar al asesino?</b> </p> <p> <b>No subestimes el talento de un grupo de abuelos.</b> <b> <b> </p> <p> <p> <b> </p> <p> <b>Los lectores dicen:</b> </p> <p>«Entrañable, entretenidísima y divertida.»</p> <p>«Con tanto ritmo que pasa volando.»</p> <p>«Fácil, divertida... a ratos tierna, a ratos irónica.» </p> <p>«No voy a dejar de recomendarlo a todos mis amigos.»</p> <p>«Me recuerda a Miss Marple de Agatha Christie.»</p> <p>",
          imagen: "http://books.google.com/books/publisher/content?id=6OnzDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE736efYMh9r-f0RZ_GB_qIWKoe19PBY__KI4kk-wdoj8Vexz8htJ4LrbavAtwvKvGmdEueKA1bWNmQJx9xZIoFTSUCcnCL28gCKWju73n4162sRHXeM0RXBNkYLjy_HToJ1etsS5&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=6OnzDwAAQBAJ&source=gbs_api",
          slug: "el-club-del-crimen-de-los-jueves",
          externalId: "6OnzDwAAQBAJ",
          source: "google",
          autorId: 6,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 21,
          nombre: "El Jueves Siguiente",
          sinopsis: "Elizabeth, Joyce, Ron e Ibrahim, los cuatro miembros del Club del Crimen de los Jueves, todavía están celebrando haber resuelto su primer caso de asesinato. Con el barullo de la investigación ya a sus espaldas, se preparan para una merecida temporada de descanso y relajación en Cooper's Chase, su elegante comunidad de jubilados. Pero parece que no va a haber suerte porque pocos días después llegará una visita inesperada: un viejo amigo de Elizabeth ha cometido un peligroso error, está en serios apuros, y ha acudido a ella como último recurso. Su historia incluye unos diamantes robados, un mafioso volátil e impaciente y una amenaza muy real a su vida. Más de 1.400.000 lectores ya se han unido al Club del Crimen de los Jueves. Resolver un nuevo asesinato no formaba parte de sus planes de jubilación.",
          imagen: "http://books.google.com/books/content?id=-AKyzgEACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73iMOwlhRAMeHtvOb_ZOp4Qy87rVbzEoOxdscc85QL2d0hjTkbzPsNZL8fE__vgg7Z1dN1Pj1lFcT3HExpPuY0pGtEM5P7YIWijda3UIoq6gx32fj8Tv7x_OE-E-sB2pup7XtQ4&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=-AKyzgEACAAJ&source=gbs_api",
          slug: "el-jueves-siguiente",
          externalId: "-AKyzgEACAAJ",
          source: "google",
          autorId: 6,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 22,
          nombre: "El último en morir",
          sinopsis: "<p> <b>La esperada nueva entrega de El Club del Crimen de los Jueves, la serie de los abuelos investigadores que ha cautivado a 11.000.000 de lectores.</b> </p> <p>Es Navidad en el complejo residencial de Cooper's Chase y todos esperan disfrutar de unos días de descanso en buena compañía. Pero si eres miembro del Club del Crimen de los Jueves, nunca hay un momento de sosiego. Cuando reciben la noticia de que un viejo amigo ha sido asesinado mientras custodiaba un peligroso paquete, el cuarteto de detectives aficionados se lanza a resolver el misterio.</p> <p>Su búsqueda los lleva a una tienda de antigüedades, donde pronto descubren que los secretos que esconde este oficio son tan antiguos como los objetos mismos. Mientras se cruzan con falsificadores de arte, traficantes de droga y estafadores, Elisabeth, Joyce, Ron e Ibrahim no saben en quién pueden confiar. Con el número de cadáveres rápidamente en aumento, el tiempo en contra y el peligro pisándoles los talones, ¿se les habrá acabado la suerte a nuestros intrépidos investigadores? </p> <p>Bienvenidos a...EL ÚLTIMO EN MORIR.</p>",
          imagen: "http://books.google.com/books/publisher/content?id=C_fNEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70qmlX9vCSg01EyQoR8CECuuTdBlxd9WbTg9zovahOdpb0zdCP4kIHz_ZczvF9euBC19b6U4Ave73KphA8Twy8whQvPEi7pR83x4vMXSIpLSImcF11adBVuLKk7-monX0Cj3g9T&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=C_fNEAAAQBAJ&source=gbs_api",
          slug: "el-ultimo-en-morir",
          externalId: "C_fNEAAAQBAJ",
          source: "google",
          autorId: 6,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 23,
          nombre: "Harry Potter y la piedra filosofal",
          sinopsis: "<p>Con las manos temblorosas, Harry le dio la vuelta al sobre y vio un sello de lacre púrpura con un escudo de armas: un león, un águila, un tejón y una serpiente, que rodeaban una gran letra H.<br><br>Harry Potter nunca había oído nada sobre Hogwarts cuando las cartas comienzan a caer en el felpudo del número cuatro de Privet Drive. Escritas en tinta verde en un pergamino amarillento con un sello morado, sus horribles tíos las han confiscado velozmente. En su undécimo cumpleaños, un hombre gigante de ojos negros llamado Rubeus Hagrid aparece con una noticia extraordinaria: Harry Potter es un mago y tiene una plaza en el Colegio Hogwarts de Magia y Hechicería. ¡Una aventura increíble está a punto de empezar!<br><br>Esta edición está traducida al castellano. Existe otra edición disponible para los lectores de español latinoamericano.<br><br><br><i>Tema musical compuesto por James Hannigan.</i></p>",
          imagen: "http://books.google.com/books/content?id=2zgRDXFWkm8C&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE72oNTDsX-dsEfQMcqYrgrTk-ZnURwKmP5hewuf32AIP_uOpeykoGECdxXDZfKYQlYd-omI8EyTFF-YOwFQZoTwksqJ36ONRqrb7MOp0BsUwmfOlAVfXUIcrRFgbZrQYk836C8C8&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=2zgRDXFWkm8C&source=gbs_api",
          slug: "harry-potter-y-la-piedra-filosofal",
          externalId: "2zgRDXFWkm8C",
          source: "google",
          autorId: 7,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 24,
          nombre: "Harry Potter y la cámara secreta",
          sinopsis: "<p>«Hay una conspiración, Harry Potter. Una conspiración para hacer que este año sucedan las cosas más terribles en el Colegio Hogwarts de Magia y Hechicería.»<br><br>El verano de Harry Potter ha incluido el peor cumpleaños de su vida, unos presagios muy poco halagüeños por parte de un elfo doméstico llamado Dobby y ser rescatado de casa de los Dursleys por su amigo Ron Weasley en un coche mágico volador. Cuando regresa al Colegio Hogwarts de Magia y Hechicería para cursar su segundo año, Harry escucha susurros extraños por los pasillos vacíos del colegio... Y luego comienzan los ataques. Se encuentran a estudiantes convertidos en piedra... Los terribles presagios de Dobby parecen hacerse realidad.<br><br>Esta edición está traducida al castellano. Existe otra edición disponible para los lectores de español latinoamericano.<br><br><i>Tema musical compuesto por James Hannigan.</i></p>",
          imagen: "http://books.google.com/books/content?id=zl13g5uRM4EC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71jcKyLiXUfCdhZ98z2fGHq6TCp_ojxHLt20v065sU-GqfmSn5WOko2J2zQLdRZQzDC2-114g0s7xJdRhCadB1zS8k9-1A74uje669loq-jrQa3adDl80WrY5gABFS7Ldj34U3H&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=zl13g5uRM4EC&source=gbs_api",
          slug: "harry-potter-y-la-camara-secreta",
          externalId: "zl13g5uRM4EC",
          source: "google",
          autorId: 7,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 25,
          nombre: "Harry Potter y el prisionero de Azkaban",
          sinopsis: "During his third year at Hogwarts School for Witchcraft and Wizardry, Harry Potter must confront the devious and dangerous wizard responsible for his parents' deaths.",
          imagen: "http://books.google.com/books/content?id=N-HcPAAACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70DSX6EqsMdpRoXpUAvQ4yc8gECsi4lX1ltFg7dTPnWB43iOjw4IgxRARhasSdX9ByqMWVrCv_i5VEC3MFRvja_hsTWRdifeDs0aS_iel_rMnHXr9QWw_6A0cSTM7_UhNikBQTg&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=N-HcPAAACAAJ&source=gbs_api",
          slug: "harry-potter-y-el-prisionero-de-azkaban",
          externalId: "N-HcPAAACAAJ",
          source: "google",
          autorId: 8,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 26,
          nombre: "Harry Potter y el cáliz de fuego",
          sinopsis: "<p>«Habrá tres pruebas, espaciadas en el curso escolar, que medirán a los campeones en muchos aspectos diferentes: sus habilidades mágicas, su osadía, sus dotes de deducción y, por supuesto, su capacidad para sortear el peligro.»<br><br>El Torneo de los Tres Magos se va a celebrar en Hogwarts. Solo los magos mayores de diecisiete años pueden participar, pero eso no impide a Harry fantasear con la posibilidad de ganar la competición. Tiempo después, en Halloween, el Cáliz de Fuego elige a los competidores y Harry se asombra al descubrir que su nombre está entre los elegidos por la copa mágica. Se enfrentará a tareas mortales, dragones y magos oscuros, pero con la ayuda de sus mejores amigos, Ron y Hermione, ¡puede que consiga salir vivo de esta!<br><br>Esta edición está traducida al castellano. Existe otra edición disponible para los lectores de español latinoamericano.<br><br><i>Tema musical compuesto por James Hannigan.</i></p>",
          imagen: "http://books.google.com/books/content?id=R2daemCCiF8C&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70uLYsYg-2Vf1cyhNCTS_dbLAlrQpkRqrGK3L58mosZiyxYntyNV13L3iQvV1zUzyJUfOLU4AzEuiHN8cIPXttA-2KhuMCOMKGBBeZLmxZuKVMjfny62ckPnvg8S7XQFg9u2H8D&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=R2daemCCiF8C&source=gbs_api",
          slug: "harry-potter-y-el-caliz-de-fuego",
          externalId: "R2daemCCiF8C",
          source: "google",
          autorId: 7,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 27,
          nombre: "Harry Potter y la Orden del Fénix",
          sinopsis: "<p>«Compartes los pensamientos y las emociones con el Señor Tenebroso. El director cree que no es conveniente que eso continúe ocurriendo. Quiere que te enseñe a cerrar tu mente al Señor Tenebroso.»<br><br>La oscuridad se ciñe sobre Hogwarts. Tras el ataque de los dementores a su primo Dudley, Harry Potter sabe que Voldemort no se detendrá ante nada hasta dar con él. Hay muchos que niegan la vuelta del Señor Tenebroso, pero Harry no está solo: una orden secreta se reúne en Grimmauld Place para luchar contra las fuerzas oscuras. Harry debe permitir que el profesor Snape le enseñe a protegerse contra los brutales ataques de Voldemort a su mente. Pero cada día son más fuertes y Harry se está quedando sin tiempo...<br><br>Esta edición está traducida al castellano. Existe otra edición disponible para los lectores de español latinoamericano.<br><br><i>Tema musical compuesto por James Hannigan.</i></p>",
          imagen: "http://books.google.com/books/content?id=uUOBPgXQtvUC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71vFn3pq5Z9NEvh0_d1HqIDJ0iyGVqpBjGHCJC85VEhLs0E1dg8luFZ4YdlcJR0TAdik62TRymbH7cN5_VhN0-ilaXnJ2libl7LJJHg_BrulSCV3vJoXIRYvYdjl8GKweA3MzY2&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=uUOBPgXQtvUC&source=gbs_api",
          slug: "harry-potter-y-la-orden-del-fenix",
          externalId: "uUOBPgXQtvUC",
          source: "google",
          autorId: 7,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 28,
          nombre: "Harry Potter Y El Misterio Del Principe",
          sinopsis: "This must-read fantasy takes the reader back to Hogwarts for Harry's sixth year. What's in store for the wizard and his friends? What evil does his greatest enemy have planned? And who is the half-blood prince? Find out in this long-awaited adventure",
          imagen: "http://books.google.com/books/content?id=K5dBAAAACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73kXNLeiEIz6DPEVFj3-uicO9ft44xVDz4yT1f9_phAgjkvFw-rJ3TjmZsdgGKM3ozCdmiWInvhOdORnXY6OQmyw1rKYWgTZp1af3XrCBk_yFkuwXwtTSGMIbX-yHCUC72ltgGy&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=K5dBAAAACAAJ&source=gbs_api",
          slug: "harry-potter-y-el-misterio-del-principe",
          externalId: "K5dBAAAACAAJ",
          source: "google",
          autorId: 8,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 29,
          nombre: "Harry Potter y Las Reliquias de la Muerte (Harry Potter and the Deathly Hallows)",
          sinopsis: "Harry Potter sets out on a final quest to stop his archenemy, the evil Lord Voldemort, with his friends, Ron Weasley and Hermione Granger, before the wizarding world can be destroyed by Voldemort and his Death Eaters.",
          imagen: "http://books.google.com/books/content?id=O4lWzwEACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70MPdfSYT5JUy_-qP28jl5B5Qh_hH2H2Ye0DF-hIOM9mVGlFFMZWAvrtuwzwo2xwDyfH5snpateLWYyLG0fuA9PtBaZKfvuyBKxOtuOpDXEbrR34oZ5K2_qr9r9alp0APa5TL8X&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=O4lWzwEACAAJ&source=gbs_api",
          slug: "harry-potter-y-las-reliquias-de-la-muerte-harry-potter-and-the-deathly-hallows",
          externalId: "O4lWzwEACAAJ",
          source: "google",
          autorId: 8,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 30,
          nombre: "The Hobbit",
          sinopsis: "<p>This is the story of how a Baggins had an adventure, and found himself doing and saying things altogether unexpected…</p><p>‘A flawless masterpiece’</p><p>The Times</p><p>Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely travelling further than the pantry of his hobbit-hole in Bag End. But his contentment is disturbed when the wizard, Gandalf, and a company of thirteen dwarves arrive on his doorstep one day, to whisk him away on a journey ‘there and back again’. They have a plot to raid the treasure hoard of Smaug the Magnificent, a large and very dangerous dragon…</p><p><br></p><p>The prelude to THE LORD OF THE RINGS, THE HOBBIT has sold many millions of copies since its publication in 1937, establishing itself as one of the most beloved and influential books of the twentieth century.</p>",
          imagen: "http://books.google.com/books/publisher/content?id=Vbb3EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71QiWfuvn3RWTZZRJn5qQL12xmBFHaDbcuMGayAMybzMcUDja5v1mmUu60X0PWSdDGYZybihRbir8LnOZcVVK8KjnfBNnK-vSJGwXJannV4MbJ637Ue4Ujs1qeEW-MDNeiH5qOq&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=Vbb3EAAAQBAJ&source=gbs_api",
          slug: "the-hobbit",
          externalId: "Vbb3EAAAQBAJ",
          source: "google",
          autorId: 9,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 31,
          nombre: "The Fellowship of the Ring (The Lord of the Rings, Book 1)",
          sinopsis: "Darkness Will Bind Them... watch The Lord of the Rings: The Rings of Power season 2 on Prime Video The first part of J. R. R. Tolkien’s epic adventure THE LORD OF THE RINGS <p> ‘A most remarkable feat’ </p> <p> Guardian </p> <p>In a sleepy village in the Shire, a young hobbit is entrusted with an immense task. He must make a perilous journey across Middle-earth to the Cracks of Doom, there to destroy the Ruling Ring of Power – the only thing that prevents the Dark Lord Sauron’s evil dominion.</p> <p>Thus begins J. R. R. Tolkien’s classic tale of adventure, which continues in The Two Towers and The Return of the King.</p>",
          imagen: "http://books.google.com/books/content?id=xFr92V2k3PIC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70GdpTSLDdYrqMWo6gW-OcDeUeXSz2SSNPBYPjnqgJ2XRQGcTppE87ZHt9TggvgcsbNiJBvtOrj1WfOYKQv6xiM7ID0oZwR_W5Qy7SdMQ4F9Hs1YdyULxOmUPq9BvBywntniHKQ&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=xFr92V2k3PIC&source=gbs_api",
          slug: "the-fellowship-of-the-ring-the-lord-of-the-rings-book-1",
          externalId: "xFr92V2k3PIC",
          source: "google",
          autorId: 9,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 32,
          nombre: "The Two Towers",
          sinopsis: "The second part of Tolkien's epic masterpiece, The Lord of the Rings, featuring an exclusive cover designed to complement the new 'History of Middle-earth' series. This edition, styled to complement the new 'History of Middle-earth' series, tells the story of Frodo and the Companions of the Ring, who have been beset by danger during their quest to prevent the Ruling Ring from falling into the hands of the Dark Lord by destroying it in the Cracks of Doom. They have lost the wizard, Gandalf, in the battle with an evil spirit in the Mines of Moria; and at the Falls of Rauros, Boromir, seduced by the power of the Ring, tried to seize it by force. While Frodo and Sam made their escape the rest of the company were attacked by Orcs. Now they continue their journey alone down the great River Anduin -- alone, that is, save for the mysterious creeping figure that follows wherever they go.",
          imagen: "http://books.google.com/books/content?id=_yI_c7_c4ZMC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73KRtDFtm1Lbza9wg4T_IPmimDDFKVQ_4oY1gTOInQZEnGwc5h_o1i2A-RVP64HPsy03Ukk5DC5_uZEqqF_wULA4T8InRp3WAJixzH0t0CIj9-1GMWfRsP87GmxoYBS8-Wbb74D&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=_yI_c7_c4ZMC&source=gbs_api",
          slug: "the-two-towers",
          externalId: "_yI_c7_c4ZMC",
          source: "google",
          autorId: 10,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 33,
          nombre: "The Return of the King (The Lord of the Rings, Book 3)",
          sinopsis: "<p> Darkness Will Bind Them... watch The Lord of the Rings: The Rings of Power season 2 on Prime Video </p> The third part of J.R.R. Tolkien’s epic adventure THE LORD OF THE RINGS <p> ‘Extraordinarily imaginative, and wholly exciting’ </p> <p> The Times </p> <p>The armies of the Dark Lord are massing as his evil shadow spreads even wider. Men, Dwarves, Elves and Ents unite forces to battle against the Dark. Meanwhile, Frodo and Sam struggle further into Mordor in their heroic quest to destroy the One Ring.</p> <p>The devastating conclusion of J.R.R. Tolkien’s classic tale of adventure, begun in The Fellowship of the Ring and The Two Towers.</p>",
          imagen: "http://books.google.com/books/content?id=dQkFLM8_5ZEC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE73ynzTJkOW7G6ouAKP-qaLYVp3ANQp2E0Wpy5E0Bde4DO5hTykfsRzOeuhq8g11kBjWTYRtUPSbNUhtyaYOUbdFVrSNvockqIjVQH4DgII9weEyo3FvF3Kshew06zHMtEXJezdJ&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=dQkFLM8_5ZEC&source=gbs_api",
          slug: "the-return-of-the-king-the-lord-of-the-rings-book-3",
          externalId: "dQkFLM8_5ZEC",
          source: "google",
          autorId: 9,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 34,
          nombre: "The Silmarillion",
          sinopsis: "<p> The forerunner to The Lord of the Rings, The Silmarillion tells the earlier history of Middle-earth, recounting the events of the First and Second Ages, and introducing some of the key characters, such as Galadriel, Elrond, Elendil and the Dark Lord, Sauron. </p> <p>The Silmarillion is an account of the Elder Days, of the First Age of Tolkien’s world. It is the ancient drama to which the characters in The Lord of the Rings look back, and in whose events some of them such as Elrond and Galadriel took part. The tales of The Silmarillion are set in an age when Morgoth, the first Dark Lord, dwelt in Middle-Earth, and the High Elves made war upon him for the recovery of the Silmarils, the jewels containing the pure light of Valinor.</p> <p>Included in the book are several shorter works. The Ainulindale is a myth of the Creation and in the Valaquenta the nature and powers of each of the gods is described. The Akallabeth recounts the downfall of the great island kingdom of Númenor at the end of the Second Age and Of the Rings of Power tells of the great events at the end of the Third Age, as narrated in The Lord of the Rings.</p>",
          imagen: "http://books.google.com/books/content?id=05Cj67qkoaoC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71DSAX6QQug6TDKa7iKye-7M1BkVLY46D9yhmKtChSiG4ShPCrmWSo9EuoFVA3DdS_uaC7i1gtwgoOLLhfY_ej4tL2Kd9ZXr7SloDorcDNkNno4J34o2FZxF5gKiPu9vKzoGTPE&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=05Cj67qkoaoC&source=gbs_api",
          slug: "the-silmarillion",
          externalId: "05Cj67qkoaoC",
          source: "google",
          autorId: 9,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 35,
          nombre: "Unfinished Tales Illustrated Edition",
          sinopsis: "<p>To celebrate its 40th anniversary, the first ever illustrated edition of this collection of tales which takes readers further into the stories told in J.R.R. Tolkien's The Hobbit, The Lord of the Rings, and The Silmarillion. Unfinished Tales features 18 full-color paintings from critically acclaimed Tolkien artists, Alan Lee, John Howe, and Ted Nasmith, which reveal the three Ages of Middle-earth like never before.</p> <p>Unfinished Tales is a collection of narratives ranging in time from the Elder Days of Middle-earth to the end of the War of the Ring, and provides those who have read The Hobbit and The Lord of the Rings with a whole collection of background and new stories.</p> <p>The book concentrates on the realm of Middle-earth and comprises such elements as The Quest of Erebor, Gandalf's lively account of how it was that he came to send the Dwarves to the celebrated party at Bag-End; the emergence of the sea-god Ulmo before the eyes of Tuor on the coast of Beleriand; and an exact description of the military organization of the Riders of Rohan.</p> <p>Unfinished Tales also contains the only story about the long ages of Númenor before its downfall, and all that is known about such matters as the Five Wizards, the Palantíri and the legend of Amroth. The tales were edited by Christopher Tolkien, who provides a short commentary on each story, helping the reader to fill in the gaps and put each story into the context of the rest of his father's writings.</p> <p>In celebration of its 40th anniversary, this jacketed hardcover of Unfinished Tales includes 18 gorgeous paintings depicting scenes from the First, Second, and Third Ages of Middle-earth from critically acclaimed Tolkien artists, Alan Lee, John Howe, and Ted Nasmith.</p>",
          imagen: "http://books.google.com/books/content?id=qdtZzQEACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE7279n_i0pJR_AJRAwRC2X4CM6p8SXTLHbLABfTuzStVPrmYdv6nBhjSnOPyvNzAZXLTFoRW3g7sFyQHxo0KTz8V9OOoHWWMx5dXnWHUNV24X5AomZEjQwZCJ46p12fuLrVZsCEJ&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=qdtZzQEACAAJ&source=gbs_api",
          slug: "unfinished-tales-illustrated-edition",
          externalId: "qdtZzQEACAAJ",
          source: "google",
          autorId: 9,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 36,
          nombre: "The Children Of Húrin",
          sinopsis: "<p>One of the three 'Great Tales' of the Elder Days, J.R.R. Tolkien's The Children of Húrin takes place in Middle-earth thousands of years before the events of The Hobbit and The Lord of the Rings.</p><p>The Children of Húrin is the first complete book by Tolkien since the 1977 publication of The Silmarillion. Six thousand years before the One Ring is destroyed, Middle-earth lies under the shadow of the Dark Lord Morgoth. The greatest warriors among elves and men have perished, and all is in darkness and despair. But a deadly new leader rises, Túrin, son of Húrin, and with his grim band of outlaws begins to turn the tide in the war for Middle-earth—awaiting the day he confronts his destiny and the deadly curse laid upon him.</p>",
          imagen: "http://books.google.com/books/content?id=SSDxnx-ozrUC&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70ii-ucXcC8mP7P7B2adDP6DXSHUAofp6ZJEAMJSFn-tGTk5dPweuXC7_r7X6ZC5cVAeILAbb0NXRhb4eZYhAGwklcG9hXk8SuDib2A5Y1vlnYuWKZOcI1Y1luqUoElWE7DIEjX&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=SSDxnx-ozrUC&source=gbs_api",
          slug: "the-children-of-hurin",
          externalId: "SSDxnx-ozrUC",
          source: "google",
          autorId: 11,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 37,
          nombre: "Beren and Lúthien",
          sinopsis: "<p> Painstakingly restored from Tolkien’s manuscripts and presented for the first time as a continuous and standalone story, the epic tale of Beren and Lúthien will reunite fans of The Hobbit and The Lord of the Rings with Elves and Men, Dwarves and Orcs and the rich landscape and creatures unique to Tolkien’s Middle-earth. </p> <p>The tale of Beren and Lúthien was, or became, an essential element in the evolution of The Silmarillion, the myths and legends of the First Age of the World conceived by J.R.R. Tolkien. Returning from France and the battle of the Somme at the end of 1916, he wrote the tale in the following year.</p> <p>Essential to the story, and never changed, is the fate that shadowed the love of Beren and Lúthien: for Beren was a mortal man, but Lúthien was an immortal Elf. Her father, a great Elvish lord, in deep opposition to Beren, imposed on him an impossible task that he must perform before he might wed Lúthien. This is the kernel of the legend; and it leads to the supremely heroic attempt of Beren and Lúthien together to rob the greatest of all evil beings, Melkor, called Morgoth, the Black Enemy, of a Silmaril.</p> <p>In this book Christopher Tolkien has attempted to extract the story of Beren and Lúthien from the comprehensive work in which it was embedded; but that story was itself changing as it developed new associations within the larger history. To show something of the process whereby this legend of Middle-earth evolved over the years, he has told the story in his father's own words by giving, first, its original form, and then passages in prose and verse from later texts that illustrate the narrative as it changed. Presented together for the first time, they reveal aspects of the story, both in event and in narrative immediacy, that were afterwards lost.</p>",
          imagen: "http://books.google.com/books/publisher/content?id=gmlIDQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE70BP44edi9cYOVqibOCAJC8fH86_4AUmuHwce0nAL1LiuTmz38IZMgRUJvGatjiiBKQrtvgB6Rev-xmKaOsBJlOwlHG80ScKUoDB2WpmWAyEEFj27NZHe7HjF1LN5brq9ra2IJn&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=gmlIDQAAQBAJ&source=gbs_api",
          slug: "beren-and-luthien",
          externalId: "gmlIDQAAQBAJ",
          source: "google",
          autorId: 9,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 38,
          nombre: "Keruntuhan Gondolin (The Fall of Gondolin)",
          sinopsis: "Gondolin, kota permai yang tersembunyi, dibangun dan dihuni oleh Elves Noldor yang memberontak semasa tinggal di Valinor, negeri para dewa. Raja mereka adalah Turgon, yang paling dibenci dan ditakuti oleh Morgoth. Sia-sia Morgoth mencari keberadaan kota tersembunyi ini, sementara dewa-dewa di Valinor lebih banyak berdiam diri, tak mau membantu. Kecuali Ulmo, sang Penguasa Perairan. Ulmo mengirim Tuor, sepupu Túrin Turambar, sebagai pembawa pesan ke Gondolin. Dalam balutan jubah Ulmo, Tuor berangkat dari negeri kelahirannya untuk mencari Turgon. Di kerajaan tersembunyi ini, takdirnya terpenuhi: Tuor menjadi pahlawan besar, menikah dengan Idril, putri Turgon, dan putra mereka adalah Eärendel yang kelak datang menghadap Valar untuk memohon belas kasihan bagi anak-anak Iluvatar, sebagaimana dikisahkan dalam  The Silmarillion.",
          imagen: "http://books.google.com/books/publisher/content?id=1KxWEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE72Z7WWfOLU_yl-_RgjKkjnZ30Oqv4RsB8e1IrwG-gjknELg7e-vz1pzgwJznGNiyVcqhuiNa3pQpY6G9n0k6mO2lZKjTitelTjq0muXiprDXDmm-TPIWOVgRP1JlJh27vzo1iPl&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=1KxWEAAAQBAJ&source=gbs_api",
          slug: "keruntuhan-gondolin-the-fall-of-gondolin",
          externalId: "1KxWEAAAQBAJ",
          source: "google",
          autorId: 11,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 39,
          nombre: "The Fall of Númenor",
          sinopsis: "<p>J. R. R. Tolkien’s writings on the Second Age of Middle-earth, collected for the first time in one volume complete with new illustrations in watercolor and pencil by renowned artist Alan Lee.</p><p>J.R.R. Tolkien famously described the Second Age of Middle-earth as a \"dark age, and not very much of its history is (or need be) told.\" And for many years readers would need to be content with the tantalizing glimpses of it found within the pages of The Lord of the Rings and its appendices, including the forging of the Rings of Power, the building of the Barad-dûr and the rise of Sauron.</p><p>It was not until Christopher Tolkien published The Silmarillion after his father’s death that a fuller story could be told. Although much of the book’s content concerned the First Age of Middle-earth, there were at its close two key works that revealed the tumultuous events concerning the rise and fall of the island of Númenor. Raised out of the Great Sea and gifted to the Men of Middle-earth as a reward for aiding the angelic Valar and the Elves in the defeat and capture of the Dark Lord Morgoth, the kingdom became a seat of influence and wealth; but as the Númenóreans’ power increased, the seed of their downfall would inevitably be sown, culminating in the Last Alliance of Elves and Men.</p><p>Even greater insight into the Second Age would be revealed in subsequent publications, first in Unfinished Tales of Númenor and Middle-earth, then expanded upon in Christopher Tolkien’s magisterial twelve-volume The History of Middle-earth, in which he presented and discussed a wealth of further tales written by his father, many in draft form.</p><p>Now, adhering to the timeline of \"The Tale of Years\" in the appendices to The Lord of the Rings, editor Brian Sibley has assembled into one comprehensive volume a new chronicle of the Second Age of Middle-earth, told substantially in the words of Tolkien from the various published texts, with new illustrations in watercolor and pencil by the doyen of Tolkien art, Alan Lee.</p>",
          imagen: "http://books.google.com/books/publisher/content?id=owZwEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE72F68R8xCJs8emGwPFDFYsRb2txtrDBUDXQDm8VUh5uw8mjIbPZSgc1i1Z6w_eSI61GZNHquLtZUo1dbxTiAccEjvtkfCMOsI5pBCLDgF4kT-p_XPcD0u_wnWaPELGZrIEaMF0k&source=gbs_api",
          enlace: "https://play.google.com/store/books/details?id=owZwEAAAQBAJ&source=gbs_api",
          slug: "the-fall-of-numenor",
          externalId: "owZwEAAAQBAJ",
          source: "google",
          autorId: 9,
          categoriaId: null,
          editorialId: null,
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        }
      ],
      sagas: [
        {
          id: 1,
          nombre: "Serie Empíreo",
          libroExternalIds: ["6PjIEAAAQBAJ", "OJjkEAAAQBAJ", "VpQnEQAAQBAJ"],
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 2,
          nombre: "La saga de los longevos",
          libroExternalIds: ["RRQTEQAAQBAJ", "rJw0EQAAQBAJ", "K1hVEQAAQBAJ"],
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 3,
          nombre: "Serie Pecados",
          libroExternalIds: ["X9QCEQAAQBAJ", "JW8WEQAAQBAJ", "ke9BEQAAQBAJ", "af5cEQAAQBAJ"],
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 4,
          nombre: "Serie Twisted",
          libroExternalIds: ["MGl1EAAAQBAJ", "8BWiEAAAQBAJ", "U47OEAAAQBAJ", "JYfnEAAAQBAJ"],
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 5,
          nombre: "Serie Asesinato para principiantes",
          libroExternalIds: ["Ig_MDwAAQBAJ", "P_sqEAAAQBAJ", "eXltEAAAQBAJ"],
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 6,
          nombre: "Bilogía Romper el círculo",
          libroExternalIds: ["6fNjEAAAQBAJ", "SPSaEAAAQBAJ"],
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 7,
          nombre: "Serie El club del crimen de los jueves",
          libroExternalIds: ["6OnzDwAAQBAJ", "-AKyzgEACAAJ", "C_fNEAAAQBAJ"],
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 8,
          nombre: "Harry Potter",
          libroExternalIds: ["2zgRDXFWkm8C", "zl13g5uRM4EC", "N-HcPAAACAAJ", "R2daemCCiF8C", "uUOBPgXQtvUC", "K5dBAAAACAAJ", "O4lWzwEACAAJ"],
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        },
        {
          id: 9,
          nombre: "El Señor de los Anillos",
          libroExternalIds: ["Vbb3EAAAQBAJ", "xFr92V2k3PIC", "_yI_c7_c4ZMC", "dQkFLM8_5ZEC", "05Cj67qkoaoC", "qdtZzQEACAAJ", "SSDxnx-ozrUC", "gmlIDQAAQBAJ", "1KxWEAAAQBAJ", "owZwEAAAQBAJ"],
          createdAt: new Date("2025-11-04T00:00:00.000Z")
        }
      ]
    };

    // Crear entidades si no existen
    console.log('Creando autores...');
    for (const autorData of masterData.autores) {
      const existing = await em.findOne(Autor, { nombre: autorData.nombre, apellido: autorData.apellido });
      if (!existing) {
        const autor = em.create(Autor, {
          nombre: autorData.nombre,
          apellido: autorData.apellido,
          createdAt: autorData.createdAt
        });
        await em.persistAndFlush(autor);
        console.log(`Autor creado: ${autor.nombre} ${autor.apellido}`);
      }
    }

    if (masterData.categorias.length > 0) {
      console.log('Creando categorías...');
      for (const categoriaData of masterData.categorias) {
        const existing = await em.findOne(Categoria, { nombre: categoriaData.nombre });
        if (!existing) {
          const categoria = em.create(Categoria, {
            nombre: categoriaData.nombre,
            createdAt: categoriaData.createdAt
          });
          await em.persistAndFlush(categoria);
          console.log(`Categoría creada: ${categoria.nombre}`);
        }
      }
    } else {
      console.log('No hay categorías para crear.');
    }

    if (masterData.editoriales.length > 0) {
      console.log('Creando editoriales...');
      for (const editorialData of masterData.editoriales) {
        const existing = await em.findOne(Editorial, { nombre: editorialData.nombre });
        if (!existing) {
          const editorial = em.create(Editorial, {
            nombre: editorialData.nombre,
            createdAt: editorialData.createdAt
          });
          await em.persistAndFlush(editorial);
          console.log(`Editorial creada: ${editorial.nombre}`);
        }
      }
    } else {
      console.log('No hay editoriales para crear.');
    }

    console.log('Creando libros...');
    for (const libroData of masterData.libros) {
      const existing = await em.findOne(Libro, { externalId: libroData.externalId });
      if (!existing) {
        const autor = libroData.autorId ? await em.findOne(Autor, { id: libroData.autorId }) : null;
        const categoria = libroData.categoriaId ? await em.findOne(Categoria, { id: libroData.categoriaId }) : null;
        const editorial = libroData.editorialId ? await em.findOne(Editorial, { id: libroData.editorialId }) : null;

        const libro = em.create(Libro, {
          nombre: libroData.nombre,
          slug: libroData.slug,
          sinopsis: libroData.sinopsis,
          imagen: libroData.imagen,
          enlace: libroData.enlace,
          externalId: libroData.externalId,
          source: libroData.source,
          autor: autor,
          categoria: categoria,
          editorial: editorial,
          createdAt: libroData.createdAt
        });
        await em.persistAndFlush(libro);
        console.log(`Libro creado: ${libro.nombre}`);
      }
    }

    console.log('Creando sagas y asociando libros...');
    for (const sagaData of masterData.sagas) {
      let saga = await em.findOne(Saga, { nombre: sagaData.nombre });

      if (!saga) {
        saga = em.create(Saga, {
          nombre: sagaData.nombre,
          createdAt: sagaData.createdAt
        });
        await em.persistAndFlush(saga);
        console.log(`Saga creada: ${saga.nombre}`);
      }

      // Ahora asignar la saga a cada libro usando externalId
      console.log(`Asociando ${sagaData.libroExternalIds.length} libros a la saga: ${saga.nombre}`);
      for (const externalId of sagaData.libroExternalIds) {
        const libro = await em.findOne(Libro, { externalId: externalId });
        if (libro) {
          libro.saga = saga;
          await em.persistAndFlush(libro);
          console.log(`  ✅ Libro "${libro.nombre}" asociado a saga "${saga.nombre}"`);
        } else {
          console.log(`  ⚠️ Libro con externalId ${externalId} no encontrado`);
        }
      }
      console.log(`Saga "${saga.nombre}" completada con sus libros`);
    }

    console.log('Master data creado exitosamente!');
  } catch (error) {
    console.error('Error creando master data:', error);
  } finally {
    await orm.close();
  }
})().catch((err) => {
  console.error(err);
});
