# Documentación

Bievenidos a la documentación del proyecto

## Pasos para el Set Up

Para minimizar la cantidad de pasos para el setup, decidimos incluir aquí el contenido de los archivos .env que teníamos para levantar el proyecto en local.

1. Crea los archivos .env El del front con la informacion: [env_front](./README-front.md) y el del root con la informacion [env_root](./README-root.md).

```
-- openApi .. sk-proj-Op-eBWGF
OZ6ZIUdSHnyOdJkllb5Y5Y_Dsl8j
5w_x6GwkggBebrhICxYOq
dvu
W5HUPd_pVGCHrsT3BlbkF
JHjJkIZ4ZJJzgD_56TyZqL-kXvfoH89b8
R33AIu5mc0bpYYMD0K4ojGhySuEeXwq
5cy8tjWeWoA
-- jsw .. YQRu5R2SOb37XnxA4OFi
Xz2a26pYLV
GeWpdl
-- stripe-secter .. sk_test_51S3i
XQCuxCYVSB
dAhcsoRYvYZwNIBa
JEd4A5yIkzbiM3OCR
47TaSguKQ5ufIfILdG7c
VKJur3Zjjwo
VbjB0czkm5003IJMI56a
-- stripe-secret-webhook-stripe .. whsec_4EAWQ5O
WdRvnQJzxdCh
wZGE0aubuCd7d
--stripe-secret-webhook-stripe-payment whsec_LsYN45
EjBQNz0yZ5oiBU
13Seh3x2DPRJ
-- email-passwprd .. mkyg zmvc
 hjux pkqr
```

2. `pnpm install` Desde el root: instala las dependencias del root
3. `pnpm run install:both`Desde el root : instala las dependencias del front y del back
4. Asegurarse de tener una base de datos con el nombre y los puertos con la que conectamos [Aqui](../backend/src/shared/db/orm.ts)
5. `pnpm run dev`: levanta tanto el front como el back, con estos tres ya debería correr todo
6. Para que el seeding de la base se lleve a cabo. Se debe descomentar el bloque de lineas ubicado en archivo anterior ⬆️. **Recomendamos tener la extensión "Better comments" para apreciar mejor**
7. Después de llevado a cabo el seeding volver a comentar lo anteriormente comentado y guardar el archivo para que todo corra normalmente
8. Probar la plataforma

### Para testear:

Desde el root:

- `pnpm run test`: (**Con el proyecto levantado**) Lleva a cabo todos los test existentes
- `pnpm run test:e2e:report`:(**Con el proyecto levantado **) Lleva a cabo el test del login y levanta el reporte en localhost

### Para documentar la API

Desde el back
(** Sin tener el back levantado, ya que usa el mismo puerto**)

- `pnpm run generate-docs`: genera los documentos de salida, tanto el html como el json
- `pnpm run docs:serve`: levanta el resultado de swagger solo.

## Documentación de la API

La **documentación de la API** la realizamos a través de swagger ui. Nosotros elegimos que , como output, se generen dos archivos que van a encontrar dentro del directorio backend, en la carpeta api-docs:

1. api-documentation.html
2. api-documentation.json

Para tener la _mejor experiencia_ de visualización, nosotros recomendamos levantar el archivo html resultante de la documentación con la extensión **live-server**

## Testing

Para testear tanto el front como el back se utilizó **Vitest** obviamente se tuvo que variar la configuración en cada caso debido a la diferencia entre los runtimes del front y el back que ya todos sabemos.

### Backend Testing

En el backend testeamos todos los endpoints de la API del proyecto [TestApi](../backend/test/api.test.ts)

### Frontend Testing

En el frontend realizamos dos test, testando componentes que utilizamos mucho en el proyecto. Las [Alerts](../frontend/src/components/Alerts/Alerts.test.tsx) y las [Stars](../frontend/src/components/stars/Stars.test.tsx)

### Login Testing

Por último, realizamos un test que incluye tanto la funcionalidad del front y del back, en una componente que es de suma importancia para el proyecto, como es la del login. [Login Test](../pw_tests/login.test.ts)
Los resultados de este test se encuentran [Aqui](../frontend/playwright-report/index.html). Recomendamos, **al igual que con la API** levantar los resultados con la extensión **live-server** para poder apreciarlos mejor.

## Ejecución de tests Automáticos

La ejecución automática de los test la hicimos a través de los workflows de github. El **flujo** seguido para garantizar que los test cumplan sus funciones fue:

1. Test simultáneo de código del Frontend y del Backend
2. Deployment del Backend
3. Deployment del Frontend
4. Test del Login
5. (**Si es que falla el test del login**): Rollback

Se pueden ver los resultados de los test en tiempo real desde las Actions del repositorio
