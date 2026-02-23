/*
 * Name: Daniel Briseno
 * Professor: Dr. Dai
 * Course: CS416 - Software Engineering
 * Date: Feb 13, 2026
 *
 * File: BubbleSort.java
 * Description:
 *   Implements the Bubble Sort algorithm for sorting an integer array in ascending order.
 */

import java.util.Arrays;

public class BubbleSort {

    /**
     * Sorts the given array in ascending order using Bubble Sort.
     *
     * Bubble Sort works by repeatedly stepping through the list, comparing adjacent elements,
     * and swapping them if they are in the wrong order. Each pass "bubbles" the largest
     * remaining value to the end of the array.
     *
     * Time Complexity:
     *   - Worst/Average: O(n^2)
     *   - Best (already sorted with optimization): O(n)
     * Space Complexity: O(1) (in-place)
     *
     * @param arr the array to be sorted (modified in-place)
     */
    public static void bubbleSort(int[] arr) {
        if (arr == null || arr.length <= 1) {
            return; // Nothing to sort
        }

        int n = arr.length;

        // Outer loop: each pass places the next-largest element at the end.
        for (int i = 0; i < n - 1; i++) {

            // Optimization: if no swaps happen in a pass, the array is already sorted.
            boolean swapped = false;

            // Inner loop: compare adjacent elements up to the last unsorted index (n - 1 - i).
            for (int j = 0; j < n - 1 - i; j++) {

                // If the current element is greater than the next, swap them.
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;

                    swapped = true;
                }
            }

            // If we didn't swap anything, we can stop early.
            if (!swapped) {
                break;
            }
        }
    }

    /**
     * Example driver to demonstrate Bubble Sort.
     * You can remove or modify this main method depending on assignment requirements.
     */
    public static void main(String[] args) {
        int[] data = {7, 2, 9, 1, 5, 3};

        System.out.println("Sample Input:  " + Arrays.toString(data));

        // Sort using Bubble Sort
        bubbleSort(data);

        // Display sorted result
        System.out.println("Sorted Output: " + Arrays.toString(data));
    }
}


