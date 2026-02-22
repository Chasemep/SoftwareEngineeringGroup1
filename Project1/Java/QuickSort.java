/*
 * Name: Daniel Briseño
 * Professor: Dr. Dai
 * Course: CS416 - Software Engineering
 * Date: February 17, 2026
 *
 * File: QuickSort.java
 * Description:
 *   Implements the Quick Sort algorithm for sorting an integer array in
 *   ascending order using a divide-and-conquer approach.
 *
 * How Quick Sort Works (high level):
 *   - Choose a pivot element (this implementation uses the last element).
 *   - Partition the array so that:
 *       * elements <= pivot are moved to the left side
 *       * elements >  pivot are moved to the right side
 *   - The pivot ends up in its final sorted position.
 *   - Recursively quicksort the left and right partitions.
 *
 * Time Complexity:
 *   - Average: O(n log n)
 *   - Worst case: O(n^2) (can happen with bad pivot choices, e.g., already sorted input)
 * Space Complexity:
 *   - O(log n) average recursion stack (O(n) worst case recursion depth)
 */

import java.util.Arrays;

public class QuickSort {

    /*
     * quickSort
     * Public wrapper that sorts the entire array in ascending order using Quick Sort.
     */
    public static void quickSort(int[] arr) {
        if (arr == null || arr.length <= 1) return;
        quickSort(arr, 0, arr.length - 1);
    }

    /*
     * quickSort (recursive)
     * Sorts the subarray arr[low..high].
     *
     * Steps:
     * 1) Partition the subarray around a pivot, returning the pivot's final index p.
     * 2) Recursively sort the left side:  arr[low..p-1]
     * 3) Recursively sort the right side: arr[p+1..high]
     */
    private static void quickSort(int[] arr, int low, int high) {
        // Base case: 0 or 1 element is already sorted
        if (low >= high) return;

        int p = partition(arr, low, high);

        quickSort(arr, low, p - 1);
        quickSort(arr, p + 1, high);
    }

    /*
     * partition (Lomuto partition scheme)
     *
     * Pivot choice:
     *   - Uses arr[high] as the pivot (last element).
     *
     * Goal:
     *   - Rearrange elements so that all values <= pivot come before it,
     *     and all values > pivot come after it.
     *
     * How it works:
     *   - i tracks the "end" of the <= pivot region.
     *   - j scans through the array.
     *   - When arr[j] <= pivot, we expand the <= region by swapping arr[i] and arr[j].
     *   - Finally, we swap the pivot into position i (its correct sorted place).
     *
     * Returns:
     *   - The pivot's final index.
     */
    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];

        int i = low; // i is the next position to place an element <= pivot

        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                // Swap arr[i] and arr[j]
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;

                i++;
            }
        }

        // Place pivot in its final position by swapping arr[i] and arr[high]
        int temp = arr[i];
        arr[i] = arr[high];
        arr[high] = temp;

        return i;
    }

    public static void main(String[] args) {

        // Sample input
        int[] input = {10, 7, 8, 9, 1, 5};

        // Display original array
        System.out.println("Sample Input:  " + Arrays.toString(input));

        // Sort using Quick Sort
        quickSort(input);

        // Display sorted result
        System.out.println("Sorted Output: " + Arrays.toString(input));
    }
}
