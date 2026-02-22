#= 
Name: Bogdan Djankovic
Professor: Dr. Dai
Course: CS416 - Software Engineering
Date: February 22, 2026

File: InsertionSortJulia.jl
Description:
  Implements the Insertion Sort algorithm for sorting an integer array in ascending order.

How Insertion Sort Works (high level):
  - Build a sorted region on the left side of the array (starts with the first element).
  - For each next element (the "key") from left to right:
      1) Compare the key with elements in the sorted region (moving left).
      2) Shift any elements that are greater than the key one position to the right.
      3) Insert the key into its correct position.

Time Complexity:
  - Worst/Average: O(n^2)
  - Best (already sorted): O(n)
Space Complexity:
  - O(1) extra space (in-place sort).
=#

function insertion_sort(arr)
    a = copy(arr)
    n = length(a)

    for i in 2:n
        key = a[i]
        j = i - 1
        while j >= 1 && a[j] > key
            a[j+1] = a[j]
            j -= 1
        end
        a[j+1] = key
    end
    return a
end

arr = [12, 11, 13, 5, 6]
println("Sample Input:  ", arr)

sorted_arr = insertion_sort(arr)   # čuvamo rezultat u novom nizu
println("Sorted Output: ", sorted_arr)
end
