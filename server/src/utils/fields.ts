import { z } from "zod";
import { $Enums } from "@/database/prisma.js";

type EnumLike = { [k: string]: string | number };

export function enumSchema<const T extends readonly [string, ...string[]]>(
  values: T,
  label: string
): z.ZodEnum<{ [K in T[number]]: K }>;

export function enumSchema<T extends EnumLike>(
  values: T,
  label: string
): z.ZodEnum<T>;

export function enumSchema( values: readonly string[] | EnumLike,label: string): z.ZodType<string> {
  const options = Array.isArray(values) ? values : Object.values(values);

  return z.enum(values as [string, ...string[]], {
    error: `${label} must be one of: ${options.join(", ")}`,
  });
}

export const toBoolean = (name: string) =>
    z.stringbool({
        truthy: ["1"],
        falsy: ["0"],
        case: "sensitive",
        error: `${name} must be "1" or "0"`,
    });


export const paymentMethod = enumSchema($Enums.EnumPaymentMethod, "Payment method");

export const typeOfPayment = enumSchema($Enums.EnumPaymentType, "Type of payment");

export const tipo_equipment = enumSchema($Enums.EnumEquipmentType, "Equipment type");

export const EnumRol = enumSchema($Enums.EnumRol, "Role");

export const EnumOrderStatus = enumSchema($Enums.EnumOrderStatus, "Order status");

export const EnumBudgetStatus = enumSchema($Enums.EnumBudgetStatus, "Budget status");

export const EnumFailureStatus = enumSchema($Enums.EnumFailureStatus, "Failure status");

export const sortOrder = enumSchema(["asc", "desc"], "sortOrder" );

export const username = z
    .string({
        error: (issue) => {
            if (issue.code === "invalid_type") return "Username must be a string";
            return "Username is required";
        },
    })
    .trim()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username cannot be longer than 30 characters");

export const password = z
    .string({
        error: (issue) => {
            if (issue.code === "invalid_type") return "Password must be a string";
            return "Password is required";
        },
    })
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password cannot be longer than 100 characters");

export const email = z
    .email({
        error: (issue) => {
            if (issue.code === "invalid_type") return "Email must be a string";
            if (issue.code === "invalid_format") return "Email must be a valid email address";
            return "Email is required";
        },
    });

export const name = z
    .string({
        error: (issue) => {
            if (issue.code === "invalid_type") return "Name must be a string";
            return "Name is required";
        },
    })
    .trim()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name cannot be longer than 100 characters");

export const isActiveQuery = toBoolean("Is active");

export const cuit = z
    .string({
        error: (issue) => {
            if (issue.code === "invalid_type") return "CUIT must be a string";
            return "CUIT is required";
        },
    })
    .trim()
    // Acepta "20-12345678-9" o "20123456789" y lo normaliza a solo dígitos
    .transform((val) => val.replace(/[-\s]/g, ""))
    .refine((val) => /^\d{11}$/.test(val), {
        error: "CUIT must contain 11 numeric digits",
    })
    .refine((val) => {
        // Algoritmo de módulo 11 para el dígito verificador
        const digitos = val.split("").map(Number);
        const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
        const resto = (digitos
            .slice(0, 10)
            .reduce((acc, digito, i) => acc + digito * multiplicadores[i], 0)
        ) % 11;
        const verificadorEsperado = resto === 0 ? 0 : 11 - resto;

        if (verificadorEsperado === 10) return false;
        return verificadorEsperado === digitos[10];
    }, {
        error: "CUIT is invalid",
    });

export const phone = z.e164({
    error: (issue) => {
        if (issue.code === "invalid_type") return "Phone must be a string";
        return "Phone is required";
    },
});

export const cant_s = (name: string) => z
    .number({
        error: (issue) => {
            if (issue.code === "invalid_type") {
                return `${name} must be a number`;
            }

            return `${name} is required`;
        },
    })
    .int({
        error: `${name} must be an integer`,
    })
    .nonnegative({
        error: `${name} must be zero or greater`,
    });

