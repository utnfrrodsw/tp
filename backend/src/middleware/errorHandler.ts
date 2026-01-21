import { Request, Response, NextFunction } from 'express';

// Middleware global para manejo de errores
export function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error global:', error);

  // Error de validación de MikroORM
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      details: error.message
    });
  }

  // Error de conexión a base de datos
  if (error.name === 'DatabaseError' || error.code?.startsWith('ER_')) {
    return res.status(500).json({
      success: false,
      message: 'Error de base de datos',
      details: 'Problema de conexión o consulta'
    });
  }

  // Error de sintaxis JSON
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({
      success: false,
      message: 'JSON inválido en el body de la request'
    });
  }

  // Error genérico
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
  });
}

// Middleware para rutas no encontradas
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
    availableEndpoints: [
      'GET /api/health',
      'GET /api/usuarios',
      'POST /api/usuarios',
      'GET /api/categorias',
      'POST /api/categorias',
      'GET /api/camisetas',
      'POST /api/camisetas',
      'POST /api/camisetas/publicar'
    ]
  });
}

// Helper para validar IDs
export function validateId(id: string): { valid: boolean; value?: number; error?: string } {
  const idNumber = parseInt(id);
  
  if (isNaN(idNumber)) {
    return { valid: false, error: 'ID debe ser un número' };
  }
  
  if (idNumber <= 0) {
    return { valid: false, error: 'ID debe ser un número positivo' };
  }
  
  return { valid: true, value: idNumber };
}
