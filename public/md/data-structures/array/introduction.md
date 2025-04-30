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
