# Activity Selection Problem

The **Activity Selection Problem** is a classic greedy algorithm that selects the maximum number of activities that can be performed by a single person, given their start and finish times.

## Problem Statement

Given `n` activities with their start and finish times, select the maximum number of activities that can be performed by a single person, assuming that a person can only work on a single activity at a time.

**Input**: Arrays of start times and finish times
**Output**: Maximum number of non-overlapping activities

## Key Concepts

- **Greedy Choice**: Always select the activity that finishes earliest
- **Optimal Substructure**: Optimal solution contains optimal solutions to subproblems
- **Greedy Property**: Local optimal choice leads to global optimal solution

## Time and Space Complexity

| Operation           | Time Complexity | Space Complexity |
| ------------------- | --------------- | ---------------- |
| Sort by finish time | O(n log n)      | O(1)             |
| Activity selection  | O(n)            | O(1)             |
| **Overall**         | **O(n log n)**  | **O(1)**         |

## Algorithm Steps

1. **Sort activities** by their finish times in ascending order
2. **Select the first activity** (earliest finish time)
3. **For each remaining activity**:
   - If start time ≥ finish time of last selected activity
   - Select this activity
4. **Return** the count/list of selected activities

## Java Implementation

### Basic Implementation

```java showLineNumbers
import java.util.*;

public class ActivitySelection {

    static class Activity {
        int start;
        int finish;
        int index;

        Activity(int start, int finish, int index) {
            this.start = start;
            this.finish = finish;
            this.index = index;
        }
    }

    public static List<Integer> activitySelection(int[] start, int[] finish) {
        int n = start.length;
        List<Activity> activities = new ArrayList<>();

        // Create activity objects
        for (int i = 0; i < n; i++) {
            activities.add(new Activity(start[i], finish[i], i));
        }

        // Sort by finish time
        activities.sort(Comparator.comparingInt(a -> a.finish));

        List<Integer> selected = new ArrayList<>();
        selected.add(activities.get(0).index);

        int lastFinishTime = activities.get(0).finish;

        // Select compatible activities
        for (int i = 1; i < n; i++) {
            if (activities.get(i).start >= lastFinishTime) {
                selected.add(activities.get(i).index);
                lastFinishTime = activities.get(i).finish;
            }
        }

        return selected;
    }

    public static void demonstrateActivitySelection() {
        int[] start = {1, 3, 0, 5, 8, 5};
        int[] finish = {2, 4, 6, 7, 9, 9};

        System.out.println("Activities (start, finish):");
        for (int i = 0; i < start.length; i++) {
            System.out.printf("Activity %d: (%d, %d)\n", i, start[i], finish[i]);
        }

        List<Integer> selected = activitySelection(start, finish);

        System.out.println("\nSelected activities:");
        for (int index : selected) {
            System.out.printf("Activity %d: (%d, %d)\n",
                index, start[index], finish[index]);
        }
        System.out.printf("Maximum activities: %d\n", selected.size());
    }
}
```

### Optimized Implementation (Pre-sorted)

```java showLineNumbers
public class ActivitySelectionOptimized {

    public static int maxActivities(int[] start, int[] finish) {
        // Assumes activities are already sorted by finish time
        int n = start.length;
        int count = 1; // First activity is always selected
        int lastFinish = finish[0];

        for (int i = 1; i < n; i++) {
            if (start[i] >= lastFinish) {
                count++;
                lastFinish = finish[i];
            }
        }

        return count;
    }

    public static List<Integer> getSelectedActivities(int[] start, int[] finish) {
        int n = start.length;
        List<Integer> selected = new ArrayList<>();
        selected.add(0); // First activity

        int lastFinish = finish[0];

        for (int i = 1; i < n; i++) {
            if (start[i] >= lastFinish) {
                selected.add(i);
                lastFinish = finish[i];
            }
        }

        return selected;
    }
}
```

## Proof of Correctness

### Greedy Choice Property

- **Claim**: Choosing the activity with earliest finish time is always safe
- **Proof**: If there's an optimal solution not including the earliest-finishing activity, we can replace any activity in that solution with the earliest-finishing one without reducing the solution size

### Optimal Substructure

- After selecting the first activity, the remaining problem is selecting maximum activities from the remaining compatible activities
- The optimal solution for the original problem contains optimal solutions for subproblems

## Variations and Extensions

### 1. Weighted Activity Selection

