import numpy as np
import time

stdDev = 12
n = 256
q = 3329 
msgLen = 128
numRuns = 30

# The main lattice functions
def RandomGaussian(size, stdDev):
    return np.random.normal(0, stdDev, size=size).round().astype(int)

def centered_mod(x, q):
    return np.mod(x, q)

def KeyGen(n, q, stdDev):
    secKey = np.random.randint(-1, 2, size=(n,))
    pubVec = np.random.randint(0, q, size=(n, n))
    noise = RandomGaussian(n, stdDev)
    pubKey = centered_mod(pubVec @ secKey + noise, q)
    return secKey, pubVec, pubKey

def EncryptBits(messageBits, pubVec, pubKey, q):
    randVecList = np.random.randint(0, 2, size=(len(messageBits), pubVec.shape[0]))
    cipherVecList = centered_mod(randVecList @ pubVec, q)
    cipherValList = centered_mod(randVecList @ pubKey + (q // 2) * np.array(messageBits), q)
    return cipherVecList, cipherValList

def DecryptBits(cipherVecList, cipherValList, secKey, q):
    vals = centered_mod(cipherValList - np.sum(cipherVecList * secKey, axis=1), q)
    return np.where((vals < q//4) | (vals > 3*q//4), 0, 1)

# Demo the code
def Demo(pubVec, pubKey, secKey, q):
    print("\nEnter arrays of bits\n")
    while True:
        # Get the inputs
        inputLine = input("Enter bits: ").strip()
        if inputLine.lower() == "exit": # Allow for exit
            print("Exiting")
            break

        # Splite the arrays of bits with | to allow for multiple inputs at once
        bitArrays = [arr.strip() for arr in inputLine.split("|")]

        for bitArray in bitArrays: # Go through each of the characters in the string
            try: # Run the algormithm on it
                # Convert input string to bit array
                bits = np.array([int(b) for b in bitArray.split()])
                if not np.all((bits == 0) | (bits == 1)):
                    raise ValueError

                # Encrypt and decrypt the bits
                cipherVecList, cipherValList = EncryptBits(bits, pubVec, pubKey, q)
                decrypted = DecryptBits(cipherVecList, cipherValList, secKey, q)

                # Compare results to test for accuracy
                match = np.array_equal(bits, decrypted)
                print(f"Input bits:      {bits}")
                print(f"Decrypted bits:  {decrypted}")
                print(f"Test Passed: {match}\n" if match else f"Test Failed\n")

                # Bufffer
                time.sleep(1)

            except ValueError: # Just in case I type it in wrong
                print(f"Invalid input in array '{bitArray}'. Please enter only 0s and 1s separated by spaces.\n")

secKey, pubVec, pubKey = KeyGen(n, q, stdDev) # Generate the keys once
Demo(pubVec, pubKey, secKey, q) # Run the demo