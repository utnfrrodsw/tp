import { username, password, email, EnumRol, isActive, url, enumSchema, isActiveQuery } from "@/utils/fields.js";
import { QuerySchema } from '@/shared/common.schema.js'
import { z } from "zod";

export const createUserSchema = z.object({
    username: username,
    email: email,
    password: password,
}).strict();

export type CreateUserDto = z.infer<typeof createUserSchema>;

export const modifyUserSchema = z.object({
    userName: username.optional(),
    email: email.optional(),
    urlPicture: url.optional(),
    rol: EnumRol.optional(),
    validationStatus: isActive.optional(),
}).strict();

export type ModifyUserDto = z.infer<typeof modifyUserSchema>;

export const userQuerySchema = QuerySchema.extend({
    sortBy: enumSchema([
        "userName",
        "email",
        "rol",
        "id_user"
    ], "sortBy").default("userName"),
    ofRol: EnumRol.optional(),
    ofValidationStatus: isActiveQuery.optional(),
}).strict();

export type UserQueryDto = z.infer<typeof userQuerySchema>;

