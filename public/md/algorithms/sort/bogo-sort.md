# Bogo Sort

**Bogo Sort** (also called **stupid sort** or **monkey sort**) is a **highly inefficient sorting algorithm** based on the principle of **generating random permutations** of the input until the list happens to be sorted.

## How It Works

1. Check if the list is sorted.
2. If it’s not, **randomly shuffle** the list.
3. Repeat until the list is sorted.

This algorithm relies entirely on **luck** — stumbling upon the sorted order by chance.

## Time Complexity

| Case    | Complexity                   |
| ------- | ---------------------------- |
| Best    | O(n) (if already sorted)     |
| Average | O((n + 1)!)                  |
| Worst   | Unbounded (may never finish) |

**Why?**  
There are `n!` possible permutations of a list of `n` items. Bogo Sort will randomly stumble upon one of them — the sorted one — eventually. For anything beyond a few elements, this is practically impossible in reasonable time.

## Space Complexity

| Space | O(1) |
| ----- | ---- |

## Java Example

```java showLineNumbers
import java.util.*;

public class BogoSort {
public static <T extends Comparable<? super T>> void bogoSort(List<T> list) {
Random rand = new Random();
while (!isSorted(list)) {
Collections.shuffle(list, rand);
}
}

    private static <T extends Comparable<? super T>> boolean isSorted(List<T> list) {
        for (int i = 1; i < list.size(); i++) {
            if (list.get(i - 1).compareTo(list.get(i)) > 0) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        List<Integer> data = new ArrayList<>(Arrays.asList(3, 2, 5, 1, 4));
        bogoSort(data);
        System.out.println("Sorted: " + data);
    }

}
```

## When (Not) to Use Bogo Sort

| Usage                  | Recommendation                                   |
| ---------------------- | ------------------------------------------------ |
| Practical applications | ❌ Never                                         |
| Education              | ✅ Good for illustrating bad algorithm design    |
| Humor                  | ✅ Often used as a joke in algorithm discussions |

## Summary

- **Bogo Sort** is a humorous example of what **not** to do when sorting.
- Demonstrates the importance of algorithmic efficiency.
- Useful for understanding algorithm complexity and randomness, but not for any real-world task.
