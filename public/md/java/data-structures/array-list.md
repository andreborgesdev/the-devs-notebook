## ArrayList

When you create an `ArrayList` with the default constructor, i.e. invoke `new ArrayList()`
, `elementData`  is set to point to a singleton shared zero-size array (`elementData` could as well be set to null, but a singleton array provides some minor implementation advantages). Once you add the first element to the list, a real, unique `elementData` array is created, and the provided object is inserted into it. To avoid resizing the array every time a new element is added, it is created with length 10 ("default capacity"). Here comes a catch: if you never add more elements to this `ArrayList` , 9 out of 10 slots in the `elementData` array will stay empty. And even if you clear this list later, the internal array will not shrink.

![https://dz2cdn1.dzone.com/storage/temp/9271695-arraylist.png](https://dz2cdn1.dzone.com/storage/temp/9271695-arraylist.png)
