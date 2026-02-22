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