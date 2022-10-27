# Selection Sort

Runtime: O(N²) average and worst case. Memory: O(1)

We have 2 lists, one unsorted and the other one sorted. We go through the unsorted list and for each iteration, we find the smallest number and move it into the sorted list. We repeat this process until the unsorted list is empty.

Selection sort is the child’s algorithm: simple, but inefficient. Find the smallest element using a linear scan and move it to the front (swapping it with the front element). Then, find the second smallest and move it, and doing a linear scan. Continue doing this until all the elements are in place.

```
arr[] = 64 25 12 22 11

// Find the minimum element in arr[0...4]
// and place it at beginning
1125 12 22 64

// Find the minimum element in arr[1...4]
// and place it at beginning of arr[1...4]
111225 22 64

// Find the minimum element in arr[2...4]
// and place it at beginning of arr[2...4]
11 122225 64

// Find the minimum element in arr[3...4]
// and place it at beginning of arr[3...4]
11 12 222564
```

![https://res.cloudinary.com/practicaldev/image/fetch/s--musoV4Rk--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/vweh1mcmiap8q3onqxz8.gif](https://res.cloudinary.com/practicaldev/image/fetch/s--musoV4Rk--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/vweh1mcmiap8q3onqxz8.gif)

![https://res.cloudinary.com/practicaldev/image/fetch/s--wJDCsONw--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/mbzjewb2l897eiidkr14.gif](https://res.cloudinary.com/practicaldev/image/fetch/s--wJDCsONw--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/mbzjewb2l897eiidkr14.gif)

![https://media.geeksforgeeks.org/wp-content/cdn-uploads/Selection-sort-flowchart.jpg](https://media.geeksforgeeks.org/wp-content/cdn-uploads/Selection-sort-flowchart.jpg)

```java
import java.util.Arrays;

class SelectionSort {
  void selectionSort(int array[]) {
    int size = array.length;

    for (int step = 0; step < size - 1; step++) {
      int min_idx = step;

      for (int i = step + 1; i < size; i++) {

        // To sort in descending order, change > to < in this line.
        // Select the minimum element in each loop.
        if (array[i] < array[min_idx]) {
          min_idx = i;
        }
      }

      // put min at the correct position
      int temp = array[step];
      array[step] = array[min_idx];
      array[min_idx] = temp;
    }
  }

  // driver code
  public static void main(String args[]) {
    int[] data = { 20, 12, 10, 15, 2 };
    SelectionSort ss = new SelectionSort();
    ss.selectionSort(data);
    System.out.println("Sorted Array in Ascending Order: ");
    System.out.println(Arrays.toString(data));
  }
}
```

![https://res.cloudinary.com/practicaldev/image/fetch/s--992IFucj--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/43gibzc1hne0ie73cmp1.png](https://res.cloudinary.com/practicaldev/image/fetch/s--992IFucj--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/43gibzc1hne0ie73cmp1.png)