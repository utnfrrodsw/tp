-- PlanIt - Esquema completo (PostgreSQL / Supabase)
-- Ejecutar en el SQL Editor de Supabase.
-- Supabase ya provee la base de datos: no se crea, se usa el schema public.

-- Tipo enumerado para el rol de usuario
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rol_usuario') THEN
    CREATE TYPE rol_usuario AS ENUM ('cliente', 'administrador', 'empresa');
  END IF;
END$$;

-- usuarios
-- El plan es 'gratis' (hasta 3 servicios activos) o 'pro' (sin limite).
-- Solo se usa para empresas, el resto de los roles lo deja en 'gratis' sin usarlo.
CREATE TABLE IF NOT EXISTS usuarios (
  id            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  email         VARCHAR(100) NOT NULL,
  "contraseña"  VARCHAR(255) NOT NULL,
  rol           rol_usuario NOT NULL DEFAULT 'cliente',
  zona          VARCHAR(100),
  cuit          BIGINT,
  telefono      BIGINT,
  -- activo permite suspender la cuenta sin borrarla (empresas y clientes)
  activo        BOOLEAN NOT NULL DEFAULT TRUE,
  plan          VARCHAR(10) NOT NULL DEFAULT 'gratis',
  creado_en     TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_usuarios_email UNIQUE (email),
  CONSTRAINT chk_usuarios_plan CHECK (plan IN ('gratis', 'pro'))
);

CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios (rol);

-- eventos
CREATE TABLE IF NOT EXISTS eventos (
  id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  descripcion TEXT,
  imagen      VARCHAR(255),
  draft       BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eventos_draft ON eventos (draft);

-- categorias
CREATE TABLE IF NOT EXISTS categorias (
  id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  evento_id   INTEGER NOT NULL,
  nombre      VARCHAR(100) NOT NULL,
  descripcion TEXT,
  creado_en   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_categorias_evento
    FOREIGN KEY (evento_id) REFERENCES eventos (id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_categorias_evento ON categorias (evento_id);

-- servicios
-- El estado de la publicacion puede ser: 'borrador', 'revision' o 'publicado'.
-- La empresa solo puede poner 'borrador' o 'revision', el que pasa a 'publicado'
-- siempre es el administrador cuando aprueba la publicacion.
CREATE TABLE IF NOT EXISTS servicios (
  id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  categoria_id INTEGER NOT NULL,
  usuario_id   INTEGER NOT NULL,
  nombre       VARCHAR(100) NOT NULL,
  descripcion  TEXT,
  imagen       VARCHAR(255),
  estado       VARCHAR(20) NOT NULL DEFAULT 'borrador',
  creado_en    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_servicios_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_servicios_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    ON DELETE CASCADE,
  CONSTRAINT chk_servicios_estado
    CHECK (estado IN ('borrador', 'revision', 'publicado'))
);

CREATE INDEX IF NOT EXISTS idx_servicios_categoria ON servicios (categoria_id);
CREATE INDEX IF NOT EXISTS idx_servicios_usuario   ON servicios (usuario_id);
CREATE INDEX IF NOT EXISTS idx_servicios_estado    ON servicios (estado);

-- evento_categoria (N:M)
CREATE TABLE IF NOT EXISTS evento_categoria (
  evento_id    INTEGER NOT NULL,
  categoria_id INTEGER NOT NULL,
  PRIMARY KEY (evento_id, categoria_id),
  CONSTRAINT fk_evento_categoria_evento
    FOREIGN KEY (evento_id) REFERENCES eventos (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_evento_categoria_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias (id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_evento_categoria_categoria ON evento_categoria (categoria_id);

-- tableros
CREATE TABLE IF NOT EXISTS tableros (
  id             INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cliente_id     INTEGER NOT NULL,
  evento_id      INTEGER,
  nombre         VARCHAR(100) NOT NULL,
  descripcion    TEXT,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_tableros_cliente
    FOREIGN KEY (cliente_id) REFERENCES usuarios (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_tableros_evento
    FOREIGN KEY (evento_id) REFERENCES eventos (id)
    ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_tableros_cliente ON tableros (cliente_id);
CREATE INDEX IF NOT EXISTS idx_tableros_evento  ON tableros (evento_id);

-- tablero_servicio (N:M)
CREATE TABLE IF NOT EXISTS tablero_servicio (
  tablero_id  INTEGER NOT NULL,
  servicio_id INTEGER NOT NULL,
  guardado_en TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (tablero_id, servicio_id),
  CONSTRAINT fk_tablero_servicio_tablero
    FOREIGN KEY (tablero_id) REFERENCES tableros (id)
    ON DELETE CASCADE,
  CONSTRAINT fk_tablero_servicio_servicio
    FOREIGN KEY (servicio_id) REFERENCES servicios (id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tablero_servicio_servicio ON tablero_servicio (servicio_id);

-- Bloqueamos el acceso directo a las tablas: solo se accede a través de la API
ALTER TABLE usuarios         ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos          ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias       ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios        ENABLE ROW LEVEL SECURITY;
ALTER TABLE evento_categoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE tableros         ENABLE ROW LEVEL SECURITY;
ALTER TABLE tablero_servicio ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
