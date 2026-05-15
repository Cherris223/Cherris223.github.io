import numpy as np
import time
import matplotlib.pyplot as plt

stdDevs = [1, 3, 5, 7, 10, 12, 15, 18, 20, 22]
n = 256
q = 3329 
msgLen = 128
numRuns = 30

# The main lattice functions
def DiscreteGaussian(size, stdDev):
    return np.random.normal(0, stdDev, size=size).round().astype(int)

def centered_mod(x, q):
    return np.mod(x, q)

def KeyGen(n, q, stdDev):
    secKey = np.random.randint(-1, 2, size=(n,))
    pubVec = np.random.randint(0, q, size=(n, n))
    noise = DiscreteGaussian(n, stdDev)
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

# Collect the data to encrypt
results = []

for stdDev in stdDevs:
    encTimes = []
    decTimes = []
    for _ in range(numRuns):
        secKey, pubVec, pubKey = KeyGen(n, q, stdDev)
        messages = np.random.randint(0, 2, size=(msgLen,))

        startEnc = time.perf_counter()
        cipherVecList, cipherValList = EncryptBits(messages, pubVec, pubKey, q)
        encTimes.append(time.perf_counter() - startEnc)

        startDec = time.perf_counter()
        DecryptBits(cipherVecList, cipherValList, secKey, q)
        decTimes.append(time.perf_counter() - startDec)

    avgEnc = np.mean(encTimes)
    avgDec = np.mean(decTimes)

    results.append({
        'n': n,
        'q': q,
        'stdDev': stdDev,
        'encTime': avgEnc,
        'decTime': avgDec
    })

    print(f"n={n}, q={q}, stdDev={stdDev}, avgEnc={avgEnc:.4f}s, avgDec={avgDec:.4f}s")

# Plot encryption
plt.figure(figsize=(10,6))
xs = [r['stdDev'] for r in results]
encTimes = [r['encTime'] for r in results]
plt.plot(xs, encTimes, marker='o', label=f"n={n}, q={q}")
plt.xlabel("Noise standard deviation")
plt.ylabel("Average encryption time (s)")
plt.title(f"Average Encryption Time vs Noise (over {numRuns} runs)")
plt.legend()
plt.grid(True)
plt.show()

# Plot decryption
plt.figure(figsize=(10,6))
decTimes = [r['decTime'] for r in results]
plt.plot(xs, decTimes, marker='x', linestyle='--', label=f"n={n}, q={q}")
plt.xlabel("Noise standard deviation")
plt.ylabel("Average decryption time (s)")
plt.title(f"Average Decryption Time vs Noise (over {numRuns} runs)")
plt.legend()
plt.grid(True)
plt.show()
