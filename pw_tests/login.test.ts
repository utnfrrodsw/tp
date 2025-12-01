import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });
  test('Login con credenciales válidas, como prestatario', async ({ page }) => {
    //Agarro los componentes que necesito del login
    let contraInput = page.getByPlaceholder('Contraseña');
    let emailInput = page.getByPlaceholder('Email');
    let loginBtn = page.getByTestId('login-button');
    //Completo los campos del form
    await emailInput.fill('plomero.herrera@email.com');
    await contraInput.fill('Ref123');
    await loginBtn.click();
    //Tendria que redrigirlo a la dashboard que es el menu del prestatario
    let dashBoardHeading = page.getByRole('heading', { name: 'Dashboard' });
    await expect(dashBoardHeading).toBeVisible();
  });

  test('Login con credenciales válidas como usuario', async ({ page }) => {
    //Agarro los componentes que necesito del login
    let contraInput = page.getByPlaceholder('Contraseña');
    let emailInput = page.getByPlaceholder('Email');
    let loginBtn = page.getByTestId('login-button');
    //Completo los campos del form
    await emailInput.fill('juan.perez@email.com');
    await contraInput.fill('Ref123');
    await loginBtn.click();
    //Tendria que redirigirlo a la home, donde esta el título de reformix
    //Me traigo la primer coincidencia que es el principal. El otro esta en el footer
    let homeHeading = page.getByRole('heading', { name: 'reformix' }).nth(0);
    await expect(homeHeading).toBeVisible();
  });
  test('Login con formato de mail no válido', async ({ page }) => {
    //Agarro los componentes que necesito del login
    let contraInput = page.getByPlaceholder('Contraseña');
    let emailInput = page.getByPlaceholder('Email');
    let loginBtn = page.getByTestId('login-button');
    //Completo los campos del form
    await emailInput.fill('Holamundo');
    await contraInput.fill('Ref123');
    await loginBtn.click();
    //Tiene que tirar una alerta avisando
    let alerta = page.getByTestId('alert');
    await expect(alerta).toBeVisible();
    let alertaMsg = page.getByTestId('alert-description');
    await expect(alertaMsg).toHaveText('El email debe tener un formato válido');
  });
  test('Login con formatos válidos pero credenciales inválidas', async ({
    page,
  }) => {
    //Agarro los componentes que necesito del login
    let contraInput = page.getByPlaceholder('Contraseña');
    let emailInput = page.getByPlaceholder('Email');
    let loginBtn = page.getByTestId('login-button');
    //Completo los campos del form
    await emailInput.fill('reformix@gmail.com');
    await contraInput.fill('Ref123');
    await loginBtn.click();
    //Tiene que tirar una alerta avisando
    let alerta = page.getByTestId('alert');
    await expect(alerta).toBeVisible();
    let alertaMsg = page.getByTestId('alert-description');
    await expect(alertaMsg).toBeVisible();
  });
});

//!Ejemplos de PLaywirght
/* test('has title', async ({ page }) => {

  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
}); */
