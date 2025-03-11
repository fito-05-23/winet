# Winet Project

## Descripción

**Winet** es una aplicación fullstack diseñada para administrar y gestionar la cuenta de los usuario de la Empresa Winet Servicios de Internet. El proyecto está estructurado en dos partes principales: frontend y backend, con una carpeta dedicada a la documentación del proceso de desarrollo.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Contribuir](#contribuir)
- [Licencia](#licencia)
- [Estructura de ramas](#Flujo-de-Trabajo-de-Ramas)

## Tecnologías Utilizadas

- **Frontend:**
  - [React](https://reactjs.org/)
  - [React Router](https://reactrouter.com/)
  - [Axios](https://axios-http.com/)

- **Backend:**
  - [Node.js](https://nodejs.org/)
  - [Express](https://expressjs.com/)

- **Otras Herramientas:**
  - [Git](https://git-scm.com/)
  - [GitHub](https://github.com/)
  - [Postman](https://www.postman.com/) (para probar APIs)

## Instalación

### Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 14 o superior)
- [Git](https://git-scm.com/)
- Una cuenta de [GitHub](https://github.com/)

### Pasos para Instalar

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/winet.git
   cd winet

2. **Actualizar repositorio:**
  ```bash
  cd ruta/winet

  git status

  git add .

  git commit -m "Descripción breve de los cambios realizados"

3. **Fusionar los Cambios Remotos con tu Rama Local:**
  Si estás trabajando en la rama main, por ejemplo:

  ```bash
  git checkout main
  git merge origin/main

4. **Enviar los Cambios al Repositorio Remoto:**
  Después de asegurarte de que tu rama local está actualizada, envía tus cambios al repositorio remoto:

  ```bash
  git push origin main
  git status

## Flujo de Trabajo de Ramas

Para mantener el proyecto organizado y facilitar la colaboración, seguimos un flujo de trabajo basado en ramas. A continuación, se detalla la estructura de ramas que utilizamos:

### 1. Rama Principal (`main`)

- **Descripción:** Contiene el código que está en producción o listo para ser desplegado. Es la rama más estable del proyecto.
- **Acceso:** Solo se fusionan cambios a través de pull requests después de una revisión exhaustiva.
- **Nombre:** `main`

### 2. Rama de Desarrollo (`develop`)

- **Descripción:** Sirve como rama de integración para las nuevas características y correcciones de errores. Es la rama principal para el desarrollo continuo.
- **Acceso:** Los desarrolladores crean ramas de funcionalidad a partir de `develop` y fusionan sus cambios de vuelta a `develop`.
- **Nombre:** `develop`

### 3. Ramas de Funcionalidad (`feature/*`)

- **Descripción:** Cada nueva característica o mejora se desarrolla en su propia rama de funcionalidad.
- **Convención de Nomenclatura:** `feature/nombre-de-la-funcionalidad` o `feature/issue-123`
- **Ejemplos:**
  - `feature/login-page`
  - `feature/issue-45-user-authentication`
- **Proceso:**
  1. Crear una rama de funcionalidad desde `develop`:
     ```bash
     git checkout -b feature/nombre-de-la-funcionalidad develop
     ```
  2. Trabajar en la rama y fusionar de vuelta a `develop` cuando esté lista.

### 4. Ramas de Corrección de Errores (`bugfix/*`)

- **Descripción:** Se utilizan para corregir errores en el código que no son críticos.
- **Convención de Nomenclatura:** `bugfix/nombre-del-error` o `bugfix/issue-67`
- **Ejemplos:**
  - `bugfix/fix-header-layout`
  - `bugfix/issue-89-database-connection`
- **Proceso:**
  1. Crear una rama de corrección de errores desde `develop`:
     ```bash
     git checkout -b bugfix/nombre-del-error develop
     ```
  2. Fusionar de vuelta a `develop` cuando esté corregido.

### 5. Ramas de Lanzamiento (`release/*`)

- **Descripción:** Se crean cuando el código en `develop` está listo para ser lanzado.
- **Convención de Nomenclatura:** `release/version-1.0` o `release/2023-10-01`
- **Ejemplos:**
  - `release/v1.0`
  - `release/2023-10-01-release`
- **Proceso:**
  1. Crear una rama de lanzamiento desde `develop`:
     ```bash
     git checkout -b release/v1.0 develop
     ```
  2. Realizar ajustes finales y fusionar a `main` y `develop` cuando esté listo.

### 6. Ramas de Hotfix (`hotfix/*`)

- **Descripción:** Se utilizan para corregir errores críticos en la rama `main` que no pueden esperar a la próxima versión.
- **Convención de Nomenclatura:** `hotfix/nombre-del-error` o `hotfix/issue-100`
- **Ejemplos:**
  - `hotfix/fix-critical-bug`
  - `hotfix/issue-100-security-patch`
- **Proceso:**
  1. Crear una rama de hotfix desde `main`:
     ```bash
     git checkout -b hotfix/nombre-del-error main
     ```
  2. Fusionar de vuelta a `main` y `develop` cuando esté corregido.

### Diagrama de Flujo de Ramas
  main
  |
  |----> release/*
  |
  |----> develop
            |
            |----> frontend
            |
            |----> backend
  |
  |----> feature/*
  |
  |----> bugfix/*
  |
  |----> hotfix/*






  ```bash
  git push origin main
  git status



