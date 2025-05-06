# Cryptography

Cryptography is the science of securing communication and data through encoding techniques to prevent unauthorized access. It involves transforming information into an unreadable format that can only be reverted to its original form by authorized parties.

## Key Concepts

- **Plaintext**: Original readable data.
- **Ciphertext**: Encoded version of the plaintext.
- **Encryption**: Process of converting plaintext to ciphertext.
- **Decryption**: Process of converting ciphertext back to plaintext.
- **Key**: A piece of information used for encryption and decryption.

## Hashing vs Encryption

| Feature       | Hashing                         | Encryption                         |
| ------------- | ------------------------------- | ---------------------------------- |
| Purpose       | Data integrity and verification | Data confidentiality and security  |
| Reversibility | Irreversible                    | Reversible with the correct key    |
| Example Uses  | Password storage, checksums     | Secure communication, data storage |

More details: [Baeldung - Hashing vs Encryption](https://www.baeldung.com/cs/hashing-vs-encryption)

## Symmetric vs Asymmetric Encryption

| Aspect                | Symmetric Encryption                  | Asymmetric Encryption           |
| --------------------- | ------------------------------------- | ------------------------------- |
| Key Usage             | Single shared key                     | Pair of public and private keys |
| Key Distribution      | Requires secure key exchange          | No need to share private key    |
| Speed                 | Faster                                | Slower                          |
| Data Size Suitability | Suitable for large data volumes       | Suitable for small data volumes |
| Security              | Less secure (single point of failure) | More secure (separate keys)     |
| Common Algorithms     | AES (Advanced Encryption Standard)    | RSA (Rivest-Shamir-Adleman)     |
| Resource Utilization  | Low                                   | High                            |
| Key Lengths           | 128 or 256-bit                        | 2048-bit or higher (for RSA)    |
| Technique Age         | Older                                 | Modern                          |

## RSA vs AES

- **RSA**: Asymmetric cipher using a public key for encryption and a private key for decryption. Suitable for securely exchanging keys and encrypting small amounts of data.
- **AES**: Symmetric cipher using a single shared key for both encryption and decryption. Preferred for encrypting large data due to its speed and efficiency.

## Use Cases

- **Symmetric Encryption (AES)**:

  - Encrypting large files
  - Securing data at rest

- **Asymmetric Encryption (RSA)**:

  - Secure key exchange
  - Digital signatures

## Example (Java - AES)

```java
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

public class AESCipherExample {
    public static void main(String[] args) throws Exception {
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(128);
        SecretKey secretKey = keyGen.generateKey();

        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        byte[] encrypted = cipher.doFinal("Hello, World!".getBytes());

        cipher.init(Cipher.DECRYPT_MODE, secretKey);
        byte[] decrypted = cipher.doFinal(encrypted);

        System.out.println(new String(decrypted));
    }
}
```

## Key Takeaways

- **Symmetric encryption** is fast but requires secure key sharing.
- **Asymmetric encryption** simplifies key distribution but is slower.
- **Hashing** ensures data integrity but is not reversible.
- Combining symmetric and asymmetric encryption (hybrid encryption) is common in secure systems.

For deeper reading:
[Baeldung - Hashing vs Encryption](https://www.baeldung.com/cs/hashing-vs-encryption)
