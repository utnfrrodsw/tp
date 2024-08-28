import { z } from "zod";

export const signupUserSchema = z.object({
    body: z.object({
        firstname: z.string().min(1, "Firstname is required"),
        lastname: z.string().min(1, "Lastname is required"),
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
    })
})


export const updateUserSchema = z.object({
    body: z.object({
        firstname: z.string().min(1, "Firstname is required").optional(),
        lastname: z.string().min(1, "Lastname is required").optional(),
        email: z.string().email("Invalid email format").optional(),
        password: z.string().min(6, "Password must be at least 6 characters long").optional(),
        rol: z.string().optional(),
    }),
    params: z.object({
        id: z.string().min(1),
    })
})

export const signinUserSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(6, "Password must be at least 6 characters long"),

    })
})



