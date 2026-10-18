import jwt from 'jsonwebtoken';

export interface BudgetTokenPayload {
  id_budget: string;
  nroBudget: number;
}

// Este es el type guard
const isBudgetPayload = (value: unknown): value is BudgetTokenPayload => {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.id_budget === 'string' && typeof v.nroBudget === 'number';
};

export const verifyBudgetToken = (token: string): BudgetTokenPayload => {
  const decoded: unknown = jwt.verify(token, process.env.JWT_SECRET as string);
  if (!isBudgetPayload(decoded)) {
    throw new Error('Payload del token inválido');
  }
  return decoded;
};

// Opcional: para firmar, así el payload queda definido en un solo lugar
export const signBudgetToken = (payload: BudgetTokenPayload): string =>
  jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '30d' });