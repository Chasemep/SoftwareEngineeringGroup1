/*

	Name: Diego Lara
	Class ID: 10
	Professor: Dr. Dai
	Course: CS416 - Software Engineering
	Date: Feb 20, 2026
	Selection Sort Implementation in Rust

	Commands to run the code:
	rustc SelectionSort.rs
	./SelectionSort
*/

fn selection_sort<T: Ord>(arr: &mut [T]) {
	let n = arr.len();

	if n <= 1 {
		return;
	}

	for i in 0..n {
		let mut min_index = i;

		for j in (i + 1)..n {
			if arr[j] < arr[min_index] {
				min_index = j;
			}
		}

		if min_index != i {
			arr.swap(i, min_index);
		}
	}
}

fn main() {
	let mut numbers = vec![64, 34, 25, 12, 22, 11, 90];

	println!("Before sorting: {:?}", numbers);
	selection_sort(&mut numbers);
	println!("After sorting:  {:?}", numbers);
}
