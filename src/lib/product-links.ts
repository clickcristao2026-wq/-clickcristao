export const productPath = (id: string) => `/produto/${encodeURIComponent(id)}`;
export const productPreviewPath = (id: string) => `${productPath(id)}/previa`;
export const productDemoPath = "/produto/demonstracao";
