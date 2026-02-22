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
