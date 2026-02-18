/*
 * Name: Daniel Briseño
 * Professor: Dr. Dai
 * Course: CS416 - Software Engineering
 * Date: February 17, 2026
 *
 * File: InsertionSort.java
 * Description:
 *   Implements the Insertion Sort algorithm for sorting an integer array in
 *   ascending order.
 *
 * How Insertion Sort Works (high level):
 *   - Build a sorted region on the left side of the array (starts with the first element).
 *   - For each next element (the "key") from left to right:
 *       1) Compare the key with elements in the sorted region (moving left).
 *       2) Shift any elements that are greater than the key one position to the right.
 *       3) Insert the key into its correct position.
 *
 * Time Complexity:
 *   - Worst/Average: O(n^2)
 *   - Best (already sorted): O(n)
 * Space Complexity:
 *   - O(1) extra space (in-place sort).
 */

import java.util.Arrays;

public class InsertionSort {

    /*
     * insertionSort
     * Sorts the array in ascending order using Insertion Sort.
     *
     * Algorithm detail:
     * For each index i from 1 to n-1:
     *   1) Store arr[i] as the key.
     *   2) Compare key with elements to the left (j = i-1 down to 0).
     *   3) While arr[j] > key:
     *        - shift arr[j] to the right (arr[j+1] = arr[j])
     *        - move j left
     *   4) Place key into the “hole” at arr[j+1].
     *
     * After each outer loop pass, the subarray arr[0..i] is sorted.
     */
    public static void insertionSort(int[] arr) {
        int n = arr.length;

        // Start from the second element since a single element is already "sorted"
        for (int i = 1; i < n; i++) {

            // The element we want to insert into the sorted left side
            int key = arr[i];

            // Start comparing from the element just left of i
            int j = i - 1;

            // Shift elements of the sorted portion that are greater than key to the right
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j]; // shift right
                j--;
            }

            // Insert key into the correct position
            arr[j + 1] = key;
        }
    }

    public static void main(String[] args) {

        // Sample input
        int[] input = {12, 11, 13, 5, 6};

        // Display original array
        System.out.println("Sample Input:  " + Arrays.toString(input));

        // Sort using Insertion Sort
        insertionSort(input);

        // Display sorted result
        System.out.println("Sorted Output: " + Arrays.toString(input));
    }
}
