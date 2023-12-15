We illustrate the security implementation of our metro rail online card transaction system in three key points. Here we discuss the threat model we used to address our security vulnerabilities, the security issues we need to eliminate, and how we handle them.

### 1. Threat Model
---
We used the STRIDE framework to identify and analyze the potential security threats.
- **Spoofing:** When it comes to using a card to travel, an intruder can use a fake or unauthorized card at the entry point. But our entry and exit points are protected securely with strong authentication and card validation that identify blocked or invalid cards on point.
- **Tampering:** Secure data encryption method, tamper-proof hardware coding, and database restriction reduce the risk of tampering data.
- **Repudiation:** The multi-factor authentication and notification alert system leaving a trail of evidence of a trip, protects the integrity of user data.
- **Information Disclosure:** Various encryption algorithms such as SHA-256 and Enhanced cipher make the user data transparent even for the admins. Also, hidden access control point reduces the risk of data breaches of secure data.
- **Denial-of-Service:** Rules and limitations on registration requests and suspension of brute-force PIN codes mitigate the issues related to denial of service.
- **Elevation of Privilege:** Unauthorized access to administrative functions and manipulation of system settings is impossible due to the admin level in our system. Unauthorized access to the admin panel is handled by the restriction of each level of administrative authority.

### 2. Security Requirement
---
The system security requirement involves the security properties that our system should meet.
Secure authentication, strong encryption, transparent user data, elimination of data storage flaws, and software bugs are the main focuses of our system. To address the problems we ensure passenger information and financial data remain confidential and protected from unauthorized access. We try to maintain the accuracy and completeness of all data throughout its life cycle such as creation, storage, and transmission. We implement multi-factor authentication (MFA) for user login and sensitive transactions and enforce role-based access control (RBAC) to restrict admin access based on their role. Validation of card legitimacy and passenger identity during travel and validation adds another layer to the secure system.

### 3. Algorithms:
---
- **Cryptography:** 
	-  **SHA-256:** [The Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International](https://www.researchgate.net/figure/The-generation-of-a-SHA-256-hash-value-for-a-long-message_fig1_349744176) [accessed 13 Dec, 2023] demonstrates the real-time application to calculate the hash value for a very long message. The algorithm is used to encrypt the authentication values across our system.
	- **Enhanced Cipher hashing:** The cipher hashing with some enchained secure feature is required at the time of two-way hashing. The main goal for enhancing the cipher is to add a secure shift value as well as a secure algorithm code for cross-platform applications ( Mobile software, admin panel, and hardware) within our system. ![[SHA256.png]]

- **Authentication and Authorization:** For most of the part, we used  [Supbase Authentication](https://supabase.com/docs/guides/auth) system which provides strong and secure authentication and validation ways to manage the user data.  Also, we used Twilio to verify our mobile number in addition to Supabase Auth.

```
# CLIENT

1. POST /auth/login
    - Send user mobile number
2. Receive response
    - If successful:
        - Proceed to step 4
    - If 2FA required:
        - Store received request_id in supabase
3. Check 2FA authorization (repeatedly):
    - Send request for authorization status
4. Receive status update:
    - If successful:
        - Enter the PIN code from Twilio
    - If failed or timeout:
        - Display error message

# SERVER

1. On POST /auth/login:
    - Validate Mobile number
    
    - If valid:
        - Give PIN to the mobile number
2. On Twilio received:
    - Store request_id for verification in supabase
3. On client 2FA check request:
    - Check pin and autherization for corresponding request_id
    - Send status to client
4. On authorization status update:
    - Send updated status to client

```

- Intrusion Detection