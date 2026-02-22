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