```java showLineNumbers
public class WeightedActivitySelection {

    static class WeightedActivity {
        int start, finish, weight;

        WeightedActivity(int start, int finish, int weight) {
            this.start = start;
            this.finish = finish;
            this.weight = weight;
        }
    }

    public static int maxWeight(WeightedActivity[] activities) {
        int n = activities.length;
        // Sort by finish time
        Arrays.sort(activities, Comparator.comparingInt(a -> a.finish));

        int[] dp = new int[n];
        dp[0] = activities[0].weight;

        for (int i = 1; i < n; i++) {
            // Include current activity
            int include = activities[i].weight;
            int latest = findLatestNonConflicting(activities, i);
            if (latest != -1) {
                include += dp[latest];
            }

            // Exclude current activity
            int exclude = dp[i - 1];

            dp[i] = Math.max(include, exclude);
        }

        return dp[n - 1];
    }

    private static int findLatestNonConflicting(WeightedActivity[] activities, int i) {
        for (int j = i - 1; j >= 0; j--) {
            if (activities[j].finish <= activities[i].start) {
                return j;
            }
        }
        return -1;
    }
}
```

### 2. Activity Selection with Multiple Resources

```java showLineNumbers
public class MultiResourceActivitySelection {

    public static int maxActivitiesMultipleRooms(int[] start, int[] finish, int rooms) {
        int n = start.length;

        // Create activities with indices
        int[][] activities = new int[n][3]; // {start, finish, index}
        for (int i = 0; i < n; i++) {
            activities[i] = new int[]{start[i], finish[i], i};
        }

        // Sort by finish time
        Arrays.sort(activities, Comparator.comparingInt(a -> a[1]));

        // Priority queue to track room availability (min-heap by finish time)
        PriorityQueue<Integer> roomFinishTimes = new PriorityQueue<>();

        int selectedActivities = 0;

        for (int[] activity : activities) {
            int activityStart = activity[0];
            int activityFinish = activity[1];

            // Free up rooms that have finished
            while (!roomFinishTimes.isEmpty() &&
                   roomFinishTimes.peek() <= activityStart) {
                roomFinishTimes.poll();
            }

            // If room available, assign activity
            if (roomFinishTimes.size() < rooms) {
                roomFinishTimes.offer(activityFinish);
                selectedActivities++;
            }
        }

        return selectedActivities;
    }
}
```

## Real-world Applications

### Job Scheduling

- **CPU scheduling** with non-preemptive jobs
- **Meeting room booking** systems
- **Manufacturing process** optimization

### Resource Allocation

- **Conference room scheduling**
- **Equipment rental** optimization
- **Shift scheduling** for employees

### Transportation

- **Flight scheduling** for airlines
- **Vehicle routing** optimization
- **Parking space** allocation

## Comparison with Other Algorithms

| Algorithm                   | Time       | Space | Use Case                  | Optimal |
| --------------------------- | ---------- | ----- | ------------------------- | ------- |
| Activity Selection (Greedy) | O(n log n) | O(1)  | Max number of activities  | ✅ Yes  |
| Weighted Activity (DP)      | O(n²)      | O(n)  | Max weight of activities  | ✅ Yes  |
| Meeting Rooms II            | O(n log n) | O(n)  | Min rooms needed          | ✅ Yes  |
| Interval Scheduling         | O(n log n) | O(1)  | Non-overlapping intervals | ✅ Yes  |

## Interview Tips

### Common Questions

1. **"Why does greedy work here?"**

   - Earliest finish time maximizes remaining time for future activities

2. **"What if activities have weights?"**

   - Need dynamic programming instead of greedy

3. **"How to handle multiple resources?"**
   - Use priority queue to track resource availability

### Implementation Notes

- **Always sort by finish time** for standard activity selection
- **Handle edge cases**: empty input, single activity
- **Consider space optimization** for large inputs

### Quick Decision Framework

- **Unweighted activities** → Greedy (earliest finish)
- **Weighted activities** → Dynamic Programming
- **Multiple rooms/resources** → Priority Queue + Greedy
- **Maximum overlap** → Sweep line algorithm

## Practice Problems

### Essential LeetCode Problems

1. **Meeting Rooms** (Easy) - Basic activity selection
2. **Meeting Rooms II** (Medium) - Multiple resources
3. **Non-overlapping Intervals** (Medium) - Minimum removals
4. **Minimum Number of Arrows** (Medium) - Interval coverage

### Advanced Applications

- **Job scheduling with deadlines**
- **Fractional knapsack** variants
- **Interval graph coloring**
- **Bandwidth allocation** problems

### Real-world Systems

- **Calendar scheduling** applications
- **Resource management** systems
- **Manufacturing optimization**
- **Cloud computing** resource allocation

## Summary

The **Activity Selection Problem** demonstrates the power of greedy algorithms when the greedy choice property holds. The key insight is that selecting activities with earliest finish times maximizes the remaining time for subsequent selections, leading to the optimal solution. This principle extends to many real-world scheduling and resource allocation problems.
