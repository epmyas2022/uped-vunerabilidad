
<div align="end">
<img
 src="./assets/logo-pedagogica-blanco.png" width="100" height="100" align="center">
</div>

# Script scrapt vunerability from uped portal

> [!CAUTION]
> Este script fue creado con fines educativos,en ningun momento se pretende hacer daño a la universidad o a su portal web al contrario se pretende ayudar a mejorar la seguridad de la misma.

## 🗒️ Descripcion

Script que permite obtener la información de estudiantes y la sesion de un usuario en el portal de la universidad.

## 🍪 En que consiste la vulnerabilidad

La vunerabilidad consiste en manipular la cookie de una session para obtener la informacion de un usuario sin necesidad de logearse en el portal de la universidad.

la estructura de cookie es la siguiente:

```json
{
  ".ASPXAUTH": "puede ser cualquier sesion",
  "ASP.NET_SessionId": "id de la session del autenticacion",
  "CodigoUsuario": "codigo del usuario",
  "usuario": "nombre del usuario",
}
```

## 📋 Requisitos

- Node.js v20.0.0

## 🚀 Instalación

```bash
git clone https://github.com/epmyas2022/uped-vunerabilidad.git
```

```bash
npm install
```

Configurar las variables de entorno en el archivo `.env`

```env
ASPXAUTH=#de cualquier sesion
SESSION_ID=#id de la session del autenticacion
```

## 💻 Comandos

Obtener la informacion del expediente de los estudiantes basados en un rango  x1 a x2

```bash
npm run general <x1> <x2>
```

Obtener la sesion de un usuario

```bash
npm run login <user> <codigo>
```

Obtener la sesion del portal de pagos de un estudiante

```bash
npm run pagos <user> <codigo>
```

## 📂 Estructura de archivos

Dentro de la carpeta data se encuentra varios datos con que si comprobaron la vulnerabilidad del portal de la universidad. esto datos son del scrapeo que se realizo con el script.

## Sitios vulnerables

- [x] Portal de la universidad [aqui](https://myappcloud.net/uped/portal_estudiante)
- [x] Portal de pagos [aqui](https://saas.spsoftware.net/uped_pagos/)
- [ ] Portal de docentes
- [ ] Portal de evaluacion docente
