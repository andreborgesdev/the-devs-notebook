## Arrays

Arrays are one of the most fundamental data structures in computer science. They are a collection of elements stored in contiguous memory locations, where each element is accessible via an index.

### Characteristics

- **Fixed size:** The size of an array is defined at the time of creation and cannot be changed.
- **Indexed access:** Elements can be accessed directly using their index (zero-based in most programming languages).
- **Homogeneous:** Typically, arrays store elements of the same type.
- **Contiguous memory:** All elements are stored in adjacent memory locations, which allows fast random access.

### Time Complexities

| Operation | Time Complexity                        |
| --------- | -------------------------------------- |
| Access    | O(1)                                   |
| Search    | O(n)                                   |
| Insertion | O(n) (worst case: beginning or middle) |
| Deletion  | O(n) (worst case: beginning or middle) |

- **Access:** Direct indexing means constant-time lookup: `arr[5]` takes O(1).
- **Search:** In an unsorted array, we may have to check every element → O(n).
- **Insertion/Deletion:** These require shifting elements when inserting/deleting from the middle or front → O(n). Inserting at the end can be O(1) if space allows.

### Use Cases

- Storing fixed-size collections of elements.
- Lookup tables and buffers.
- Basis for more complex data structures (matrices, heaps, dynamic arrays, etc.).

### Limitations

- Size is fixed upon declaration (unless using a dynamic array like a list/vector).
- Inefficient insertions and deletions (especially in the middle or front).
- Cannot easily grow or shrink in size without allocating new memory.

### Alternatives

- **Linked lists:** More efficient for frequent insertions/deletions.
- **Dynamic arrays (e.g., Python lists, JavaScript arrays):** Allow resizing but have amortized time complexity considerations.
- **Hash tables:** Allow for faster average-case search, insert, and delete operations.

### Common Interview Scenarios

- **Find the missing number** in a range of 1 to n using sum or XOR.
- **Reverse an array** in place.
- **Rotate an array** (e.g., by k steps, using O(1) extra space).
- **Check for duplicates** using a set or sorting.
- **Move all zeros to the end** while maintaining the relative order of the other elements.

These are often asked in early-round interviews and help reinforce common manipulations and pitfalls (like off-by-one indexing errors or in-place modifications).

### Quick Tips

- Use a **sliding window** technique for subarray problems involving sums or averages.
- Use **two pointers** for problems involving sorted arrays or in-place operations.
- Know the **difference between shallow vs deep copies** when cloning arrays (important in languages like Python or JavaScript).
- In low-level languages (like C/C++), be careful with **buffer overflows** and manual memory management.

### Example

```java showLineNumbers
public class ArrayExample {
    public static void main(String[] args) {
        // Declare and initialize an array
        int[] arr = {10, 20, 30, 40, 50};

        // Access an element
        System.out.println("First element: " + arr[0]);

        // Update an element
        arr[2] = 99;
        System.out.println("Updated third element: " + arr[2]);

        // Iterate over the array
        System.out.print("All elements: ");
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i] + " ");
        }

        // Find maximum value
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }

        System.out.println("Max value: " + max);
    }
}
```

## Advantages

- They provide easy access to all the elements at once and the order of accessing any element does not matter.
- You do not need to worry about the allocation of memory when creating an array, as all elements are allocated memory in contiguous memory locations of the array. There isn't any chance of extra memory being allocated if there is an array. This avoids the issue of overflow or shortage of memory.
- Other data structures like linked lists, stacks, queues, trees, and graphs can be accomplished using arrays. Also, they can be used to carry out various CPU Scheduling techniques.
- There is help in code maximization. By writing a small piece of code, we can store a lot of values in a single array.
- It takes a constant amount of time to access an element of an array, which is called the O(1) time complexity.
- Two-dimensional arrays are used to represent matrices.
- Array indices start with ‘0’ unlike other data structures where they start with ‘1’.
- There is no limit on how many times you can use an array.
- A program can easily create new subarrays within an existing array.
- If there is a requirement to change the value stored at a specific position then it is possible without changing the entire contents of the array.
- Finding maximum and minimum values, as well as searching and sorting techniques, are easy to use in an array.

## Disadvantages

- An array has a fixed size which means you cannot add/delete elements after creation. You also cannot resize them dynamically.
- Unlike lists in Python, cannot store values of different data types in a single array.
- In the case of a large number of records, it may take more space than required for storing the same information.
- When inserting into an array, the insertion process requires moving each element from its original location to the next available slot. The shift cost increases linearly with the length of the array.
- Deleting an item from an array involves copying every preceding element to fill up the gap left behind by the deleted element. Deleting items from an array is very expensive because of this reason.
- Another disadvantage of arrays is that they don't support random access. If you want to get some particular record from an array, you must know its exact index.
- In the case of C language, the compiler does not execute index bound checking on arrays. So, if we try to access an element using an index that doesn't lie in the range of indexes of an array, the compiler displays a run time error, rather than showing an index out of bounds error.
- Arrays have limited functionality compared to other data structures. They are good only for simple tasks. For complex problems, better solutions should be found.

## The problem with Arrays (for Java)

- They are not very easy to read or convenient to code against.
- It prints the object of the Array and not the array.
- They can be difficult to debug because we don’t have a human-readable toString() implementation, but we can create it.
- Arrays are not resizable in Java, they have a fixed size, a fixed-length array.
- There is no way of enforcing business domain level constraints within an array (for example, duplicates)
- They are a reasonable thing to have in the core language, but they're not flexible in our use cases. And if we were to use a raise directly in our business code, we would spend a lot of time working on adding custom functionality, like adding or fixing the case of the duplicate, that we can have out of the box with Collections.
