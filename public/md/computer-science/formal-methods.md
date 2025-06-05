# Formal Methods & Logic

## Overview

Formal Methods are mathematically-based techniques for specifying, developing, and verifying software and hardware systems. They provide rigorous foundations for reasoning about system correctness, safety, and security.

## Mathematical Logic Foundations

### Propositional Logic

**Basic building blocks of logical reasoning**

```
Propositions: p, q, r (true or false statements)
Connectives:
- ¬p (negation): not p
- p ∧ q (conjunction): p and q
- p ∨ q (disjunction): p or q
- p → q (implication): if p then q
- p ↔ q (biconditional): p if and only if q
```

### Truth Tables

```
p | q | p∧q | p∨q | p→q | p↔q
--|---|-----|-----|-----|-----
T | T |  T  |  T  |  T  |  T
T | F |  F  |  T  |  F  |  F
F | T |  F  |  T  |  T  |  F
F | F |  F  |  F  |  T  |  T
```

### Predicate Logic

**Extension with quantifiers and predicates**

```
Predicates: P(x), Q(x,y) (relations over domains)
Quantifiers:
- ∀x P(x): for all x, P(x) is true
- ∃x P(x): there exists x such that P(x) is true

Example:
∀x (Student(x) → ∃y (Takes(x,y) ∧ Course(y)))
"Every student takes at least one course"
```

### Set Theory

```
Basic Operations:
- Union: A ∪ B = {x | x ∈ A ∨ x ∈ B}
- Intersection: A ∩ B = {x | x ∈ A ∧ x ∈ B}
- Difference: A \ B = {x | x ∈ A ∧ x ∉ B}
- Complement: A' = {x | x ∉ A}

Relations:
- Subset: A ⊆ B ⟺ ∀x (x ∈ A → x ∈ B)
- Power Set: P(A) = {B | B ⊆ A}
```

## Formal Specification Languages

### Z Notation

**State-based specification language**

```z notation
-- Bank Account Example
[ACCOUNT, AMOUNT]

BankAccount
  account : ACCOUNT
  balance : AMOUNT

  balance ≥ 0

Deposit
  ΔBankAccount
  amount? : AMOUNT

  amount? > 0
  balance' = balance + amount?
  account' = account

Withdraw
  ΔBankAccount
  amount? : AMOUNT

  amount? > 0
  amount? ≤ balance
  balance' = balance - amount?
  account' = account
```

### VDM (Vienna Development Method)

```vdm
-- Stack specification
Stack = seq of int

push: int * Stack -> Stack
push(x, s) ≜ [x] ^ s

pop: Stack -> int * Stack
pop(s) ≜ hd s, tl s
pre s ≠ []

isEmpty: Stack -> bool
isEmpty(s) ≜ s = []
```

### Alloy

```alloy
-- File system model
sig File {}
sig Dir {
  contents: set (File + Dir)
}

// A directory cannot contain itself
fact NoSelfContainment {
  no d: Dir | d in d.^contents
}

// Check that the file system is acyclic
assert NoLoops {
  no d: Dir | d in d.^contents
}
```

## Model Checking

### Temporal Logic

**Reasoning about time and system evolution**

#### Linear Temporal Logic (LTL)

```
Operators:
- Xφ: φ holds in the next state
- Fφ: φ eventually holds (Future)
- Gφ: φ always holds (Globally)
- φUψ: φ holds until ψ holds (Until)

Examples:
- G(request → F response): "Every request eventually gets a response"
- GF fair: "Fairness property - infinitely often fair"
- F G stable: "Eventually always stable"
```

#### Computation Tree Logic (CTL)

```
Path quantifiers: A (all paths), E (exists path)
Temporal operators: X, F, G, U

Examples:
- AG(request → AF response): "On all paths, requests get responses"
- EF deadlock: "There exists a path to deadlock"
- AG EF reset: "Reset is always possible"
```

### Model Checking Process

```
1. System Modeling
   - State machines, Petri nets, process algebras
   - Abstract system behavior

2. Property Specification
   - Temporal logic formulas
   - Safety and liveness properties

3. Verification
   - Exhaustive state space search
   - Counterexample generation
   - Bug finding and debugging
```

## Program Verification

### Hoare Logic

**Reasoning about program correctness**

```
Hoare Triple: {P} S {Q}
- P: Precondition
- S: Statement/Program
- Q: Postcondition

Rules:
Assignment: {Q[x:=E]} x := E {Q}
Sequence: {P} S1 {R}, {R} S2 {Q} ⊢ {P} S1; S2 {Q}
Conditional: {P∧B} S1 {Q}, {P∧¬B} S2 {Q} ⊢ {P} if B then S1 else S2 {Q}
```

