import z from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // Server
    PORT: z.coerce.number().default(3000),

    // Frontend
    FRONTEND_URL: z.url(),

    // JWT
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),

    // Prisma
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

    // Database
    DB_HOST: z.string().min(1, 'DB_HOST is required'),
    DB_PORT: z.coerce.number().default(3306),
    DB_USER: z.string().min(1, 'DB_USER is required'),
    DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),
    DB_DATABASE: z.string().min(1, 'DB_DATABASE is required'),
    DB_ROOT_PASSWORD: z.string().min(1, 'DB_ROOT_PASSWORD is required'),

    // Email
    EMAIL_HOST: z.string().min(1, 'EMAIL_HOST is required'),
    EMAIL_USER: z.string().min(1, 'EMAIL_USER is required'),
    EMAIL_PASSWORD: z.string().min(1, 'EMAIL_PASSWORD is required'),

    // Cloudinary
    CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
    CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
    CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),

    RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),

});

export const config = envSchema.parse(process.env);