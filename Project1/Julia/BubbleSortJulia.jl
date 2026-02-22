#= 
Name: Bogdan Djankovic
Professor: Dr. Dai
Course: CS416 - Software Engineering
Date: February 22, 2026

File: BubbleSortJulia.jl
Description:
  Implements the Bubble Sort algorithm for sorting an integer array in ascending order.

How Bubble Sort Works (high level):
  - Repeatedly step through the array, compare adjacent elements and swap if out of order.
  - Continue until no swaps are needed.

Time Complexity:
  - Worst/Average: O(n^2)
  - Best (already sorted): O(n)
Space Complexity:
  - O(1) extra space (in-place sort).
=#

function bubble_sort(arr)
	a = copy(arr)
	n = length(a)

	for i in 1:n-1
		for j in 1:n-1	
			if a[j] > a[j+1]
				a[j], a[j+1] = a[j+1], a[j]
			end
		end
	end
	return a
end

#sample
arr = [12, 11, 13, 5, 6]
println("Sample Input:  ", arr)

sorted_arr = bubble_sort(arr)   # čuvamo rezultat u novom nizu
println("Sorted Output: ", sorted_arr)
