"""
Name: Alex Bryant
ID: 2
Professor: Dr. Dai
Course: CS416 - Software Engineering
Date: Feb 19, 2026

File: MergeSort.py
"""

def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        left = arr[:mid]
        right = arr[mid:]
        merge_sort(left)
        merge_sort(right)
        i = j = k = 0
        while i < len(left) and j < len(right):
            if left[i] < right[j]:
                arr[k] = left[i]
                i += 1
            else:
                arr[k] = right[j]
                j += 1
            k += 1
        while i < len(left):
            arr[k] = left[i]
            i += 1
            k += 1
        while j < len(right):
            arr[k] = right[j]
            j += 1
            k += 1
    return arr

arr = [64, 34, 25, 12, 22, 11, 90]
print("Sample Input: ", arr)
merge_sort(arr)
print("Sample Output: ", arr)