### Example Verification

```pascal
// Prove: {x ≥ 0} y := x; z := 0; while y > 0 do (z := z + 1; y := y - 1) {z = x}

{x ≥ 0}
y := x;
{y ≥ 0 ∧ y = x}
z := 0;
{y ≥ 0 ∧ y = x ∧ z = 0}
// Loop invariant: y ≥ 0 ∧ z + y = x
while y > 0 do
  {y > 0 ∧ y ≥ 0 ∧ z + y = x}
  z := z + 1;
  {y > 0 ∧ y ≥ 0 ∧ z + y = x + 1}
  y := y - 1
  {y ≥ 0 ∧ z + y = x}
{y = 0 ∧ z + y = x}
{z = x}
```

### Weakest Precondition

```
wp(x := E, Q) = Q[x:=E]
wp(S1; S2, Q) = wp(S1, wp(S2, Q))
wp(if B then S1 else S2, Q) = (B → wp(S1, Q)) ∧ (¬B → wp(S2, Q))
wp(while B do S, Q) = solution to X = Q ∧ (B → wp(S, X)) ∧ (¬B → Q)
```

## Type Systems

### Simple Type Systems

```haskell
-- Type rules
x : τ ∈ Γ
-----------
Γ ⊢ x : τ

Γ ⊢ e1 : τ1 → τ2    Γ ⊢ e2 : τ1
--------------------------------
Γ ⊢ e1 e2 : τ2

Γ, x : τ1 ⊢ e : τ2
-------------------
Γ ⊢ λx.e : τ1 → τ2
```

### Dependent Types

```agda
-- Vector type parameterized by length
data Vec (A : Set) : ℕ → Set where
  []  : Vec A zero
  _∷_ : {n : ℕ} → A → Vec A n → Vec A (suc n)

-- Safe head function
head : {A : Set} {n : ℕ} → Vec A (suc n) → A
head (x ∷ xs) = x
```

### Linear Types

```
Linear typing prevents aliasing:
- Each resource used exactly once
- No duplication or discarding
- Memory safety without garbage collection

Example:
consume : !a → b
share : a → a ⊗ a  // Tensor product for duplication
```

## Process Algebras

### CCS (Calculus of Communicating Systems)

```
Processes:
- 0: Null process
- α.P: Action prefix
- P + Q: Choice
- P | Q: Parallel composition
- P \ L: Restriction
- P[f]: Relabeling

Example:
VendingMachine = coin.coffee.VendingMachine + coin.tea.VendingMachine
Customer = coin.(coffee.0 + tea.0)
System = VendingMachine | Customer
```

### CSP (Communicating Sequential Processes)

```
Processes:
- STOP: Deadlock
- SKIP: Successful termination
- a → P: Event prefix
- P □ Q: External choice
- P ⊓ Q: Internal choice
- P ||| Q: Interleaving
- P || Q: Parallel composition

Example:
BUFFER = in?x → out!x → BUFFER
PRODUCER = out!data → PRODUCER
CONSUMER = in?x → process(x) → CONSUMER
```

### π-calculus (Pi-calculus)

```
Mobile processes with channel passing:
- 0: Null process
- x̄⟨y⟩.P: Send y on channel x
- x(y).P: Receive on channel x
- P | Q: Parallel composition
- (νx)P: New channel creation

Example:
Forwarder(in,out) = in(x).out⟨x⟩.Forwarder(in,out)
```

## Theorem Proving

### Natural Deduction

```
Logical Rules:
∧-Introduction: P, Q ⊢ P ∧ Q
∧-Elimination: P ∧ Q ⊢ P, P ∧ Q ⊢ Q
→-Introduction: P ⊢ Q implies ⊢ P → Q
→-Elimination: P → Q, P ⊢ Q (Modus Ponens)
```

### Proof Assistants

#### Coq

```coq
Theorem plus_comm : forall n m : nat, n + m = m + n.
Proof.
  intros n m.
  induction n as [| n' IHn'].
  - simpl. rewrite <- plus_n_O. reflexivity.
  - simpl. rewrite IHn'. rewrite plus_n_Sm. reflexivity.
Qed.
```

#### Isabelle/HOL

```isabelle
theorem plus_comm: "n + m = m + (n::nat)"
proof (induct n)
  case 0
  thus ?case by simp
next
  case (Suc n)
  thus ?case by simp
qed
```

### Automated Theorem Proving

- **Resolution**: Clause-based proof method
- **Tableaux**: Semantic proof method
- **SMT Solvers**: Satisfiability Modulo Theories
- **ATP Systems**: Vampire, E, SPASS

## Software Verification Tools

### Static Analysis

