/*
 * Name: Abdelrahman Ahmed
 * Professor: Dr. Dai
 * Course: CS416 - Software Engineering
 * Date: Feb 17, 2026
 *
 * File: SelectionSort.go
 * Description:
 *   Implements Selection Sort by repeatedly selecting the smallest remaining element and placing it into its final position.
 *   It has O(n^2) time complexity and performs well only for small arrays due to many comparisons.
 */

package main

import "fmt"

// SelectionSort sorts the slice in ascending order (in-place).
func SelectionSort(a []int) {
	n := len(a)
	for i := 0; i < n-1; i++ {
		minIdx := i
		for j := i + 1; j < n; j++ {
			if a[j] < a[minIdx] {
				minIdx = j
			}
		}
		a[i], a[minIdx] = a[minIdx], a[i]
	}
}
func main() {
	test := []int{9, 3, 5, 1, 8, 2, 7, 4, 6}
	fmt.Println("Before:", test)
	SelectionSort(test)
	fmt.Println("After: ", test)
}
