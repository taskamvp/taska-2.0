from copy import deepcopy as dp

S = [
    (0, 1, 2), (3, 4, 5), (6, 7, 8),
    (0, 3, 6), (1, 4, 7), (2, 5, 8),
    (0, 4, 8), (2, 4, 6)
]

def W(b, p):  # Winner checker
    return any(all(b[x] == p for x in s) for s in S)

def V(b):  # Validity check
    if len(b) != 9 or any(e not in ('X', 'O', '-1') for e in b): return False
    a, z = b.count('X'), b.count('O')
    if a != z: return False
    if W(b, 'X') or W(b, 'O'): return False
    return True

def M(b, c):  # Generate new move boards
    return [b[:i] + [c] + b[i+1:] for i in range(9) if b[i] == '-1']

def E(b):  # Entry function to get all paths where X wins in 2
    T = set()
    for A in M(b, 'X'):
        if W(A, 'X'): T.add(tuple(A)); continue
        for B in M(A, 'O'):
            if W(B, 'O'): continue
            for C in M(B, 'X'):
                if W(C, 'X'): T.add(tuple(C))
    return T

# I/O
B = [input().strip() for _ in range(9)]
if not V(B):
    print("INVALID INPUT", end="")
else:
    print(len(E(B)), end="")