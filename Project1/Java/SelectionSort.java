/*
 * Name: Daniel Briseño
 * Professor: Dr. Dai
 * Course: CS416 - Software Engineering
 * Date: February 17, 2026
 *
 * File: SelectionSort.java
 * Description:
 *   Implements the Selection Sort algorithm for sorting an integer array in
 *   ascending order.
 *
 * How Selection Sort Works (high level):
 *   - Split the array into two regions:
 *       1) Left side: sorted (initially empty)
 *       2) Right side: unsorted (initially the whole array)
 *   - Repeatedly find the smallest value in the unsorted region,
 *     then swap it into the next position in the sorted region.
 *
 * Time Complexity:
 *   - O(n^2) comparisons in the worst/average/best case.
 * Space Complexity:
 *   - O(1) extra space (in-place sort).
 */

import java.util.Arrays;

public class SelectionSort {

    /*
     * selectionSort
     * Sorts the array in ascending order using Selection Sort.
     *
     * Algorithm detail:
     * For each index i from 0 to n-2:
     *   1) Assume the smallest element is at i (minIndex = i).
     *   2) Scan the rest of the array from i+1 to n-1:
     *        - if arr[j] < arr[minIndex], update minIndex = j
     *   3) Swap arr[i] with arr[minIndex] (put the smallest found at position i)
     *
     * After each outer loop pass, the subarray arr[0..i] is sorted.
     */
    public static void selectionSort(int[] arr) {
        int n = arr.length;

        // Outer loop moves the boundary of the sorted portion
        for (int i = 0; i < n - 1; i++) {

            // Assume the first element in the unsorted portion is the minimum
            int minIndex = i;

            // Find the index of the smallest element in the remaining unsorted portion
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j; // Update minIndex when a smaller element is found
                }
            }

            // Swap only if we found a new minimum different from i
            if (minIndex != i) {
                int temp = arr[i];
                arr[i] = arr[minIndex];
                arr[minIndex] = temp;
            }
        }
    }

    public static void main(String[] args) {

        // Sample input
        int[] input = {64, 25, 12, 22, 11};

        // Display original array
        System.out.println("Sample Input:  " + Arrays.toString(input));

        // Sort using Selection Sort
        selectionSort(input);

        // Display sorted result
        System.out.println("Sorted Output: " + Arrays.toString(input));
    }
}
