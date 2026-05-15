import numpy as np

n = 4028
q = 2**15  
std_dev = 3 

def KeyGen():
    secKey = np.random.randint(-1, 2, n)
    pubVec = np.random.randint(0, q, n)
    noise = np.random.randint(-std_dev, std_dev + 1, n)
    pubKey = (pubVec * secKey + noise) % q
    return (pubVec, pubKey), secKey

def Encrypt(pubKeyPair, message):
    pubVec, pubKey = pubKeyPair
    randVec = np.random.randint(-1, 2, n)
    noise1 = np.random.randint(-std_dev, std_dev + 1)
    noise2 = np.random.randint(-std_dev, std_dev + 1)
    cipherVec = (pubVec * randVec + noise1) % q
    cipherVal = (np.dot(pubKey, randVec) + noise2 + (q // 2 if message else 0)) % q
    return (cipherVec, cipherVal)

def Decrypt(secKey, cipherText):
    cipherVec, cipherVal = cipherText
    messageEstimate = (cipherVal - np.dot(cipherVec, secKey)) % q
    return 1 if q // 4 < messageEstimate < 3 * q // 4 else 0

def EncryptArray(pubKeyPair, messages):
    return [Encrypt(pubKeyPair, m) for m in messages]

def DecryptArray(secKey, cipherTexts):
    return [Decrypt(secKey, c) for c in cipherTexts]

def TestSingle():
    for message in [0, 1]:
        print(f"Message: {message}")
        pubKeyPair, secKey = KeyGen()
        pubVec, pubKey = pubKeyPair
        print(f"Keys:\n   Public Vector: {pubVec}\n   Public Key: {pubKey}\n   Secret Key: {secKey}")
        cipherText = Encrypt(pubKeyPair, message)
        cipherVec, cipherVal = cipherText
        print(f"CipherText:\n   Cipher Vector: {cipherVec}\n   Cipher Value: {cipherVal}")
        decrypted = Decrypt(secKey, cipherText)
        print(f"Decrypted Message: {decrypted}")

def TestEncryption(trials=100):
    for message in [0, 1]:
        failures = 0
        for _ in range(trials):
            pubKeyPair, secKey = KeyGen()
            cipherText = Encrypt(pubKeyPair, message)
            decrypted = Decrypt(secKey, cipherText)
            if decrypted != message:
                failures += 1
        print(f"Message {message}: {failures}/{trials} failed decryptions")

def TestEncryptionArray(trials=100, array_length=5):
    for _ in range(trials):
        pubKeyPair, secKey = KeyGen()
        
        messages = np.random.randint(0, 2, array_length)
        
        cipherTexts = EncryptArray(pubKeyPair, messages)
        decrypted = DecryptArray(secKey, cipherTexts)
        
        failures = sum(m != r for m, r in zip(messages, decrypted))
        
        print(f"Message: {messages}")
        print(f"Decrypted: {decrypted}")
        print(f"Failed decryptions in this trial: {failures}\n")

def SelectTest():
    while True:
        print("\nSelect Test:")
        print("1: TestSingle")
        print("2: TestEncryption")
        print("3: TestEncryptionArray")
        
        inputLine = input().strip()
        
        if inputLine.lower() == "exit":
            print("Exiting")
            break
        elif inputLine == "1":
            TestSingle()
        elif inputLine == "2":
            try:
                trials = int(input("Enter number of trials to run: ").strip())
            except ValueError:
                trials = 100
                print("Invalid input")
            TestEncryption(trials)
        elif inputLine == "3":
            try:
                trials = int(input("Enter number of trials to run: ").strip())
                array_length = int(input("Enter array length to test: ").strip())
            except ValueError:
                trials = 100
                array_length = 5
                print("Invalid input")
            TestEncryptionArray(trials, array_length)
        else:
            print("Invalid selection")

SelectTest()


