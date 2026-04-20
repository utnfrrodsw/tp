// src/controllers/hardcoverController.ts
import { Request, Response } from 'express';
import { getTrendingBooks, buscarLibroHardcover } from '../services/hardcoverService';

export async function trendingBooksController(req: Request, res: Response) {
  try {
    const books = await getTrendingBooks();

    // Handle null return from getTrendingBooks (indicates loading state)
    if (books === null) {
      return res.status(202).json({ loading: true, books: [] });
    }

    res.json({ loading: false, books });
  } catch (error: any) {
    console.error('Hardcover trending error:', error?.message || error);
    res.status(500).json({ error: 'No se pudieron obtener libros', details: error?.message });
  }
}

export async function getBookBySlugController(req: Request, res: Response) {
  try {
    const slugParam = req.params.slug;
    // Handle both string and string[] cases from req.params
    const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

    if (!slug) {
      return res.status(400).json({ error: 'Slug es requerido' });
    }

    const book = await buscarLibroHardcover(slug);

    if (!book) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    res.json(book);
  } catch (error: any) {
    console.error('Hardcover book by slug error:', error?.message || error);
    res.status(500).json({ error: 'No se pudo obtener el libro', details: error?.message });
  }
}
