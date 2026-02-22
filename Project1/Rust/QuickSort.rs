/*

    Name: Diego Lara
    Class ID: 10
    Professor: Dr. Dai
    Course: CS416 - Software Engineering
    Date: Feb 20, 2026
    Quick Sort Implementation in Rust

    Commands to run the code:
    rustc QuickSort.rs
    ./QuickSort
*/

fn quick_sort<T: Ord>(arr: &mut [T]) {
	if arr.len() <= 1 {
		return;
	}

	let pivot_index = partition(arr);
	let (left, right_with_pivot) = arr.split_at_mut(pivot_index);
	quick_sort(left);
	quick_sort(&mut right_with_pivot[1..]);
}

fn partition<T: Ord>(arr: &mut [T]) -> usize {
	let last = arr.len() - 1;
	let mut store_index = 0;

	for i in 0..last {
		if arr[i] <= arr[last] {
			arr.swap(i, store_index);
			store_index += 1;
		}
	}

	arr.swap(store_index, last);
	store_index
}

fn main() {
	let mut numbers = vec![64, 34, 25, 12, 22, 11, 90];

	println!("Before sorting: {:?}", numbers);
	quick_sort(&mut numbers);
	println!("After sorting:  {:?}", numbers);
}
