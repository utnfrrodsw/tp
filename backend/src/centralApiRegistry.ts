import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import fs from 'fs/promises';
import path from 'path';
//* SE importan los registros de los endpoints
import { usuarioRegistry } from './usuario/usuario.registry.js';
import { turnoRegistry } from './turno/turno.registry.js';
import { zonaRegistry } from './zona/zona.registry.js';
import { horarioRegistry } from './horario/horario.registry.js';
import { servicioRegistry } from './servicio/servicio.registry.js';
import { pagoRegistry } from './pago/pago.registry.js';
import { tareaRegistry } from './tarea/tarea.registry.js';
import { tipoServicioRegistry } from './tipoServicio/tipoServicio.registory.js';

// Function to generate Swagger UI HTML
function generateSwaggerUIHTML(openApiDocument: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HomeService API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui.css" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
      margin: 0;
      background: #fafafa;
    }
    .swagger-ui .topbar {
      background-color: #2c3e50;
    }
    .swagger-ui .topbar .download-url-wrapper {
      display: none;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-bundle.js" charset="UTF-8"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-standalone-preset.js" charset="UTF-8"></script>
  <script>
    window.onload = function() {
      // Begin Swagger UI call region
      const ui = SwaggerUIBundle({
        spec: ${JSON.stringify(openApiDocument, null, 2)},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        tryItOutEnabled: true,
        filter: true,
        requestInterceptor: function(req) {
          // Add any custom request headers here if needed
          return req;
        },
        responseInterceptor: function(res) {
          // Add any custom response handling here if needed
          return res;
        }
      });
      // End Swagger UI call region

      window.ui = ui;
    };
  </script>
</body>
</html>`;
}

async function generateOpenApiDocument() {
  const registry = new OpenAPIRegistry();

  //* Se registran los sistemas de seguridad que se van a usar
  registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });

  //* Coleccion final donde van a ir los registros de cada api para que se combinen en uno solo y se documenten
  const allDefinitions = [
    ...registry.definitions,
    ...usuarioRegistry.definitions,
    ...turnoRegistry.definitions,
    ...zonaRegistry.definitions,
    ...horarioRegistry.definitions,
    ...servicioRegistry.definitions,
    ...pagoRegistry.definitions,
    ...tareaRegistry.definitions,
    ...tipoServicioRegistry.definitions,
  ];

  //Generador con todas las definiciones
  const generator = new OpenApiGeneratorV3(allDefinitions);

  const document = generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'HomeService API',
      description: 'Complete API documentation for HomeService platform',
      contact: {
        name: 'API Support',
        email: 'support@homeservice.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
      {
        url: 'https://backend-patient-morning-1303.fly.dev/api',
        description: 'Production server',
      },
    ],
    security: [{ bearerAuth: [] }],
    tags: [
      {
        name: 'Usuarios',
        description: 'Operaciones para el manejo de Usuarios',
      },
      {
        name: 'Turnos',
        description: 'Operaciones para el manejo de Turnos',
      },
      {
        name: 'Servicios',
        description: 'Operaciones para el manejo de Servicios',
      },
      {
        name: 'Zonas',
        description: 'Operaciones para el manejo de Zonas',
      },
      {
        name: 'Horarios',
        description: 'Operaciones para el manejo de Horarios',
      },
      {
        name: 'Tareas',
        description: 'Operaciones para el manejo de Tareas',
      },
      {
        name: 'TipoServicio',
        description: 'Operaciones para el manejo de Tipos de Servicio',
      },
      {
        name: 'Autenticación',
        description:
          'Operaciones relacionadas con la autenticación y autorización de usuarios',
      },
    ],
  });

  const docsDir = path.join(process.cwd(), 'docs');
  await fs.mkdir(docsDir, { recursive: true });

  // Generate JSON documentation
  await fs.writeFile(
    path.join(docsDir, 'api-documentation.json'),
    JSON.stringify(document, null, 2)
  );

  // Generate HTML documentation with Swagger UI
  const htmlContent = generateSwaggerUIHTML(document);
  await fs.writeFile(path.join(docsDir, 'api-documentation.html'), htmlContent);

  console.log('✅ API Documentation generated successfully!');
  console.log('📁 Files created:');
  console.log('   - docs/api-documentation.json');
  console.log('   - docs/api-documentation.html');
  console.log('');

  return document;
}

// Permite ejecutar la generación del documento si se corre este archivo directamente con Node.js
if (import.meta.url === `file://${process.argv[1]}`) {
  generateOpenApiDocument();
}

// Permite ejecutar la generación del documento si se corre este archivo directamente con Node.js o tsx
const scriptName = process.argv[1]?.replace(/\\/g, '/');
if (
  scriptName?.endsWith('/centralApiRegistry.ts') ||
  scriptName?.endsWith('/centralApiRegistry.js')
) {
  generateOpenApiDocument();
}

export { generateOpenApiDocument };
