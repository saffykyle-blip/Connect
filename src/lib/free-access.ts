export const FREE_ACCESS_PREFIX = "CUS_FREE_";

export function isFreeAccessModeEnabled(): boolean {
  return (process.env.CONNECT_PAYMENT_MODE ?? "free").toLowerCase() !== "paid";
}

export function isFreeAccessCode(customerCode?: string | null): boolean {
  return !!customerCode && customerCode.startsWith(FREE_ACCESS_PREFIX);
}

export function createFreeCustomerCode(email: string): string {
  const normalized = email.trim().toLowerCase();
  let hashA = 2166136261;
  let hashB = 5381;

  for (let index = 0; index < normalized.length; index += 1) {
    const charCode = normalized.charCodeAt(index);
    hashA ^= charCode;
    hashA = Math.imul(hashA, 16777619);
    hashB = Math.imul(hashB, 33) ^ charCode;
  }

  const partA = (hashA >>> 0).toString(36).toUpperCase().padStart(7, "0");
  const partB = (hashB >>> 0).toString(36).toUpperCase().padStart(7, "0");

  return `${FREE_ACCESS_PREFIX}${partA}${partB}`;
}
