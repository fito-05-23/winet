-- Tabla de Roles
CREATE TABLE public.roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Inserción de Roles Iniciales
INSERT INTO public.roles (name, description) VALUES
('admin', 'Administrador del sistema'),
('user', 'Usuario estándar'),
('operador', 'Usuario Trabajador de la empresa');

-- Tabla de Usuarios
CREATE TABLE public.users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  provider VARCHAR(50) NOT NULL DEFAULT 'email',
  provider_id VARCHAR(100),
  role_id INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT FALSE, -- Indica si el usuario ha activado su cuenta
  activate_account BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE SET NULL
);

CREATE TABLE public.activation_codes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  code VARCHAR(6) NOT NULL, -- Código de 6 dígitos
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE public.activation_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE public.refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE public.clientes_winet (
  id SERIAL PRIMARY KEY,
  id_user INTEGER NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('activo', 'inactivo', 'suspendido')),
  correo VARCHAR(255),
  telefono VARCHAR(20),
  movil VARCHAR(20),
  cedula VARCHAR(50) UNIQUE NOT NULL,
  pasarela VARCHAR(100),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  direccion_principal TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.tiendas (
  id SERIAL PRIMARY KEY,
  id_cliente INTEGER NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  direccion TEXT,
  telefono VARCHAR(20),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.pagos (
  id SERIAL PRIMARY KEY,
  id_tienda INTEGER NOT NULL,
  id_cliente INTEGER NOT NULL,
  monto DECIMAL(10,2) NOT NULL CHECK (monto > 0),
  fecha_pago TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.puntos (
  id SERIAL PRIMARY KEY,
  id_cliente INTEGER NOT NULL,
  puntos INTEGER NOT NULL CHECK (puntos >= 0),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.transacciones_puntos (
  id SERIAL PRIMARY KEY,
  id_cliente INTEGER NOT NULL,
  id_tienda INTEGER NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('credito', 'debito')),
  puntos INTEGER NOT NULL CHECK (puntos > 0),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE public.clientes_winet ADD FOREIGN KEY (id_user) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE public.tiendas ADD FOREIGN KEY (id_cliente) REFERENCES public.clientes_winet(id) ON DELETE CASCADE;
ALTER TABLE public.pagos ADD FOREIGN KEY (id_tienda) REFERENCES public.tiendas(id) ON DELETE CASCADE;
ALTER TABLE public.pagos ADD FOREIGN KEY (id_cliente) REFERENCES public.clientes_winet(id) ON DELETE CASCADE;
ALTER TABLE public.puntos ADD FOREIGN KEY (id_cliente) REFERENCES public.clientes_winet(id) ON DELETE CASCADE;
ALTER TABLE public.transacciones_puntos ADD FOREIGN KEY (id_cliente) REFERENCES public.clientes_winet(id) ON DELETE CASCADE;
ALTER TABLE public.transacciones_puntos ADD FOREIGN KEY (id_tienda) REFERENCES public.tiendas(id) ON DELETE CASCADE;


CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_clientes_cedula ON public.clientes_winet(cedula);
CREATE INDEX idx_clientes_codigo ON public.clientes_winet(codigo);
CREATE INDEX idx_tiendas_nombre ON public.tiendas(nombre);
CREATE INDEX idx_activation_tokens_token ON public.activation_tokens(token);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_clientes_winet_timestamp BEFORE UPDATE ON public.clientes_winet
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_tiendas_timestamp BEFORE UPDATE ON public.tiendas
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_pagos_timestamp BEFORE UPDATE ON public.pagos
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_puntos_timestamp BEFORE UPDATE ON public.puntos
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE OR REPLACE FUNCTION activate_user(p_token VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id INTEGER;
BEGIN
  -- Buscar usuario con el token
  SELECT user_id INTO v_user_id FROM activation_tokens WHERE token = p_token;

  -- Si no existe el token, retornar FALSE
  IF v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Activar el usuario
  UPDATE users SET is_active = TRUE WHERE id = v_user_id;

  -- Eliminar el token de activación solo si existe un usuario válido
  DELETE FROM activation_tokens WHERE user_id = v_user_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_user_activation()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar si el usuario está activo y tiene activate_account = TRUE
  IF NOT EXISTS (
    SELECT 1 
    FROM users 
    WHERE id = NEW.id_user 
      AND is_active = TRUE 
      AND activate_account = TRUE
  ) THEN
    RAISE EXCEPTION 'El usuario debe estar activado y tener activate_account = TRUE antes de ser cliente_winet';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION activate_user_account(p_user_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar si el usuario existe
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
    RETURN FALSE;
  END IF;

  -- Activar activate_account
  UPDATE users SET activate_account = TRUE WHERE id = p_user_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

