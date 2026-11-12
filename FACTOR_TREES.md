# Factor Trees — Concept Specification

## 1. Purpose

This document defines **factor trees** (*arbres de factorització*) precisely, for an AI implementor that starts cold. It records the owner's mental model (a secondary-school mathematics teacher in Catalonia) and fixes the vocabulary, the drawing convention, the invariants and the counting results that any future feature built on factor trees must respect.

It is a **concept document only**. It does not describe any page, challenge or code in this repository yet. If a feature is later built on it, that feature's specification must reference this file and must not contradict it without an explicit owner decision.

All student-facing text derived from this document must be in **Catalan** (see `CLAUDE.md`). The Catalan terms are given in §2.

## 2. Vocabulary

| English (this doc) | Catalan (student-facing) | Meaning |
|---|---|---|
| factor tree | arbre de factorització | the whole structure |
| root / seed | arrel / llavor | the number being factorised (top node) |
| branch (edge) | branca | segment joining a node to one of its two children |
| internal node | nus intern | a composite number that has been split |
| leaf | fulla | a prime number; it is not split any further |
| split | descomposició | replacing a composite `n` by two factors `a · b = n` |

The owner uses *arrel* and *llavor* interchangeably for the root.

## 3. Formal definition

Let `n ≥ 2` be an integer. A **factor tree of `n`** is a rooted binary tree, each node labelled with an integer `≥ 2`, such that:

1. The root is labelled `n`.
2. A node labelled with a **prime** `p` is a **leaf** (it has no children).
3. A node labelled with a **composite** `m` has **exactly two children**, labelled `a` and `b`, with `a · b = m` and `1 < a, b < m`.

Consequences:

- Every leaf is prime; every internal node is composite (a composite node can never be a leaf, a prime node can never be split).
- The trivial split `m = 1 · m` is forbidden (it would never terminate and `1` is not prime).
- If `n` is prime, the tree is the single node `n` (root = leaf).

### 3.1 Child order

The owner's convention: **the order of the two children does not matter** mathematically. `30 → {5, 6}` and `30 → {6, 5}` are the *same* tree. A split is an **unordered pair** (a multiset of size 2: `{6, 6}` is allowed for `36`).

When drawing, a canonical left/right order may be chosen (see §4), but two trees that differ only by swapping children at some nodes are equal. §6 gives counts for both conventions so that an implementation can choose deliberately.

## 4. Drawing convention

The owner prefers the **vertical** layout: root at the top, branches going down, leaves at the bottom.

```
     30
    /  \
   5    6
       / \
      3   2
```

Equivalent inline notation used in conversation: `30 → {5, 6}`, then `{5} = {5}` (already a leaf) and `{6} = {2, 3}` (two leaves).

Recommended (not mandated) canonical order for rendering: smaller factor on the left, i.e. `a ≤ b`. Under that rule the tree above is drawn `30 → {5, 6}`, `6 → {2, 3}`.

## 5. Non-uniqueness of the tree, uniqueness of the leaves

### 5.1 The same root admits several trees

The choice of the first split (and of every later split) is free. For `30` there are exactly **three** distinct trees:

```
     30            30            30
    /  \          /  \          /  \
   2    15       3    10       5    6
       /  \          /  \          /  \
      3    5        2    5        2    3
```

### 5.2 Invariant: the multiset of leaves

**Fundamental Theorem of Arithmetic.** Every integer `n ≥ 2` has a unique factorisation `n = p₁^e₁ · p₂^e₂ · … · p_k^e_k` into primes, up to order.

For every factor tree of `n`, the **multiset of leaves is exactly** `{p₁ (e₁ times), …, p_k (e_k times)}`. Proof sketch: by induction on the tree, the product of the leaves under any node equals that node's label, and the leaves are primes; uniqueness of the prime factorisation does the rest.

So: **the tree is not unique, the leaves are.** This is the core pedagogical point.

Example `24 = 2³ · 3`: every tree has leaves `{2, 2, 2, 3}`.

### 5.3 Shape is not invariant either

Different trees of the same root can have different shapes (not only different labels). For `24`:

```
   24                      24
  /  \                    /  \
 2    12                 4    6
     /  \               / \  / \
    2    6             2  2 2   3
        / \
       2   3
```

Left: a "caterpillar" of height 3. Right: a balanced tree of height 2.

