function quick_sort(arr)
    if length(arr) <= 1
        return arr
    end

    pivot = arr[end]
    less = [x for x in arr[1:end-1] if x <= pivot]
    greater = [x for x in arr[1:end-1] if x > pivot]

    return vcat(quick_sort(less), [pivot], quick_sort(greater))
end