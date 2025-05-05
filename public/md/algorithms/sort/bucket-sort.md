# Bucket Sort

**Bucket Sort** is a **distributed sorting algorithm** that distributes elements into several **buckets** (small arrays). Each bucket is then sorted individually using another sorting algorithm (usually **insertion sort** for small arrays). Finally, the contents of all buckets are concatenated to form the sorted output.

## How It Works

1. Divide the input data into a number of **buckets**.
2. Distribute the elements into their respective buckets based on value ranges.
3. Sort each bucket individually (often with insertion sort).
4. Concatenate all buckets to produce the final sorted array.

## Time Complexity

| Case    | Complexity                                                          |
| ------- | ------------------------------------------------------------------- |
| Best    | O(n + k)                                                            |
| Average | O(n + k)                                                            |
| Worst   | O(n²) (if all elements end up in one bucket and a bad sort is used) |

`n` = number of elements  
`k` = number of buckets

| Space Complexity | O(n + k) |
| ---------------- | -------- |

## Visualization

![Bucket Sort Diagram](https://res.cloudinary.com/practicaldev/image/fetch/s--OCRlBcCM--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/m10o9xkwmpyllvarra5g.png)

## Java Example

```java showLineNumbers
import java.util.*;

public class BucketSort {

    public static void bucketSort(float[] arr) {
        int n = arr.length;
        if (n <= 0) return;

        // Create empty buckets
        @SuppressWarnings("unchecked")
        List<Float>[] buckets = new List[n];

        for (int i = 0; i < n; i++) {
            buckets[i] = new ArrayList<>();
        }

        // Distribute elements into buckets
        for (float num : arr) {
            int index = (int)(num * n);  // Assuming input is between 0 and 1
            buckets[index].add(num);
        }

        // Sort individual buckets
        for (List<Float> bucket : buckets) {
            Collections.sort(bucket);
        }

        // Concatenate all buckets into original array
        int idx = 0;
        for (List<Float> bucket : buckets) {
            for (float num : bucket) {
                arr[idx++] = num;
            }
        }
    }

    public static void main(String[] args) {
        float[] arr = {0.897f, 0.565f, 0.656f, 0.1234f, 0.665f, 0.3434f};
        bucketSort(arr);
        System.out.println("Sorted array:");
        for (float num : arr) {
            System.out.print(num + " ");
        }
    }

}
```

## Advantages

- **Efficient** when input is uniformly distributed over a range.
- **Simple** to implement for small datasets.
- Can leverage faster sorts like **insertion sort** on small buckets.

## Disadvantages

- **Poor performance** if data is unevenly distributed.
- Requires choosing an appropriate number of buckets.
- Not suitable for **large, unsorted, or highly skewed datasets** without careful tuning.

## Interview Tips

- Be ready to explain how to **choose the number of buckets** and how bucket distribution works.
- Understand why **insertion sort** is typically used on small buckets.
- Mention that **bucket sort is not comparison-based**, making it theoretically faster than O(n log n) sorts for specific data types.
- For non-uniform data or unknown distributions, other algorithms like **merge sort** or **quick sort** may perform better.

## Summary

**Bucket Sort** distributes data into buckets, sorts each bucket individually, and concatenates the results.  
While not always practical, it’s highly efficient for **uniformly distributed data** and useful for specialized scenarios like **floating-point sorting** or **range sorting problems**.
