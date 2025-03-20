-- Tabla de Usuarios
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "password_hash" VARCHAR(255) NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "provider" VARCHAR(50) NOT NULL DEFAULT 'email',
  "provider_id" VARCHAR(100),
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "token" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de Clientes
CREATE TABLE "clientes_winet" (
  "id" SERIAL PRIMARY KEY,
  "id_user" INTEGER NOT NULL,
  "nombre" VARCHAR(100) NOT NULL,
  "estado" VARCHAR(20) NOT NULL CHECK (estado IN ('activo', 'inactivo', 'suspendido')),
  "correo" VARCHAR(255),
  "telefono" VARCHAR(20),
  "movil" VARCHAR(20),
  "cedula" VARCHAR(50) UNIQUE NOT NULL,
  "pasarela" VARCHAR(100),
  "codigo" VARCHAR(50) UNIQUE NOT NULL,
  "direccion_principal" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de Tiendas
CREATE TABLE "tiendas" (
  "id" SERIAL PRIMARY KEY,
  "id_cliente" INTEGER NOT NULL,
  "nombre" VARCHAR(100) NOT NULL,
  "direccion" TEXT,
  "telefono" VARCHAR(20),
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de Pagos
CREATE TABLE "pagos" (
  "id" SERIAL PRIMARY KEY,
  "id_tienda" INTEGER NOT NULL,
  "id_cliente" INTEGER NOT NULL,
  "monto" DECIMAL(10,2) NOT NULL CHECK (monto > 0),
  "fecha_pago" TIMESTAMP NOT NULL DEFAULT NOW(),
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de Puntos
CREATE TABLE "puntos" (
  "id" SERIAL PRIMARY KEY,
  "id_cliente" INTEGER NOT NULL,
  "puntos" INTEGER NOT NULL CHECK (puntos >= 0),
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de Transacciones de Puntos
CREATE TABLE "transacciones_puntos" (
  "id" SERIAL PRIMARY KEY,
  "id_cliente" INTEGER NOT NULL,
  "id_tienda" INTEGER NOT NULL,
  "tipo" VARCHAR(50) NOT NULL CHECK (tipo IN ('credito', 'debito')),
  "puntos" INTEGER NOT NULL CHECK (puntos > 0),
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Claves Foráneas
ALTER TABLE "clientes_winet" ADD FOREIGN KEY ("id_user") REFERENCES "users" ("id") ON DELETE CASCADE;
ALTER TABLE "tiendas" ADD FOREIGN KEY ("id_cliente") REFERENCES "clientes_winet" ("id") ON DELETE CASCADE;
ALTER TABLE "pagos" ADD FOREIGN KEY ("id_tienda") REFERENCES "tiendas" ("id") ON DELETE CASCADE;
ALTER TABLE "pagos" ADD FOREIGN KEY ("id_cliente") REFERENCES "clientes_winet" ("id") ON DELETE CASCADE;
ALTER TABLE "puntos" ADD FOREIGN KEY ("id_cliente") REFERENCES "clientes_winet" ("id") ON DELETE CASCADE;
ALTER TABLE "transacciones_puntos" ADD FOREIGN KEY ("id_cliente") REFERENCES "clientes_winet" ("id") ON DELETE CASCADE;
ALTER TABLE "transacciones_puntos" ADD FOREIGN KEY ("id_tienda") REFERENCES "tiendas" ("id") ON DELETE CASCADE;

-- Índices para mejorar rendimiento
CREATE INDEX idx_users_email ON "users" ("email");
CREATE INDEX idx_clientes_cedula ON "clientes_winet" ("cedula");
CREATE INDEX idx_clientes_codigo ON "clientes_winet" ("codigo");
CREATE INDEX idx_tiendas_nombre ON "tiendas" ("nombre");

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON "users"
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_clientes_winet_timestamp BEFORE UPDATE ON "clientes_winet"
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_tiendas_timestamp BEFORE UPDATE ON "tiendas"
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_pagos_timestamp BEFORE UPDATE ON "pagos"
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_puntos_timestamp BEFORE UPDATE ON "puntos"
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
