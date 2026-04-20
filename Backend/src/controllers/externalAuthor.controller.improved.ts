import { Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import redis from '../redis';

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

// Rate limiting and caching - improved performance
const REQUEST_DELAY = 25; // ms between requests - significantly reduced for better performance
const MAX_RETRIES = 3;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in memory
const REDIS_TTL_SEC = 12 * 60 * 60; // 12 hours in Redis

interface CacheEntry {
  data: any;
  timestamp: number;
}

const authorCache = new Map<string, CacheEntry>();

// Utility functions
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delayMs: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && (error as AxiosError).response?.status === 429) {
      console.log(`Rate limited, retrying in ${delayMs}ms... (${retries} retries left)`);
      await delay(delayMs);
      return retryWithBackoff(fn, retries - 1, delayMs * 2);
    }
    throw error;
  }
}

async function getCachedData(key: string): Promise<any | null> {
  // Check in-memory cache first
  const entry = authorCache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
    return entry.data;
  }
  authorCache.delete(key);

  // Check Redis cache
  if (redis) {
    try {
      const cached = await redis.get(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Update in-memory cache
        authorCache.set(key, { data: parsed, timestamp: Date.now() });
        return parsed;
      }
    } catch (err) {
      console.error('Redis get error:', err);
    }
  }

  return null;
}

async function setCachedData(key: string, data: any): Promise<void> {
  // Set in-memory cache
  authorCache.set(key, { data, timestamp: Date.now() });

  // Set Redis cache
  if (redis) {
    try {
      await redis.setex(key, REDIS_TTL_SEC, JSON.stringify(data));
    } catch (err) {
      console.error('Redis set error:', err);
    }
  }
}

interface AuthorSearchResult {
  id: string;
  name: string;
  photo?: string;
}

interface GoogleBookInfo {
  thumbnail?: string;
  description?: string;
  publisher?: string;
  publishedDate?: string;
}

interface Work {
  title: string;
  googleBooks: GoogleBookInfo;
}

interface AuthorDetailsResponse {
  author: {
    id: string;
    name: string;
    birth_date?: string;
    death_date?: string;
    bio?: string;
    photo?: string;
  };
  works: Work[];
}

interface OpenLibraryAuthor {
  key: string;
  name: string;
  birth_date?: string;
  death_date?: string;
  bio?: string | { value: string };
  photos?: number[];
}

interface OpenLibraryWork {
  title: string;
  covers?: number[];
}

interface GoogleBookItem {
  volumeInfo: {
    title: string;
    imageLinks?: {
      thumbnail?: string;
    };
    description?: string;
    publisher?: string;
    publishedDate?: string;
  };
}

async function searchAuthorByName(name: string): Promise<OpenLibraryAuthor[]> {
  const cacheKey = `search_${name}`;
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await retryWithBackoff(() =>
      axios.get(`https://openlibrary.org/search/authors.json?q=${encodeURIComponent(name)}`)
    );
    const data: OpenLibraryAuthor[] = response.data.docs || [];
    await setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error searching author:', error);
    return [];
  }
}

async function getAuthorDetails(authorId: string): Promise<OpenLibraryAuthor | null> {
  const cacheKey = `details_${authorId}`;
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await retryWithBackoff(() =>
      axios.get(`https://openlibrary.org/authors/${authorId}.json`)
    );
    const data: OpenLibraryAuthor = response.data;
    await setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error getting author details:', error);
    return null;
  }
}

async function getAuthorWorks(authorId: string): Promise<OpenLibraryWork[]> {
  const cacheKey = `works_${authorId}`;
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await retryWithBackoff(() =>
      axios.get(`https://openlibrary.org/authors/${authorId}/works.json`)
    );
    const data: OpenLibraryWork[] = response.data.entries || [];
    await setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error getting author works:', error);
    return [];
  }
}

async function searchBooksByAuthor(authorName: string): Promise<GoogleBookItem[]> {
  const cacheKey = `books_${authorName}`;
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await retryWithBackoff(() =>
      axios.get(`https://www.googleapis.com/books/v1/volumes?q=inauthor:${encodeURIComponent(authorName)}&maxResults=40&key=${GOOGLE_BOOKS_API_KEY}`)
    );
    const data: GoogleBookItem[] = response.data.items || [];
    await setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error searching books in Google Books:', error);
    return [];
  }
}

