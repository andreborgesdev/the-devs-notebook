# Bubble Sort

Runtime: O(N²) average and worst case. Memory O(1)

In bubble sort, we start at the beginning of the array and swap the first two elements if the first is greater than the second. Then, we go to the next pair, and so on, continuously making sweeps of the array until it is sorted. In doing so, the smaller items slowly “bubble” up to the beginning of the list

![bubble-sort-example](./images/bubble-sort-example.png)

![https://res.cloudinary.com/practicaldev/image/fetch/s--9WGwov3j--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/3m00apvur6vmr44yjq1a.gif](https://res.cloudinary.com/practicaldev/image/fetch/s--9WGwov3j--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/3m00apvur6vmr44yjq1a.gif)

![https://res.cloudinary.com/practicaldev/image/fetch/s--C0CI1OCj--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/ubhywp9xh8zk6on4caql.gif](https://res.cloudinary.com/practicaldev/image/fetch/s--C0CI1OCj--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/ubhywp9xh8zk6on4caql.gif)

```java
class BubbleSort
{
	// perform the bubble sort
  static void bubbleSort(int array[]) {
    int size = array.length;
    
    // loop to access each array element
    for (int i = 0; i < size - 1; i++) {
    
      // loop to compare array elements
      for (int j = 0; j < size - i - 1; j++)

        // compare two adjacent elements
        // change > to < to sort in descending order
        if (array[j] > array[j + 1]) {

          // swapping occurs if elements
          // are not in the intended order
          int temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
	  }

    // Driver method to test above
    public static void main(String args[])
    {
        BubbleSort ob = new BubbleSort();
        int arr[] = {64, 34, 25, 12, 22, 11, 90};
        ob.bubbleSort(arr);
        System.out.println("Sorted array");
    }
}
```

![https://res.cloudinary.com/practicaldev/image/fetch/s--AIAlZIhq--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/euz62qdpc74m9w4gcg09.png](https://res.cloudinary.com/practicaldev/image/fetch/s--AIAlZIhq--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/euz62qdpc74m9w4gcg09.png)