### 5.4 Quantities that ARE invariant

Let `Ω(n) = e₁ + … + e_k` (number of prime factors counted with multiplicity).

| Quantity | Value | Why |
|---|---|---|
| number of leaves | `Ω(n)` | §5.2 |
| number of internal nodes (splits) | `Ω(n) − 1` | full binary tree |
| total nodes | `2·Ω(n) − 1` | |
| number of branches (edges) | `2·(Ω(n) − 1)` | two per split |
| product of leaves | `n` | |

Quantities that are **not** invariant: shape, height, the set of internal labels, the first split.

Height bounds: `⌈log₂ Ω(n)⌉ ≤ height ≤ Ω(n) − 1` (for `Ω(n) ≥ 2`).

## 6. Counting the trees of a root

Two conventions:

- **U(n)** — unordered children (owner's convention, §3.1).
- **O(n)** — ordered children (left ≠ right; what a naïve renderer distinguishes).

Recurrences (`p` prime):

```
U(p) = 1
U(n) = Σ over a·b = n, 2 ≤ a < b       of U(a)·U(b)
     + [n = a², a ≥ 2]                 ·  U(a)·(U(a)+1)/2

O(p) = 1
O(n) = Σ over a·b = n, 2 ≤ a, b < n   of O(a)·O(b)     (ordered pairs)
```

The `U(a)·(U(a)+1)/2` term counts unordered pairs of (possibly equal) subtrees under a split `{a, a}`.

Reference C (memoise for large `n`):

```c
long U(long n) {
    long s = 0;
    for (long a = 2; a * a <= n; a++)
        if (n % a == 0) {
            long b = n / a, ua = U(a);
            s += (a == b) ? ua * (ua + 1) / 2 : ua * U(b);
        }
    return s ? s : 1;          /* no divisor found: n is prime */
}
```

Values (verified by computation):

| n | factorisation | Ω | U(n) | O(n) |
|---|---|---|---|---|
| 4 | 2² | 2 | 1 | 1 |
| 6 | 2·3 | 2 | 1 | 2 |
| 8 | 2³ | 3 | 1 | 2 |
| 12 | 2²·3 | 3 | 2 | 6 |
| 16 | 2⁴ | 4 | 2 | 5 |
| 24 | 2³·3 | 4 | 4 | 20 |
| 30 | 2·3·5 | 3 | 3 | 12 |
| 36 | 2²·3² | 4 | 6 | 30 |
| 48 | 2⁴·3 | 5 | 9 | 70 |
| 60 | 2²·3·5 | 4 | 9 | 60 |
| 64 | 2⁶ | 6 | 6 | 42 |
| 72 | 2³·3² | 5 | 15 | 140 |
| 100 | 2²·5² | 4 | 6 | 30 |
| 210 | 2·3·5·7 | 4 | 15 | 120 |
| 360 | 2³·3²·5 | 6 | 119 | 2520 |

Closed forms for square-free `n` with `k` distinct primes (all leaves distinct, so trees = full binary trees on `k` labelled leaves):

- `U(n) = (2k − 3)!!` → `k = 2: 1`, `k = 3: 3`, `k = 4: 15`, `k = 5: 105`.
- `O(n) = (2k − 3)!! · 2^(k−1)` → `k = 3: 12`, `k = 4: 120`.

For prime powers `n = p^e`, `U(n)` is the number of unlabelled unordered full binary trees with `e` leaves (Wedderburn–Etherington numbers: 1, 1, 1, 2, 3, 6, 11, 23, … for `e = 1, 2, 3, …`).

## 7. Guidance for any implementation

- **Validation of a student-built tree** must check §3 locally at every node (`a · b = m`, `1 < a, b < m`, leaves prime, composites split). Do **not** compare against one stored "correct" tree: every valid tree is correct (§5.1).
- The **final answer** to check is the leaf multiset, compared as a sorted list against the prime factorisation (§5.2).
- Treat swapped children as equal unless a feature explicitly needs ordered trees (§3.1).
- To enumerate all trees of `n`, recurse over unordered divisor pairs `a ≤ b` exactly as in the `U(n)` recurrence; when `a = b`, generate only unordered pairs of subtrees to avoid duplicates.
- Pedagogical message to preserve in any student-facing text (Catalan): *l'arbre pot ser diferent, però les fulles (els factors primers) sempre són les mateixes.*
