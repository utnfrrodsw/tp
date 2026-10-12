// Test end-to-end del inicio de sesión.
//
// Recorre el circuito completo, sin mockear nada: el navegador carga el
// frontend, el frontend le pega al backend, el backend consulta MySQL y la
// respuesta vuelve hasta la pantalla. Es el caso de uso de entrada de toda la
// app: sin sesión no se llega a reseñar, ni a aportar catálogo, ni al perfil.
//
// Detalle del proyecto que condiciona el test: NO existe una ruta /login. El
// login y el registro viven los dos en un modal que se abre desde la barra de
// navegación, así que el recorrido arranca en la home.
import { expect, test } from '@playwright/test';

// El usuario administrador que crea `npm run seed`. Si alguien cambió el
// SEED_ADMIN_* de su backend, lo pasa con E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD;
// si no, se usan los valores por defecto que documenta el README del proyecto.
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? 'admin@musicboxd.com';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? 'Admin1234!';

test('un usuario registrado inicia sesión y la barra pasa a mostrar su cuenta', async ({
  page,
}) => {
  await page.goto('/');

  // Se busca por la clase y no por el texto: con el modal abierto hay tres
  // elementos que dicen "Iniciar Sesión" (este botón, el título del modal y el
  // botón de enviar), y el selector quedaría ambiguo.
  await page.locator('.navbar__btn--login').click();

  const modal = page.locator('.auth__card');
  await expect(modal).toBeVisible();

  // Los campos se buscan por su etiqueta, que es como los encuentra una persona
  // mirando la pantalla (y también un lector de pantalla).
  await modal.getByLabel('Correo electrónico').fill(ADMIN_EMAIL);
  await modal.getByLabel('Contraseña').fill(ADMIN_PASSWORD);
  await modal.getByRole('button', { name: 'Iniciar Sesión' }).click();

  // Las dos puntas del resultado: que la sesión quedó abierta y que la interfaz
  // se enteró. El modal se cierra solo al autenticarse.
  //
  // No se compara el nombre contra un texto fijo: cada integrante tiene su
  // propia base y el SEED_ADMIN_USERNAME de su .env puede ser distinto. Lo que
  // importa es que la barra pasó de ofrecer entrar a mostrar una cuenta.
  await expect(page.getByRole('button', { name: 'Abrir menú de usuario' })).toBeVisible();
  await expect(page.locator('.navbar__username')).not.toBeEmpty();
  await expect(page.locator('.navbar__btn--signup')).toHaveCount(0);
});

test('con la contraseña incorrecta muestra el error y no abre la sesión', async ({ page }) => {
  await page.goto('/');
  await page.locator('.navbar__btn--login').click();

  const modal = page.locator('.auth__card');
  await modal.getByLabel('Correo electrónico').fill(ADMIN_EMAIL);
  await modal.getByLabel('Contraseña').fill('no-es-la-contraseña');
  await modal.getByRole('button', { name: 'Iniciar Sesión' }).click();

  // El 401 del backend tiene que llegar a la pantalla como un mensaje legible,
  // no como un error crudo en la consola.
  await expect(page.getByRole('alert')).toHaveText('El email o la contraseña son incorrectos.');
  // Y el modal sigue abierto, con el usuario todavía afuera.
  await expect(modal).toBeVisible();
  await expect(page.locator('.navbar__username')).toHaveCount(0);
});
