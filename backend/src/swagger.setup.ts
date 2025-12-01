import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import { generateOpenApiDocument } from './centralApiRegistry.js';

export function setupSwagger(app: Application) {
  const openApiDocument = generateOpenApiDocument();

  // Swagger UI options
  const swaggerUiOptions = {
    explorer: true,
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
    customCss: `
      .swagger-ui .topbar { 
        background-color: #2c3e50; 
      }
      .swagger-ui .topbar .download-url-wrapper input[type=text] { 
        border-color: #3498db; 
      }
    `,
    customSiteTitle: 'HomeService API Documentation',
  };

  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(openApiDocument, swaggerUiOptions));

  // Serve raw OpenAPI JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(openApiDocument);
  });

  console.log('📚 Swagger UI available at: http://localhost:3000/api-docs');
  console.log(
    '📄 OpenAPI JSON available at: http://localhost:3000/api-docs.json'
  );
}
