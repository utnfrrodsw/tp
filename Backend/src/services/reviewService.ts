import { MikroORM } from '@mikro-orm/core';
import { Resena } from '../entities/resena.entity';
import { Libro } from '../entities/libro.entity';
import redis from '../redis';

export const getReviewsByBookId = async (orm: MikroORM, bookId: string) => {
  const cacheKey = `reviews:book:${bookId}`;
  const cacheTTL = parseInt(process.env.CACHE_TTL || '300', 10);

  // Check cache first
  if (redis) {
    try {
      const cachedReviews = await redis.get(cacheKey);
      if (cachedReviews) {
        console.log('Cache hit for reviews');
        return JSON.parse(cachedReviews);
      }
    } catch (error) {
      console.error('Redis get error:', error);
      // Continue to DB query if Redis fails
    }
  }

  // Cache miss, query DB
  const em = orm.em.fork();
  const libro = await em.findOne(Libro, { externalId: bookId });
  if (!libro) {
    throw new Error('Libro no encontrado');
  }

  // Fetch reviews from the database
  const reviews = await em.find(Resena, { libro: { externalId: bookId } });

  // Cache the result with TTL
  if (redis) {
    try {
      await redis.setex(cacheKey, cacheTTL, JSON.stringify(reviews));
    } catch (error) {
      console.error('Redis setex error:', error);
      // Don't fail the request if caching fails
    }
  }

  console.log('Cache miss, fetched from DB');
  return reviews;
}
