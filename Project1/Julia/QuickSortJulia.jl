#= 
Name: Bogdan Djankovic
Professor: Dr. Dai
Course: CS416 - Software Engineering
Date: February 22, 2026

File: QuickSortJulia.jl
Description:
  Implements the Quick Sort algorithm for sorting an integer array in ascending order.

How Quick Sort Works (high level):
  - Pick a pivot element, partition the array so that elements < pivot are on left, > pivot on right.
  - Recursively apply to left and right subarrays.

Time Complexity:
  - Worst: O(n^2)
  - Average/Best: O(n log n)
Space Complexity:
  - O(log n) extra space for recursion.
=#

function quick_sort(arr)
    if length(arr) <= 1
        return arr
    end

    pivot = arr[end]
    less = [x for x in arr[1:end-1] if x <= pivot]
    greater = [x for x in arr[1:end-1] if x > pivot]

    return vcat(quick_sort(less), [pivot], quick_sort(greater))
end

#sample
arr = [12, 11, 13, 5, 6]
println("Sample Input: ", arr)

sorted_arr = quick_sort(arr)   
println("Sorted Output: ", sorted_arr)