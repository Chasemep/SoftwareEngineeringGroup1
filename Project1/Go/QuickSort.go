/*
 * Name: Abdelrahman Ahmed
 * Professor: Dr. Dai
 * Course: CS416 - Software Engineering
 * Date: Feb 17, 2026
 *
 * File: QuickSort.go
 * Description:
 *   Implements Quick Sort, a divide-and-conquer algorithm that partitions the array around a pivot and sorts subranges.
 *   Average time is O(n log n), but worst-case can be O(n^2) depending on pivot choices.
 */

package main

import "fmt"

// QuickSort sorts the slice in ascending order (in-place).
func QuickSort(a []int) {
	if len(a) <= 1 {
		return
	}
	quickSort(a, 0, len(a)-1)
}

func quickSort(a []int, lo, hi int) {
	if lo >= hi {
		return
	}
	p := partitionLomuto(a, lo, hi)
	quickSort(a, lo, p-1)
	quickSort(a, p+1, hi)
}

// partitionLomuto uses the last element as pivot (simple and common).
func partitionLomuto(a []int, lo, hi int) int {
	pivot := a[hi]
	i := lo
	for j := lo; j < hi; j++ {
		if a[j] < pivot {
			a[i], a[j] = a[j], a[i]
			i++
		}
	}
	a[i], a[hi] = a[hi], a[i]
	return i
}
func main() {
	test := []int{9, 3, 5, 1, 8, 2, 7, 4, 6}
	fmt.Println("Before:", test)
	QuickSort(test)
	fmt.Println("After: ", test)
}
