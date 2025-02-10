# Quick Sort

Runtime: O(N log N) average, O(N²) worst case. Memory: O(log N)

Relies on recursion. Uses divide and conquer. Uses a pivot and 2 lists, one with numbers less than the pivot and one greater than the pivot. Quick sort is a bit faster than merge sort to sort numbers. Even though it has a bigger big o time complexity.

Quicksort is a sorting algorithm based on the **divide and conquer approach** where

1. An array is divided into subarrays by selecting a **pivot element** (element selected from the array).While dividing the array, the pivot element should be positioned in such a way that elements less than pivot are kept on the left side and elements greater than pivot are on the right side of the pivot.
2. The left and right subarrays are also divided using the same approach. This process continues until each subarray contains a single element.
3. At this point, elements are already sorted. Finally, elements are combined to form a sorted array.

In quick sort, we pick a random element and partition the array, such that all numbers that are less than the partitioning come before all elements that are greater than it. The partitioning can be performed through a series of swaps.

If we repeatedly partition the array (and its sub-arrays) around an element, the array will eventually become sorted. However, as the partitioned element is not guaranteed to be the median (or anywhere near the median), our sorting could be very slow. This is the reason for the 0( n
2) worst case runtime.

![https://res.cloudinary.com/practicaldev/image/fetch/s--LokyoN4O--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/9sl7t3z56s02oy4smbzm.gif](https://res.cloudinary.com/practicaldev/image/fetch/s--LokyoN4O--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/9sl7t3z56s02oy4smbzm.gif)

![https://res.cloudinary.com/practicaldev/image/fetch/s--5nmg3LKx--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/vo2ltivrpucxtoamvdeb.gif](https://res.cloudinary.com/practicaldev/image/fetch/s--5nmg3LKx--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/vo2ltivrpucxtoamvdeb.gif)

![https://www.geeksforgeeks.org/wp-content/uploads/gq/2014/01/QuickSort2.png](https://www.geeksforgeeks.org/wp-content/uploads/gq/2014/01/QuickSort2.png)

```java
void quickSort(int[] arr, int left, int right) {
 int index = partition(arr, left, right);

 if (left< index - 1) { II Sort left half
  quickSort(arr, left, index - 1);
 }
 if (index< right) { II Sort right half
  quickSort(arr, index, right);
 }
}

int partition(int[] arr, int left, int right) {
 int pivot = arr[(left + right) I 2]; // Pick pivot point

 while (left<= right) {
  // Find element on left that should be on right
  while (arr[left] < pivot) left++;

  // Find element on right that should be on left
  while (arr[right] > pivot) right--;

 // Swap elements, and move left and right indices
  if (left<= right) {
   swap(arr, left, right); II swaps elements
   left++;
   right--;
  }
 }

 return left;
}
```