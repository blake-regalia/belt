export const subtle_decrypt = (...a: Parameters<SubtleCrypto['decrypt']>): ReturnType<SubtleCrypto['decrypt']> => crypto.subtle.decrypt(...a);
export const subtle_derive_bits = (...a: Parameters<SubtleCrypto['deriveBits']>): ReturnType<SubtleCrypto['deriveBits']> => crypto.subtle.deriveBits(...a);
export const subtle_derive_key = (...a: Parameters<SubtleCrypto['deriveKey']>): ReturnType<SubtleCrypto['deriveKey']> => crypto.subtle.deriveKey(...a);
export const subtle_digest = (...a: Parameters<SubtleCrypto['digest']>): ReturnType<SubtleCrypto['digest']> => crypto.subtle.digest(...a);
export const subtle_encrypt = (...a: Parameters<SubtleCrypto['encrypt']>): ReturnType<SubtleCrypto['encrypt']> => crypto.subtle.encrypt(...a);
export const subtle_export_key = (...a: Parameters<SubtleCrypto['exportKey']>): ReturnType<SubtleCrypto['exportKey']> => crypto.subtle.exportKey(...a);
export const subtle_generate_key = (...a: Parameters<SubtleCrypto['generateKey']>): ReturnType<SubtleCrypto['generateKey']> => crypto.subtle.generateKey(...a);
export const subtle_import_key = (...a: Parameters<SubtleCrypto['importKey']>): ReturnType<SubtleCrypto['importKey']> => crypto.subtle.importKey(...a);
export const subtle_sign = (...a: Parameters<SubtleCrypto['sign']>): ReturnType<SubtleCrypto['sign']> => crypto.subtle.sign(...a);
export const subtle_unwrap_key = (...a: Parameters<SubtleCrypto['unwrapKey']>): ReturnType<SubtleCrypto['unwrapKey']> => crypto.subtle.unwrapKey(...a);
export const subtle_verify = (...a: Parameters<SubtleCrypto['verify']>): ReturnType<SubtleCrypto['verify']> => crypto.subtle.verify(...a);
export const subtle_wrap_key = (...a: Parameters<SubtleCrypto['wrapKey']>): ReturnType<SubtleCrypto['wrapKey']> => crypto.subtle.wrapKey(...a);

