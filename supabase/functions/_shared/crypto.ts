import { HttpError } from "./errors.ts";
const encode = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const decode = (value: string) =>
  Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
async function encryptionKey() {
  try {
    const bytes = decode(Deno.env.get("AI_CREDENTIAL_ENCRYPTION_KEY") ?? "");
    if (bytes.length !== 32) throw new Error();
    return await crypto.subtle.importKey("raw", bytes, "AES-GCM", false, [
      "encrypt",
      "decrypt",
    ]);
  } catch {
    throw new HttpError(
      503,
      "A proteção das chaves de IA ainda não foi configurada no servidor.",
    );
  }
}
export async function encryptKey(value: string, userId: string) {
  const key = await encryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: new TextEncoder().encode(userId) },
    key,
    new TextEncoder().encode(value),
  );
  return `${encode(iv)}.${encode(new Uint8Array(ciphertext))}`;
}
export async function decryptKey(value: string, userId: string) {
  const key = await encryptionKey();
  try {
    const [iv, ciphertext] = value.split(".");
    return new TextDecoder().decode(
      await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: decode(iv),
          additionalData: new TextEncoder().encode(userId),
        },
        key,
        decode(ciphertext),
      ),
    );
  } catch {
    throw new HttpError(
      503,
      "Não foi possível abrir sua chave. Configure a integração novamente.",
    );
  }
}
