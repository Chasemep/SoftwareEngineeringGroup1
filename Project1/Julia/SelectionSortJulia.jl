#= 
Name: Bogdan Djankovic
Professor: Dr. Dai
Course: CS416 - Software Engineering
Date: February 22, 2026

File: SelectionSortJulia.jl
Description:
  Implements the Selection Sort algorithm for sorting an integer array in ascending order.

How Selection Sort Works (high level):
  - Repeatedly select the minimum element from the unsorted portion and move it to the sorted portion.

Time Complexity:
  - Worst/Average/Best: O(n^2)
Space Complexity:
  - O(1) extra space (in-place sort).
=#

function selection_sort(arr)
	a = copy(arr)
	n = length(a)

	for i in 1:n-1
		min_index = i
		for j in i+1:n
			if a[j] < a[min_index]
			min_index = j
			end
		end
		a[i], a[min_index] = a[min_index], a[i]
	end
	return a
end

# Sample usage
arr = [12, 11, 13, 5, 6]
println("Sample Input:  ", arr)

sorted_arr = selection_sort(arr)
println("Sorted Output: ", sorted_arr)