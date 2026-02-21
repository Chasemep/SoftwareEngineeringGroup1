/*

	Name: Diego Lara
	Class ID: 10
	Professor: Dr. Dai
	Course: CS416 - Software Engineering
	Date: Feb 20, 2026
	Insertion Sort Implementation in Rust

	Commands to run the code:
	rustc InsertionSort.rs
	./InsertionSort
*/

fn insertion_sort<T: Ord>(arr: &mut [T]) {
	let n = arr.len();

	if n <= 1 {
		return;
	}

	for i in 1..n {
		let mut j = i;

		while j > 0 && arr[j] < arr[j - 1] {
			arr.swap(j, j - 1);
			j -= 1;
		}
	}
}

fn main() {
	let mut numbers = vec![64, 34, 25, 12, 22, 11, 90];

	println!("Before sorting: {:?}", numbers);
	insertion_sort(&mut numbers);
	println!("After sorting:  {:?}", numbers);
}
