# Tips for technical questions

In technical interviews, you're being evaluated on more than your ability to write code. The focus is on **problem-solving strategy**, **communication**, **clarity of thinking**, and **how you handle challenges under pressure**.

## What Interviewers Are Looking For

Interviewers evaluate candidates across several dimensions:

- **Problem-Solving**: Can you break down the problem, explore options, and find a solution?
- **Analytical Skills**: Can you analyze trade-offs and optimize your solution?
- **Coding Skills**: Can you write clean, correct, robust, and reasonably efficient code?
- **Technical Knowledge**: Do you demonstrate a good grasp of fundamental data structures, algorithms, and their complexities (Big O)?
- **Communication**: Can you articulate your thought process, explain trade-offs, and respond to feedback?
- **Verification**: Do you test your code thoroughly and find bugs?
- **Debugging and adaptability**: Can you fix issues and respond to feedback?

> 💡 **Key Insight**: The _process_ of reaching a solution is often as important, if not more so, than the final answer itself.

## Ideal Interview Flow

Adopt a systematic approach to tackle coding problems:

1.  **Listen & Clarify**:

    - Ensure you fully understand the question. Don't jump straight into coding.
    - **Ask clarifying questions**: Who will use this? What's the input format/size? What are the constraints (memory, time)? Are there edge cases to consider (empty input, nulls, duplicates)?
    - Restate the problem in your own words to confirm understanding.

2.  **Design an Algorithm**:

    - **Work through examples**: Use a small, concrete example to solidify understanding and test potential approaches. Consider edge cases.
    - **Start simple (Brute Force)**: It's often okay to outline a brute-force solution first, discussing its limitations (e.g., time complexity).
    - **Optimize**: Systematically look for improvements. Consider alternative data structures or algorithms. Use techniques like BUD (Bottlenecks, Unnecessary work, Duplicated work).
    - **Discuss Trade-offs**: Explain the space vs. time complexity implications of different approaches.

3.  **Write Clean Code**:

    - Translate your algorithm into code _after_ you have a solid plan.
    - Focus on readability: Use meaningful variable names, good structure, and modularity.
    - Think out loud as you write, explaining _why_ you're doing things.

4.  **Test Thoroughly**:
    - Don't just assume your code works. **Manually trace** your code with examples (including edge cases identified earlier).
    - Identify potential failure points (null checks, division by zero, off-by-one errors).
    - Mention larger test cases or specific scenarios you'd test if you had more time or a testing framework.

## Key Strategies & Tips

- **Think Out Loud**: Continuously communicate your thought process. Explain your reasoning, dead ends, and optimizations. Silence is detrimental.
- **Data Structure Brainstorm**: If unsure how to approach, run through common data structures (Arrays, Hash Tables, Trees, Graphs, Stacks, Queues, Heaps) and consider how they might apply.
- **Optimize Systematically**: Don't optimize prematurely. Find a working solution, analyze its complexity, identify bottlenecks, and then optimize.
- **Recursive vs. Iterative**: Understand both paradigms and when one might be preferred (e.g., recursion for tree traversals, iteration potentially for stack overflow concerns).
- **Handle Mistakes**: If you realize you've made an error, acknowledge it and explain how you'd correct it. It shows self-awareness.
- **Manage Time**: Be mindful of the interview duration, but don't rush blindly. Prioritize a working solution over a complex, unfinished optimized one if time is short.

## Handling Difficulties

- **If you're stuck**:
  - Verbalize _where_ you are stuck.
  - Go back to examples or simplify the problem.
  - Try a different data structure or approach.
  - Politely ask for a hint if needed, but show you've tried exploring options first.
- **If you don't know a concept**: Be honest, but try to reason about related concepts you _do_ know.

## Interviewer Hints & What They Might Mean

| Hint                         | Interpretation                        | Your Response                      |
| ---------------------------- | ------------------------------------- | ---------------------------------- |
| “Can it be faster?”          | Your solution works but isn't optimal | Apply BUD or BCR to improve        |
| “What happens with input X?” | Edge case you missed                  | Walk through logic again and adapt |
| “What’s the runtime?”        | They want performance analysis        | Explain time and space complexity  |
| Silence / raised eyebrow     | Potential bug or logic error          | Step through your code aloud       |

## Final Tips

- Think before coding: **clarity > speed**
- Always test with edge cases
- Narrate your thoughts — silence hurts you
- Start with brute force, **then improve**
- Practice pattern recognition and structure
