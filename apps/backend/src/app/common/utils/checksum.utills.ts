import { createHash } from "crypto";

export enum ChecksumAlgorithm {
    MD5 = "md5",
    SHA1 = "sha1",
    SHA256 = "sha256",
    SHA512 = "sha512",
}

export function generateChecksum(buffer: Buffer, algorithm: ChecksumAlgorithm): string {
    const hash = createHash(algorithm);
    hash.update(buffer);
    return hash.digest("hex");
}