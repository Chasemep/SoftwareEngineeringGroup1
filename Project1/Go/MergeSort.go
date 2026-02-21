/*
 * Name: Abdelrahman Ahmed
 * Professor: Dr. Dai
 * Course: CS416 - Software Engineering
 * Date: Feb 17, 2026
 *
 * File: MergeSort.go
 * Description:
 *   Implements Merge Sort using a divide-and-conquer strategy that recursively splits and merges sorted halves.
 *   It runs in O(n log n) time and is stable, but uses extra memory for merging.
 */

package main

import "fmt"

// MergeSort returns a NEW sorted slice in ascending order (does not modify input).
func MergeSort(a []int) []int {
	if len(a) <= 1 {
		out := make([]int, len(a))
		copy(out, a)
		return out
	}
	mid := len(a) / 2
	left := MergeSort(a[:mid])
	right := MergeSort(a[mid:])
	return merge(left, right)
}

func merge(left, right []int) []int {
	out := make([]int, 0, len(left)+len(right))
	i, j := 0, 0
	for i < len(left) && j < len(right) {
		if left[i] <= right[j] {
			out = append(out, left[i])
			i++
		} else {
			out = append(out, right[j])
			j++
		}
	}
	out = append(out, left[i:]...)
	out = append(out, right[j:]...)
	return out
}
func main() {
	test := []int{9, 3, 5, 1, 8, 2, 7, 4, 6}
	fmt.Println("Before:", test)
	sorted := MergeSort(test)
	fmt.Println("After: ", sorted)
	fmt.Println("Original unchanged:", test)
}