```c
// Example: Buffer overflow detection
void vulnerable_function(char* input) {
    char buffer[100];
    strcpy(buffer, input);  // Potential overflow
}

// Tool detection:
// CBMC: Bounded model checking
// Polyspace: Runtime error detection
// Astrée: Safety-critical software analysis
```

### Dynamic Analysis

- **Runtime Verification**: Monitor system execution
- **Fuzzing**: Automated test case generation
- **Symbolic Execution**: Path exploration
- **Concolic Testing**: Concrete + symbolic execution

### Industrial Tools

- **SPARK**: Ada subset for safety-critical systems
- **Dafny**: Specification language with verification
- **TLA+**: System specification and verification
- **UPPAAL**: Real-time system verification

## Safety and Security

### Safety Properties

```
Safety: "Nothing bad happens"
- Mutual exclusion
- Deadlock freedom
- Type safety
- Memory safety

Liveness: "Something good eventually happens"
- Progress guarantees
- Fairness properties
- Termination
```

### Security Properties

```
Information Flow Security:
- Noninterference: High inputs don't affect low outputs
- Confidentiality: Secret information not leaked
- Integrity: Data not corrupted by untrusted sources

Access Control:
- Authentication: Identity verification
- Authorization: Permission checking
- Audit: Action logging
```

### Formal Security Models

```
Bell-LaPadula Model (Confidentiality):
- Simple Security: No read up
- *-Property: No write down

Biba Model (Integrity):
- Simple Integrity: No read down
- *-Integrity: No write up

Chinese Wall Model:
- Conflict of interest prevention
- Dynamic access control
```

## Real-World Applications

### Aviation Systems

- **DO-178C**: Software safety standards
- **SCADE**: Safety-critical design
- **Astrée**: Airbus A380 verification
- **CompCert**: Verified C compiler

### Nuclear Safety

- **SPARK**: Nuclear reactor control
- **B-Method**: Paris Metro automation
- **Event-B**: Railway interlocking systems
- **Safety Cases**: Formal argumentation

### Blockchain Verification

```solidity
// Smart contract verification
contract Auction {
    mapping(address => uint) bids;
    address winner;

    // Invariant: winner has highest bid
    function bid() payable {
        require(msg.value > bids[winner]);
        bids[msg.sender] = msg.value;
        winner = msg.sender;
    }
}
```

### Cryptographic Protocols

- **Protocol verification**: Security properties
- **Key exchange**: Authentication protocols
- **Voting systems**: Privacy and correctness
- **Zero-knowledge proofs**: Formal verification

## Limitations and Challenges

### Scalability Issues

- **State explosion**: Exponential growth
- **Abstraction**: Lossy but necessary
- **Compositional reasoning**: Modular verification
- **Incremental verification**: Change handling

### Specification Challenges

- **Requirements capture**: Natural language ambiguity
- **Completeness**: Missing requirements
- **Consistency**: Conflicting specifications
- **Evolution**: Changing requirements

### Tool Integration

- **Interoperability**: Tool chain integration
- **Usability**: Practitioner adoption
- **Training**: Skill requirements
- **Cost-benefit**: Investment justification

## Interview Tips

### Common Questions

1. **What are formal methods?**: Mathematical specification and verification
2. **Difference between safety and liveness?**: Bad things vs good things
3. **What is model checking?**: Exhaustive state space verification
4. **Explain Hoare logic**: Program correctness reasoning
5. **When to use formal methods?**: Safety-critical, high-assurance systems

### Technical Concepts

- Temporal logic formulas and their meanings
- Type system properties and guarantees
- Verification vs validation differences
- Abstraction techniques and trade-offs
- Tool capabilities and limitations

### Practical Applications

- Safety-critical system examples
- Security protocol verification
- Smart contract formal analysis
- Compiler correctness proofs
- Hardware verification methods

## Best Practices

### When to Use Formal Methods

- **Safety-critical systems**: Lives depend on correctness
- **Security protocols**: Cryptographic correctness
- **High-cost failures**: Expensive to fix post-deployment
- **Regulatory requirements**: Standards compliance
- **Complex algorithms**: Mathematical correctness

### Adoption Strategy

- **Start small**: Pilot projects and proof of concepts
- **Tool selection**: Match tools to problem domain
- **Training investment**: Skill development programs
- **Process integration**: Development workflow incorporation
- **Cost-benefit analysis**: Return on investment measurement

### Success Factors

- **Management support**: Resource allocation
- **Team expertise**: Technical skill development
- **Tool maturity**: Reliable verification tools
- **Clear objectives**: Specific verification goals
- **Incremental adoption**: Gradual process improvement

Formal Methods provide mathematical rigor for building correct, safe, and secure systems, particularly crucial in domains where failures have serious consequences.
