# Cryptography

[https://www.baeldung.com/cs/hashing-vs-encryption](https://www.baeldung.com/cs/hashing-vs-encryption)

RSA is what's known as an asymmetric cipher where you use one key (your “public key”) to encrypt and a different key (your “secret key”) to decrypt. AES is a symmetric cipher where you use the same key to encrypt and decrypt.

## Difference between symmetric vs asymmetric encryption

- Symmetric encryption uses a single key that needs to be shared among the people who need to receive the message while asymmetric encryption uses a pair of public key and a private key to encrypt and decrypt messages when communicating.
- Symmetric encryption is an old technique while asymmetric encryption is relatively new.
- Asymmetric encryption was introduced to complement the inherent problem of the need to share the key in symmetric encryption model, eliminating the need to share the key by using a pair of public-private keys.
- Asymmetric encryption takes relatively more time than the symmetric encryption.

| Key differences      	| Symmetric Encryption                                                       	| Asymmetric Encryption                                                                        	|
|----------------------	|----------------------------------------------------------------------------	|----------------------------------------------------------------------------------------------	|
| Size of cipher text  	| Smaller cipher text compares to original plain text file.                  	| Larger cipher text compares to original plain text file.                                     	|
| Data size            	| Used to transmit big data.                                                 	| Used to transmit small data.                                                                 	|
| Resource Utilization 	| Symmetric key encryption works on low usage of resources.                  	| Asymmetric encryption requires high consumption of resources.                                	|
| Key Lengths          	| 128 or 256-bit key size.                                                   	| RSA 2048-bit or higher key size.                                                             	|
| Security             	| Less secured due to use a single key for encryption.                       	| Much safer as two keys are involved in encryption and decryption.                            	|
| Number of keys       	| Symmetric Encryption uses a single key for encryption and decryption.      	| Asymmetric Encryption uses two keys for encryption and decryption                            	|
| Techniques           	| It is an old technique.                                                    	| It is a modern encryption technique.                                                         	|
| Confidentiality      	| A single key for encryption and decryption has chances of key compromised. 	| Two keys separately made for encryption and decryption that removes the need to share a key. 	|