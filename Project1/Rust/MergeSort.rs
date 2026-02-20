/*

	Name: Diego Lara
	Class ID: 10
	Professor: Dr. Dai
	Course: CS416 - Software Engineering
	Date: Feb 20, 2026
	Merge Sort Implementation in Rust

	Commands to run the code:
	rustc MergeSort.rs
	./MergeSort
*/

fn merge_sort<T: Ord + Clone>(arr: &mut [T]) {
	let n = arr.len();

	if n <= 1 {
		return;
	}

	let mid = n / 2;
	merge_sort(&mut arr[..mid]);
	merge_sort(&mut arr[mid..]);

	let mut merged = arr.to_vec();
	merge(&arr[..mid], &arr[mid..], &mut merged[..]);
	arr.clone_from_slice(&merged);
}

fn merge<T: Ord + Clone>(left: &[T], right: &[T], merged: &mut [T]) {
	let mut left_index = 0;
	let mut right_index = 0;
	let mut merged_index = 0;

	while left_index < left.len() && right_index < right.len() {
		if left[left_index] <= right[right_index] {
			merged[merged_index] = left[left_index].clone();
			left_index += 1;
		} else {
			merged[merged_index] = right[right_index].clone();
			right_index += 1;
		}
		merged_index += 1;
	}

	while left_index < left.len() {
		merged[merged_index] = left[left_index].clone();
		left_index += 1;
		merged_index += 1;
	}

	while right_index < right.len() {
		merged[merged_index] = right[right_index].clone();
		right_index += 1;
		merged_index += 1;
	}
}

fn main() {
	let mut numbers = vec![64, 34, 25, 12, 22, 11, 90];

	println!("Before sorting: {:?}", numbers);
	merge_sort(&mut numbers);
	println!("After sorting:  {:?}", numbers);
}