async function getWikipediaAuthorInfo(authorName: string): Promise<{ bio?: string; photo?: string; birth_date?: string }> {
  const cacheKey = `wiki_${authorName}`;
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await retryWithBackoff(() =>
      axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(authorName)}`)
    );
    const data = response.data;
    const result = {
      bio: data.extract || undefined,
      photo: data.thumbnail?.source || undefined,
      birth_date: undefined // Wikipedia summary doesn't include birth_date easily
    };
    await setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 404) {
      console.log(`Wikipedia page not found for author: ${authorName}`);
    } else {
      console.error('Error fetching from Wikipedia:', error);
    }
    return {};
  }
}

// Improved function to get author photo with multiple fallbacks
async function getAuthorPhoto(authorId: string, authorName: string): Promise<string | undefined> {
  // First try OpenLibrary details
  const details = await getAuthorDetails(authorId);
  if (details?.photos?.length) {
    return `https://covers.openlibrary.org/a/id/${details.photos[0]}-L.jpg`;
  }

  // Fallback to Wikipedia
  const wikiInfo = await getWikipediaAuthorInfo(authorName);
  if (wikiInfo.photo) {
    return wikiInfo.photo;
  }

  // Final fallback - generate avatar from name
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&size=96&background=0ea5e9&color=fff&format=png`;
}

function combineWorksWithGoogleBooks(works: OpenLibraryWork[], googleBooks: GoogleBookItem[]): Work[] {
  const googleBooksMap: { [key: string]: GoogleBookInfo } = {};
  googleBooks.forEach(book => {
    const title = book.volumeInfo.title;
    googleBooksMap[title.toLowerCase()] = {
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || undefined,
      description: book.volumeInfo.description || undefined,
      publisher: book.volumeInfo.publisher || undefined,
      publishedDate: book.volumeInfo.publishedDate || undefined
    };
  });

  return works.map(work => {
    const title = work.title;
    const googleInfo = googleBooksMap[title.toLowerCase()] || {};

    if (!googleInfo.thumbnail && work.covers && work.covers.length > 0) {
      googleInfo.thumbnail = `https://covers.openlibrary.org/b/id/${work.covers[0]}-M.jpg`;
    }

    return { title, googleBooks: googleInfo };
  });
}

export const searchAuthor = async (req: Request, res: Response) => {
  const { name, page = '1', limit = '20' } = req.query; // Default limit increased to 20
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name parameter is required' });
  }

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);

  try {
    // Fetch up to 1000 authors to handle duplicates and pagination correctly
    const response = await retryWithBackoff(() =>
      axios.get(`https://openlibrary.org/search/authors.json?q=${encodeURIComponent(name)}&limit=1000`)
    );
    const authors = response.data.docs || [];
    const numFound = response.data.numFound || 0;

    // Filter unique authors by name to avoid duplicates
    const seen = new Set<string>();
    const uniqueAuthors = authors.filter((author: any) => {
      if (seen.has(author.name)) {
        return false;
      } else {
        seen.add(author.name);
        return true;
      }
    });

    // Apply pagination after filtering
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedAuthors = uniqueAuthors.slice(startIndex, startIndex + limitNum);

    // Fetch photos in parallel for better performance
    const photoPromises = paginatedAuthors.map(async (a: OpenLibraryAuthor) => {
      const id = a.key.replace('/authors/', '');
      const photo = await getAuthorPhoto(id, a.name);
      return { id, name: a.name, photo };
    });

    // Wait for all photos to be fetched
    const result = await Promise.all(photoPromises);

    res.json({
      total: uniqueAuthors.length,
      page: pageNum,
      limit: limitNum,
      authors: result
    });
  } catch (error) {
    console.error('Error searching author:', error);
    res.status(500).json({ error: 'Error searching author' });
  }
};

export const getAuthor = async (req: Request, res: Response) => {
  const idParam = req.params.id;
  // Handle both string and string[] cases from req.params
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  let authorKey: string;

  if (id.startsWith('OL')) {
    authorKey = id;
  } else {
    const decodedName = decodeURIComponent(id);
    const authors = await searchAuthorByName(decodedName);
    if (authors.length === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }
    authorKey = authors[0].key.replace('/authors/', '');
  }

  const authorDetails = await getAuthorDetails(authorKey);
  if (!authorDetails) {
    return res.status(404).json({ error: 'Author details not found' });
  }

  await delay(REQUEST_DELAY);
  const works = await getAuthorWorks(authorKey);

  await delay(REQUEST_DELAY);
  const googleBooks = await searchBooksByAuthor(authorDetails.name);
  const combinedWorks = combineWorksWithGoogleBooks(works, googleBooks);

  let bio = typeof authorDetails.bio === 'string'
    ? authorDetails.bio
    : authorDetails.bio?.value || undefined;
  let photo = authorDetails.photos?.length
    ? `https://covers.openlibrary.org/a/id/${authorDetails.photos[0]}-L.jpg`
    : undefined;
  let birth_date = authorDetails.birth_date || undefined;

  if (!bio || !photo || !birth_date) {
    await delay(REQUEST_DELAY);
    const wikiInfo = await getWikipediaAuthorInfo(authorDetails.name);
    if (!bio && wikiInfo.bio) bio = wikiInfo.bio;
    if (!photo && wikiInfo.photo) photo = wikiInfo.photo;
    if (!birth_date && wikiInfo.birth_date) birth_date = wikiInfo.birth_date;
  }

  const response: AuthorDetailsResponse = {
    author: {
      id: authorKey,
      name: authorDetails.name || '',
      birth_date,
      death_date: authorDetails.death_date || undefined,
      bio,
      photo
    },
    works: combinedWorks
  };

  res.json(response);
};

// Export utility functions for testing
export { retryWithBackoff, getCachedData, setCachedData };
