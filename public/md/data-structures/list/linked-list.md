# LinkedList

A **LinkedList** is a linear data structure where elements, called nodes, are stored in a sequence and each node points to the next one. Unlike arrays, the elements in a linked list are not stored in contiguous memory locations.

Each node typically contains:

- **Data**: The actual value or data stored.
- **Next**: A reference or pointer to the next node in the list.

Some variants, like **Doubly Linked Lists**, also have a **Previous** pointer for bidirectional traversal.

## Characteristics

- **Dynamic Size**: Can easily grow and shrink at runtime by adding or removing nodes.
- **Efficient Insertions/Deletions**: Especially at the beginning or middle, with O(1) complexity if the node reference is known.
- **Sequential Access**: Elements must be accessed sequentially from the head; no random access like arrays.
- Pointers to nodes take a lot of memory. On a 64 bit machines, pointers use 8 bytes, while on a 32bit machine they take 4 bytes.
- Sometimes adding a fake head is useful since we don’t have to worry if it exists or not on the different paths of our code. In the end we can just set the first element as the head.
- The last node always has a null reference to the next node.

> Be aware of garbage collection and memory leaks because of the pointers. We need to deallocate memory in some languages.

## Operations

| Operation                    | Time Complexity                  |
| ---------------------------- | -------------------------------- |
| Insertion (at head)          | O(1)                             |
| Insertion (at tail)          | O(n) (or O(1) with tail pointer) |
| Insertion (at index)         | O(n)                             |
| Deletion (by value or index) | O(n)                             |
| Search                       | O(n)                             |
| Access by index              | O(n)                             |

## Use Cases

- When frequent insertions and deletions are needed.
- When memory reallocation is a concern (e.g., dynamic environments).
- When you don’t need constant-time access by index.

## Downsides

- More memory due to storage of pointers.
- Linear access time.
- Cache-unfriendly due to non-contiguous storage.

## Java Example: Singly Linked List

Here’s a simple implementation of a singly linked list in Java:

```java
class LinkedList {
Node head;

    static class Node {
        int data;
        Node next;
        Node(int data) {
            this.data = data;
            next = null;
        }
    }

    // Insert at the end
    public void append(int data) {
        Node newNode = new Node(data);
        if (head == null) {
            head = newNode;
            return;
        }
        Node current = head;
        while (current.next != null)
            current = current.next;
        current.next = newNode;
    }

    // Print list
    public void printList() {
        Node current = head;
        while (current != null) {
            System.out.print(current.data + " -> ");
            current = current.next;
        }
        System.out.println("null");
    }

}
```

## Interview Tips

- Be prepared to reverse a linked list (iteratively and recursively).
- Understand how to detect cycles (e.g., Floyd’s Tortoise and Hare algorithm).
- Practice removing the N-th node from the end in one pass.
- Know how to merge two sorted linked lists.
- Be ready to implement variants: doubly linked, circular linked lists.

## Related Concepts

- **Doubly Linked List**: Each node has both `next` and `previous` pointers.
- **Circular Linked List**: The tail node points back to the head.
- **Sentinel Node**: Dummy node used to simplify edge cases like insertion/deletion at head.

## Runner Technique

The **Runner Technique** (also called the **two-pointer technique**) involves using two pointers at different speeds to traverse the list. It is very useful in scenarios like:

- **Finding the middle of a linked list**
- **Detecting cycles**
- **Removing the N-th node from the end**
- **Palindrome checking in linked lists**

## Summary

A LinkedList provides flexibility in memory usage and efficient element insertion/deletion, at the cost of slower access times and more complex pointer handling. It’s a foundational data structure frequently asked about in technical interviews.
