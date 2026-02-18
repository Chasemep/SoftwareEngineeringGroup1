/*
 * Name: Daniel Briseño
 * Professor: Dr. Dai
 * Course: CS416 - Software Engineering
 * Date: February 17, 2026
 *
 * File: MergeSort.java
 * Description:
 *   Implements the Merge Sort algorithm for sorting an integer array in
 *   ascending order using a divide-and-conquer approach.
 *
 * How Merge Sort Works (high level):
 *   - Divide: Split the array into two halves until each subarray has 1 element.
 *   - Conquer: Merge pairs of sorted subarrays back together in sorted order.
 *
 * Key idea:
 *   - A single-element array is already sorted.
 *   - The merge step combines two sorted halves into one sorted array.
 *
 * Time Complexity:
 *   - O(n log n) in worst/average/best case.
 * Space Complexity:
 *   - O(n) extra space for temporary arrays during merging.
 */

import java.util.Arrays;

public class MergeSort {

    /*
     * mergeSort
     * Sorts the array in ascending order using Merge Sort.
     *
     * Algorithm detail:
     * 1) Recursively split the array into left and right halves.
     * 2) Sort each half.
     * 3) Merge the two sorted halves into one sorted array.
     */
    public static void mergeSort(int[] arr) {
        if (arr == null || arr.length <= 1) return;
        mergeSort(arr, 0, arr.length - 1);
    }

    // Recursive helper: sorts arr[left..right]
    private static void mergeSort(int[] arr, int left, int right) {
        // Base case: 0 or 1 element => already sorted
        if (left >= right) return;

        int mid = left + (right - left) / 2;

        // Sort left half
        mergeSort(arr, left, mid);

        // Sort right half
        mergeSort(arr, mid + 1, right);

        // Merge sorted halves
        merge(arr, left, mid, right);
    }

    /*
     * merge
     * Merges two sorted subarrays into one sorted region.
     *
     * Left sorted subarray:  arr[left..mid]
     * Right sorted subarray: arr[mid+1..right]
     *
     * Steps:
     * - Copy both halves into temporary arrays.
     * - Repeatedly take the smaller front element from leftTemp/rightTemp
     *   and write it back into arr.
     * - Copy any remaining elements (only one side can have leftovers).
     */
    private static void merge(int[] arr, int left, int mid, int right) {
        int leftSize = mid - left + 1;
        int rightSize = right - mid;

        // Temporary arrays for the two halves
        int[] leftTemp = new int[leftSize];
        int[] rightTemp = new int[rightSize];

        // Copy data into temp arrays
        for (int i = 0; i < leftSize; i++) {
            leftTemp[i] = arr[left + i];
        }
        for (int j = 0; j < rightSize; j++) {
            rightTemp[j] = arr[mid + 1 + j];
        }

        // Merge temp arrays back into arr[left..right]
        int i = 0;      // index for leftTemp
        int j = 0;      // index for rightTemp
        int k = left;   // index for original array

        while (i < leftSize && j < rightSize) {
            if (leftTemp[i] <= rightTemp[j]) {
                arr[k] = leftTemp[i];
                i++;
            } else {
                arr[k] = rightTemp[j];
                j++;
            }
            k++;
        }

        // Copy remaining elements from leftTemp (if any)
        while (i < leftSize) {
            arr[k] = leftTemp[i];
            i++;
            k++;
        }

        // Copy remaining elements from rightTemp (if any)
        while (j < rightSize) {
            arr[k] = rightTemp[j];
            j++;
            k++;
        }
    }

    public static void main(String[] args) {

        // Sample input
        int[] input = {38, 27, 43, 3, 9, 82, 10};

        // Display original array
        System.out.println("Sample Input:  " + Arrays.toString(input));

        // Sort using Merge Sort
        mergeSort(input);

        // Display sorted result
        System.out.println("Sorted Output: " + Arrays.toString(input));
    }
}