export const cant_n = (name: string) => z.coerce
    .number({
        error: (issue) => {
            if (issue.code === "invalid_type") {
                return `${name} must be a number`;
            }

            return `${name} is required`;
        },
    })
    .int({
        error: `${name} must be an integer`,
    })
    .nonnegative({
        error: `${name} must be zero or greater`,
    });

export const page = z.coerce
    .number({
        error: (issue) => {
            if (issue.code === "invalid_type") {
                return "Page must be a number";
            }

            return "Page is required";
        },
    })
    .int({
        error: "Page must be an integer",
    })
    .positive({
        error: "Page must be greater than 0",
    });

export const limit = z.coerce
    .number({
        error: (issue) => {
            if (issue.code === "invalid_type") {
                return "Limit must be a number";
            }

            return "Limit is required";
        },
    })
    .int({
        error: "Limit must be an integer",
    })
    .positive({
        error: "Limit must be greater than 0",
    })
    .max(1000, "Limit cannot be greater than 1000");

export const id = z
    .uuidv7({
        error: (issue) => {
            if (issue.code === "invalid_type") return "Id must be a string";
            if (issue.code === "invalid_format") return "Id must be a valid UUID v7";
            return "Id is required";
        },
    })


export const percentage = z
    .number({
        error: (issue) => {
            if (issue.code === "invalid_type") return "Percentage must be a number";
            return "Percentage is required";
        },
    })
    .min(0, "Percentage must be at least 0")
    .max(100, "Percentage cannot be greater than 100");


export const brand = z
    .string({
        error: (issue) => {
            if (issue.code === "invalid_type") return "Brand must be a string";
            return "Brand is required";
        },
    })
    .trim()
    .min(1, "Brand must be at least 1 character long")
    .max(100, "Brand cannot be longer than 100 characters");

export const model = z
    .string({
        error: (issue) => {
            if (issue.code === "invalid_type") return "Model must be a string";
            return "Model is required";
        },
    })
    .trim()
    .min(1, "Model must be at least 1 character long")
    .max(100, "Model cannot be longer than 100 characters");

export const observations = z
    .string({
        error: (issue) => {
            if (issue.code === "invalid_type") return "Observations must be a string";
            return "Observations is required";
        },
    })
    .trim()
    .min(1, "Observations must be at least 1 character long")
    .max(500, "Observations cannot be longer than 500 characters");

export const description = z
    .string({
        error: (issue) => {
            if (issue.code === "invalid_type") return "Description must be a string";
            return "Description is required";
        },
    })
    .trim()
    .min(1, "Description must be at least 1 character long")
    .max(500, "Description cannot be longer than 500 characters");

export const date = z.iso.date({
    error: (issue) => {
        if (issue.code === "invalid_type") return "Date must be a string";
        if (issue.code === "invalid_format") return "Date must be a valid date in YYYY-MM-DD format";
        return "Date is required";
    },
});

export const url = z.url({
    error: (issue) => {
        if (issue.code === "invalid_type") return "URL must be a string";
        if (issue.code === "invalid_format") return "URL must be a valid URL";
        return "URL is required";
    },
});

export const price = z
    .number({
        error: (issue) => {
            if (issue.code === "invalid_type") return "Price must be a number";
            return "Price is required";
        },
    })
    .nonnegative({
        error: "Price must be zero or greater",
    });

export const isActive = z.boolean({
    error: (issue) => {
        if (issue.code === "invalid_type") return "Is active must be a boolean";
        return "Is active is required";
    },
});

export const search = z
    .string({
        error: (issue) => {
            if (issue.code === "invalid_type") {
                return "Search must be a string";
            }

            return "Search is required";
        },
    })
    .trim()
    .min(1, "Search cannot be empty")
    .max(100, "Search cannot be longer than 100 characters");
