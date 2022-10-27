# Merge Sort

Runtime: O(N log N) average and worst case. Memory: Depends but normally it is O(n)

O(N log N) because we have n number of merge steps multiplied by a log N number of splits of the original list

Space complexity → O(n) because we don’t keep plenty of arrays in parallel to track status, only one, even when we split/merge.

Works like binary search in the sense that it splits the problem into subproblems, but takes the process one step further because we’ll split the arrays until we have a single element arrays. Then, the elements start merging and comparing the values to order them. We use recursion a lot for this operations. We can return a new sorted list or sort the list passed (”sort in place”).

Merge sort is a divide and conquer algorithm. It divides the array in half, sorts each of those halves, and then merges them back together. Each of those halves have the same sorting algorithm applied to it. Eventually, you are merging just two single element arrays. It is the “merge” part that does all the heavy lifting.

The merge method operates by copying all the elements from the target array segment into a helper array, keeping track of where the start of the left and right halves should be (helperLeft and helperRight). We then iterate through helper, copying the smaller element from each half into the array. At the end, we copy any remaining elements into the target array.

![https://res.cloudinary.com/practicaldev/image/fetch/s--A-kq2byS--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/xokw1fxci67ttscu23vy.gif](https://res.cloudinary.com/practicaldev/image/fetch/s--A-kq2byS--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/xokw1fxci67ttscu23vy.gif)

![https://res.cloudinary.com/practicaldev/image/fetch/s--iTGTEOAp--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/bowug91fuof69su39fwd.png](https://res.cloudinary.com/practicaldev/image/fetch/s--iTGTEOAp--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/bowug91fuof69su39fwd.png)

```java
void mergesort(int[] array) {
	int[] helper = new int[array.length];
	mergesort(array, helper, 0, array.length - 1);
}

void mergesort(int[] array, int[] helper, int low, int high) {
	if (low < high) {
	int middle = (low + high) / 2;
	mergesort(array, helper, low, middle); // Sort left half
	mergesort(array, helper, middle + l, high); // Sort right half
	merge(array, helper, low, middle, high); // Merge them
}

void merge(int[] array, int[] helper, int low, int middle, int high) {
 /* Copy both halves into a helper array*/
 for (int i= low; i <= high; i++) {
 helper[i] = array[i];
 int helperleft = low;
 int helperRight =middle + l;
 int current = low;

 /* Iterate through helper array. Compare the left and right half, copying back
 * the smaller element from the two halves into the original array. */
 while (helperLeft <= middle && helperRight <= high) {
  if (helper[helperleft] <= helper[helperRight]) {
	 array[current] = helper[helperleft];
	 helperleft++;
  } else {//If right element is smaller than left element
   array[current] = helper[helperRight];
   helperRight++;
  }

 current++;
 }

 /* Copy the rest of the left side of the array into the target array*/
 int remaining = middle - helperleft;

 for (int i= 0; i <= remaining; i++) {
  array[current + i] = helper[helperleft + i];
 }
}
```

You may notice that only the remaining elements from the left half of the helper array are copied into the target array. Why not the right half? The right half doesn't need to be copied because it's already there. Consider, for example, an array like [ 1, 4, 5 11 2, 8, 9] (the" 11 "indicates the partition point). Prior to merging the two halves, both the helper array and the target array segment will end with [ 8, 9]. Once we copy over four elements (1, 4, 5, and 2) into the target array, the [ 8, 9] will still be in place in both arrays. There's no need to copy them over.

The space complexity of merge sort is 0( n) due to the auxiliary space used to merge parts of the array.