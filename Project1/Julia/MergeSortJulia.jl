#= 
Name: Bogdan Djankovic
Professor: Dr. Dai
Course: CS416 - Software Engineering
Date: February 22, 2026

File: MergeSortJulia.jl
Description:
  Implements the Merge Sort algorithm for sorting an integer array in ascending order.

How Merge Sort Works (high level):
  - Divide the array into two halves, recursively sort both halves, then merge them.

Time Complexity:
  - Worst/Average/Best: O(n log n)
Space Complexity:
  - O(n) extra space for merging.
=#

function merge_sort(arr)
    if length(arr) <= 1
        return arr
    end

    mid = div(length(arr), 2)
    left = merge_sort(arr[1:mid])
    right = merge_sort(arr[mid+1:end])

    return merge(left, right)
end

function merge(left, right)
    result = []
    i = 1
    j = 1

    while i <= length(left) && j <= length(right)
        if left[i] < right[j]
            push!(result, left[i])
            i += 1
        else
            push!(result, right[j])
            j += 1
        end
    end

    while i <= length(left)
        push!(result, left[i])
        i += 1
    end

    while j <= length(right)
        push!(result, right[j])
        j += 1
    end

    return result
end

# Sample usage
arr = [12, 11, 13, 5, 6]
println("Sample Input:  ", arr)

sorted_arr = merge_sort(arr)   # čuvamo rezultat u novom nizu
println("Sorted Output: ", sorted_arr)
