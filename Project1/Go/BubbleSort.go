/*
 * Name: Abdelrahman Ahmed
 * Professor: Dr. Dai
 * Course: CS416 - Software Engineering
 * Date: Feb 17, 2026
 *
 * File: BubbleSort.go
 * Description:
 *   Implements Bubble Sort, a simple comparison-based algorithm that repeatedly swaps adjacent out-of-order elements.
 *   It runs in O(n^2) time in the worst case and is mainly useful for learning or very small inputs.
 */

package main

// BubbleSort sorts the slice in ascending order (in-place).
func BubbleSort(a []int) {
	n := len(a)
	for i := 0; i < n-1; i++ {
		swapped := false
		for j := 0; j < n-1-i; j++ {
			if a[j] > a[j+1] {
				a[j], a[j+1] = a[j+1], a[j]
				swapped = true
			}
		}
		if !swapped {
			return
		}
	}
}
