/*
 * Name: Abdelrahman Ahmed
 * Professor: Dr. Dai
 * Course: CS416 - Software Engineering
 * Date: Feb 17, 2026
 *
 * File: InsertionSort.go
 * Description:
 *   Implements Insertion Sort by building a sorted prefix and inserting each new element into the correct place.
 *   Worst-case time is O(n^2), but it can be fast for nearly sorted data.
 */

package main

import "fmt"

// InsertionSort sorts the slice in ascending order (in-place).
func InsertionSort(a []int) {
	for i := 1; i < len(a); i++ {
		key := a[i]
		j := i - 1
		for j >= 0 && a[j] > key {
			a[j+1] = a[j]
			j--
		}
		a[j+1] = key
	}
}

func main() {
	test := []int{9, 3, 5, 1, 8, 2, 7, 4, 6}
	fmt.Println("Before:", test)
	InsertionSort(test)
	fmt.Println("After: ", test)
}
