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
	-  **SHA-256:** [The Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International](https://www.researchgate.net/figure/The-generation-of-a-SHA-256-hash-value-for-a-long-message_fig1_349744176) [accessed 13 Dec, 2023] demonstrates the real-time application to calculate the hash value for a very long message. The algorithm is used to encrypt the authentication values across our system.![[SHA256.png]]
	- **Enhanced Cipher hashing:** The cipher hashing with some enchained secure feature is required at the time of two-way hashing. The main goal for enhancing the cipher is to add a secure shift value as well as a secure algorithm code for cross-platform applications ( Mobile software, admin panel, and hardware) within our system. 
``` 
1: function ToText(textNumber: number)  
2: number ← textNumber × secretKey  
3: digitMap ← [′a′,′ b′,′ c′,′ d′,′ e′,′ f ′,′ g′,′ h′,′ i′,′ j′]  
4: while number > 0 do  
5: digit ← number mod 10  
6: textRepresentation ← digitMap[digit] + textRepresentation  
7: number ← ⌊number/10⌋  
8: end while  
9: return textRepresentation  
10: end function  
11: function ToNumber(text: string)  
12: digitMap ← [′a′,′ b′,′ c′,′ d′,′ e′,′ f ′,′ g′,′ h′,′ i′,′ j′]  
13: arrayLength ← length of digitMap  
14: for all character in text do  
15: for all element in digitMap do  
16: if element is equal to character then  
17: result ← result + index of element  
18: end if  
19: end for  
20: end for  
21: finalResult ← parseInt(result)  
22: return absolute value of(finalResult/secretKey) rounded down  
23: end function  
24: function Encrypt(textNumber: number)  
25: text ← ToText(textNumber)  
26: for all character in text do  
27: if character is uppercase then  
28: result ← result + character shifted by(shift −′ A′) mod 26 +′ A′  
29: else  
30: result ← result + character shifted by(shift −′ a′) mod 26 +′ a′  
31: end if  
32: end for  
33: return result  
34: end function  
35: function Decrypt(text: string)  
36: for all character in text do  
37: if character is uppercase then  
38: decipherText ← decipherText + character shifted by(shift +′ A′) mod 26 +′ A′ 
39: else  
40: decipherText ← decipherText + character shifted by(shift +′ a′) mod 26 +′ a′ 
41: end if  
42: end for  
43: return ToNumber(CipherText)
44: end function
```

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

- **Intrusion Detection:** For intruder detection, we developed an alert system  that notified subscribers on every trip. If someone tries to impersonate them  and try to use their identity to start traveling the alert rings and the user will  be notified. Thus from there, they can block the card of the intruder. By doing  this the intruder gets stuck at the station as they are blocked from the system from doing entry/exit.