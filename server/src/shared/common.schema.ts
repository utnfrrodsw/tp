import { z } from "zod";
import { id, search, page, limit, sortOrder} from "@/utils/fields.js";

export const idSchema = z.object({
    id: id,
});

export type IdDto = z.infer<typeof idSchema>;

export const QuerySchema = z.object({
    search: search.optional(),
    page: page.default(1),
    limit: limit.default(50),
    sortOrder: sortOrder.default("asc"),
});

export type QuerySchemaDto = z.infer<typeof QuerySchema>;