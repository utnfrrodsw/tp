import { z } from "zod";
const registroSchema = z.object({
    name: z.string({required_error: 'Name is required'}).min(1, 'Name must be at least 5 characters').max(50, 'Name must be at most 50 characters'),
    apellido: z.string({required_error: 'Apellido is required'}).min(5, 'Apellido must be at least 5 characters').max(50, 'Apellido must be at most 50 characters'),
    password: z.string({required_error: 'Password is required'}).min(6, 'Password must be at least 6 characters').max(20, 'Password must be at most 20 characters'),
    email: z.string({required_error: 'Email is required'}).email('Must be a valid email'),
    tel: z.string({required_error: 'Phone is required'}).min(9, 'Phone must be at least 9 characters'), // Cambiado de number a string
    direccion: z.string({required_error: 'Address is required'}).optional(),
    localidadId: z.string({required_error: 'Localidad ID is required'}).optional(),
    wallets: z.array(z.string({required_error: 'Wallet ID is required'})).optional().default([]),
}); 

const loginSchema = z.object({
    email: z.string({required_error: 'Email is required'}).email('Must be a valid email'),
    password: z.string({required_error: 'Password is required'}).min(6, 'Password must be at least 6 characters').max(20, 'Password must be at most 20 characters')
});

export { registroSchema, loginSchema };// lo exporto al middleware de validacion