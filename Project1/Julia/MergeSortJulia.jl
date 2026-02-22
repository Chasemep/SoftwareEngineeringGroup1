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
