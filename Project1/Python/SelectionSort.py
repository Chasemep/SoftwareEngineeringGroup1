"""
 Name: Alex Bryant
 ID: 2
 Professor: Dr. Dai
 Course: CS416 - Software Engineering
 Date: Feb 19, 2026

 File: SelectionSort.py

 """

def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i+1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

print(selection_sort([64, 34, 25, 12, 22, 11, 90]))
