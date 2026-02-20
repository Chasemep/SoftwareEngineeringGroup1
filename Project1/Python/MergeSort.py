"""
 Name: Alex Bryant
 ID: 2
 Professor Dr. Dai
 Course: CS416 - Software Engineering
 Date: Feb 19, 2026

 File: MergeSort.py

"""

def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j+1] = arr[j]
            j -= 1
        arr[j+1] = key
    return arr

print(insertion_sort([64, 34, 25, 12, 22, 11, 90]))
