/*

    Name: Diego Lara
    Class ID: 10
    Professor: Dr. Dai
    Course: CS416 - Software Engineering
    Date: Feb 20, 2026
    Bubble Sort Implementation in Rust

    Commands to run the code:
    rustc BubbleSort.rs
    ./BubbleSort
*/

fn bubble_sort<T: Ord>(arr: &mut [T]) {
	let n = arr.len();

	if n < 2 {
		return;
	}

	for i in 0..n {
		let mut swapped = false;
		for j in 0..(n - 1 - i) {
			if arr[j] > arr[j + 1] {
				arr.swap(j, j + 1);
				swapped = true;
			}
		}

		if !swapped {
			break;
		}
	}
}

fn main() {
	let mut numbers = vec![64, 34, 25, 12, 22, 11, 90];
	println!("Before sorting: {:?}", numbers);
	bubble_sort(&mut numbers);
	println!("After sorting:  {:?}", numbers);
}
