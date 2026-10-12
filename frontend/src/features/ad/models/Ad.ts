// Modelo de un anuncio dentro del frontend.
// El resto de la app trabaja SIEMPRE con esta clase; el JSON crudo del backend no
// sale nunca de la capa de servicios (ver services/adService.ts).

/**
 * Forma cruda con la que viaja un anuncio en las respuestas de la API.
 * Respeta los nombres del backend (snake_case, como en el DER); pasarlo al modelo
 * es justamente lo que hace el servicio.
 */
export type AdApiResponse = {
  id_ad: number;
  title: string;
  description: string | null;
  url_image: string;
  target_url: string | null;
  active: boolean;
};

export class Ad {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly description: string | null,
    /** Ruta de la imagen dentro de public/ ("/images/ads/ad-vinyl.jpg"). */
    public readonly imageUrl: string,
    /** A dónde lleva el anuncio, o null si es solo gráfico. */
    public readonly targetUrl: string | null,
    public readonly isActive: boolean
  ) {}

  /** ¿Se puede hacer click? Si no, la imagen se muestra sin envolver en un enlace. */
  get hasLink(): boolean {
    return this.targetUrl !== null && this.targetUrl !== '';
  }

  /**
   * ¿El enlace es una ruta del propio sitio ("/pro") en vez de una dirección de
   * afuera? Es lo que decide si se navega con React Router o se abre una pestaña
   * nueva. Hoy el único caso es el anuncio de la membresía Pro.
   *
   * "//otro.com" empieza con barra pero NO es una ruta del sitio: el navegador lo
   * lee como un dominio externo. Por eso se exige una sola barra al principio.
   */
  get isInternalLink(): boolean {
    const target = this.targetUrl as string;
    return this.hasLink && target.startsWith('/') && !target.startsWith('//');
  }

  /** ¿Tiene texto de apoyo debajo del título? */
  get hasDescription(): boolean {
    return this.description !== null && this.description !== '';
  }

  /**
   * El destino en corto, para la tabla del panel: el dominio si es externo y la
   * ruta tal cual si es interna. Mostrar la URL entera dejaría la columna
   * larguísima. Si está mal formada devuelve el texto como vino, que igual sirve
   * para identificarla.
   */
  get linkLabel(): string {
    if (!this.hasLink) return '';
    if (this.isInternalLink) return this.targetUrl as string;

    try {
      return new URL(this.targetUrl as string).hostname;
    } catch {
      return this.targetUrl as string;
    }
  }
}
