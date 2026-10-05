export {
  calculatePricing,
  emptyPricing,
  money,
  parseMoney,
  validatePricing,
} from "../../supabase/functions/_shared/domain";
export type { ProductPricing } from "../../supabase/functions/_shared/domain";
export const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );
