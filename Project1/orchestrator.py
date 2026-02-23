"""
Sorting Algorithm Orchestrator
CS416 - Software Engineering

Central program to run any sorting algorithm in any available language.
Supports: Python, Java, Rust, Julia, Go.

Usage:
    python orchestrator.py                  (interactive mode)
    python orchestrator.py <lang> <algo> <comma-separated-numbers>
        Example: python orchestrator.py python bubble 64,34,25,12,22,11,90
"""

import subprocess
import sys
import os
import tempfile
import shutil
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

LANGUAGES = {
    "1": "python",
    "2": "java",
    "3": "rust",
    "4": "julia",
    "5": "go",
}

ALGORITHMS = {
    "1": "bubble",
    "2": "insertion",
    "3": "selection",
    "4": "quick",
    "5": "merge",
}

# Maps (language, algorithm) -> source file path relative to BASE_DIR
FILE_MAP = {
    ("python", "bubble"):    "Python/BubbleSort.py",
    ("python", "insertion"): "Python/InsertionSort.py",
    ("python", "selection"): "Python/SelectionSort.py",
    ("python", "quick"):     "Python/QuickSort.py",
    ("python", "merge"):     "Python/MergeSort.py",
    ("java", "bubble"):      "Java/BubbleSort.java",
    ("java", "insertion"):   "Java/InsertionSort.java",
    ("java", "selection"):   "Java/SelectionSort.java",
    ("java", "quick"):       "Java/QuickSort.java",
    ("java", "merge"):       "Java/MergeSort.java",
    ("rust", "bubble"):      "Rust/BubbleSort.rs",
    ("rust", "insertion"):   "Rust/InsertionSort.rs",
    ("rust", "selection"):   "Rust/SelectionSort.rs",
    ("rust", "quick"):       "Rust/QuickSort.rs",
    ("rust", "merge"):       "Rust/MergeSort.rs",
    ("julia", "bubble"):     "Julia/BubbleSortJulia.jl",
    ("julia", "insertion"):  "Julia/InsertionSortJulia.jl",
    ("julia", "selection"):  "Julia/SelectionSortJulia.jl",
    ("julia", "quick"):      "Julia/QuickSortJulia.jl",
    ("julia", "merge"):      "Julia/MergeSortJulia.jl",
    ("go", "bubble"):        "Go/BubbleSort.go",
    ("go", "insertion"):     "Go/InsertionSort.go",
    ("go", "selection"):     "Go/SelectionSort.go",
    ("go", "quick"):         "Go/QuickSort.go",
    ("go", "merge"):         "Go/MergeSort.go",
}

# Python function names in each file
PYTHON_FUNCS = {
    "bubble": "bubble_sort",
    "insertion": "insertion_sort",
    "selection": "selection_sort",
    "quick": "quick_sort",
    "merge": "merge_sort",
}

# Java class names
JAVA_CLASSES = {
    "bubble": "BubbleSort",
    "insertion": "InsertionSort",
    "selection": "SelectionSort",
    "quick": "QuickSort",
    "merge": "MergeSort",
}

# Java static method names
JAVA_METHODS = {
    "bubble": "bubbleSort",
    "insertion": "insertionSort",
    "selection": "selectionSort",
    "quick": "quickSort",
    "merge": "mergeSort",
}

# Go function names (camelCase, matching Go conventions)
GO_FUNCS = {
    "bubble": "bubbleSort",
    "insertion": "insertionSort",
    "selection": "selectionSort",
    "quick": "quickSort",
    "merge": "mergeSort",
}


def parse_array(raw):
    """Parse a comma-separated or space-separated string into a list of ints."""
    raw = raw.strip().strip("[]")
    parts = raw.replace(",", " ").split()
    try:
        return [int(x) for x in parts]
    except ValueError:
        print("Error: Could not parse array. Use comma-separated integers (e.g. 5,3,8,1).")
        sys.exit(1)


def check_command(cmd):
    """Check if a command is available on the system."""
    return shutil.which(cmd) is not None


def run_python(algorithm, arr):
    """Run a Python sorting algorithm by importing the module directly."""
    src = os.path.join(BASE_DIR, FILE_MAP[("python", algorithm)])
    func_name = PYTHON_FUNCS[algorithm]

    # Use AST to extract only function definitions, skipping top-level code
    script = (
        f"import ast, types\n"
        f"with open({src!r}) as f:\n"
        f"    tree = ast.parse(f.read())\n"
        f"tree.body = [node for node in tree.body if isinstance(node, (ast.FunctionDef, ast.Import, ast.ImportFrom))]\n"
        f"mod = types.ModuleType('sortmod')\n"
        f"exec(compile(tree, {src!r}, 'exec'), mod.__dict__)\n"
        f"arr = {arr}\n"
        f"result = mod.{func_name}(list(arr))\n"
        f"print(result)\n"
    )

    result = subprocess.run(
        [sys.executable, "-c", script],
        capture_output=True, text=True
    )
    return result


def run_java(algorithm, arr):
    """Compile and run a Java sorting algorithm with the user's array."""
    if not check_command("javac"):
        print("Error: 'javac' not found. Please install a JDK.")
        sys.exit(1)

    class_name = JAVA_CLASSES[algorithm]
    method_name = JAVA_METHODS[algorithm]
    arr_literal = ", ".join(str(x) for x in arr)

    # Create a temp wrapper that calls the existing sort method
    wrapper_src = f"""\
import java.util.Arrays;

public class SortRunner {{
    public static void main(String[] args) {{
        int[] data = new int[] {{{arr_literal}}};
        {class_name}.{method_name}(data);
        System.out.println(Arrays.toString(data));
    }}
}}
"""

    java_dir = os.path.join(BASE_DIR, "Java")
    wrapper_path = os.path.join(java_dir, "SortRunner.java")

    try:
        with open(wrapper_path, "w") as f:
            f.write(wrapper_src)

        # Compile both files
        comp = subprocess.run(
            ["javac", f"{class_name}.java", "SortRunner.java"],
            capture_output=True, text=True, cwd=java_dir
        )
        if comp.returncode != 0:
            return comp

        # Run
        result = subprocess.run(
            ["java", "SortRunner"],
            capture_output=True, text=True, cwd=java_dir
        )
        return result
    finally:
        # Cleanup generated files
        for ext in [".java", ".class"]:
            path = os.path.join(java_dir, f"SortRunner{ext}")
            if os.path.exists(path):
                os.remove(path)
        # Also remove the compiled class for the algorithm
        class_file = os.path.join(java_dir, f"{class_name}.class")
        if os.path.exists(class_file):
            os.remove(class_file)


def run_rust(algorithm, arr):
    """Compile and run a Rust sorting algorithm with the user's array."""
    if not check_command("rustc"):
        print("Error: 'rustc' not found. Please install Rust.")
        sys.exit(1)

    src_path = os.path.join(BASE_DIR, FILE_MAP[("rust", algorithm)])

    # Read the original source and replace the main function
    with open(src_path) as f:
        source = f.read()

    # Extract everything before fn main()
    main_idx = source.find("fn main()")
    if main_idx == -1:
        print("Error: Could not find main() in Rust source.")
        sys.exit(1)

    func_defs = source[:main_idx]
    arr_literal = ", ".join(str(x) for x in arr)
    func_name = PYTHON_FUNCS[algorithm]  # Rust uses same snake_case names

    new_main = f"""\
fn main() {{
    let mut numbers: Vec<i64> = vec![{arr_literal}];
    println!("Unsorted: {{:?}}", numbers);
    {func_name}(&mut numbers);
    println!("Sorted:   {{:?}}", numbers);
}}
"""
    # Special case: quick_sort in Python uses different return style,
    # but Rust quick_sort takes &mut [T] like the others, so this works.

    tmp = tempfile.NamedTemporaryFile(suffix=".rs", delete=False, mode="w")
    try:
        tmp.write(func_defs + new_main)
        tmp.close()

        out_path = tmp.name.replace(".rs", "")

        comp = subprocess.run(
            ["rustc", tmp.name, "-o", out_path],
            capture_output=True, text=True
        )
        if comp.returncode != 0:
            return comp

        result = subprocess.run(
            [out_path],
            capture_output=True, text=True
        )
        return result
    finally:
        if os.path.exists(tmp.name):
            os.remove(tmp.name)
        out_path = tmp.name.replace(".rs", "")
        if os.path.exists(out_path):
            os.remove(out_path)


def run_julia(algorithm, arr):
    """Run a Julia sorting algorithm with the user's array."""
    if not check_command("julia"):
        print("Error: 'julia' not found. Please install Julia.")
        sys.exit(1)

    src_path = os.path.join(BASE_DIR, FILE_MAP[("julia", algorithm)])
    func_name = PYTHON_FUNCS[algorithm]  # Julia also uses snake_case

    # Read source and extract only the function definitions
    with open(src_path) as f:
        source = f.read()

    # Remove everything after the last 'end' of a function definition
    # by finding the sample/test code (lines after the last function)
    lines = source.split("\n")
    func_lines = []
    in_function = False
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("function "):
            in_function = True
        if in_function:
            func_lines.append(line)
        if in_function and stripped == "end":
            in_function = False
            func_lines.append("")  # blank line separator

    arr_literal = "[" + ", ".join(str(x) for x in arr) + "]"

    script = "\n".join(func_lines) + f"""
arr = {arr_literal}
println("Unsorted: ", arr)
sorted_arr = {func_name}(arr)
println("Sorted:   ", sorted_arr)
"""

    tmp = tempfile.NamedTemporaryFile(suffix=".jl", delete=False, mode="w")
    try:
        tmp.write(script)
        tmp.close()

        result = subprocess.run(
            ["julia", tmp.name],
            capture_output=True, text=True
        )
        return result
    finally:
        if os.path.exists(tmp.name):
            os.remove(tmp.name)


def run_go(algorithm, arr):
    """Compile and run a Go sorting algorithm with the user's array."""
    if not check_command("go"):
        print("Error: 'go' not found. Please install Go.")
        sys.exit(1)

    src_path = os.path.join(BASE_DIR, FILE_MAP[("go", algorithm)])
    func_name = GO_FUNCS[algorithm]

    # Read the original source and replace the main function
    with open(src_path) as f:
        source = f.read()

    # Extract everything before func main()
    main_idx = source.find("func main()")
    if main_idx == -1:
        print("Error: Could not find main() in Go source.")
        sys.exit(1)

    func_defs = source[:main_idx]
    arr_literal = ", ".join(str(x) for x in arr)

    new_main = f"""\
func main() {{
\tnumbers := []int{{{arr_literal}}}
\tfmt.Println("Unsorted:", numbers)
\t{func_name}(numbers)
\tfmt.Println("Sorted:  ", numbers)
}}
"""

    # Ensure "fmt" is imported (add if not already in the source)
    if '"fmt"' not in func_defs:
        func_defs = func_defs.replace("import (", 'import (\n\t"fmt"', 1)

    tmp_dir = tempfile.mkdtemp()
    tmp_path = os.path.join(tmp_dir, "main.go")
    try:
        with open(tmp_path, "w") as f:
            f.write(func_defs + new_main)

        result = subprocess.run(
            ["go", "run", tmp_path],
            capture_output=True, text=True
        )
        return result
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


def run_sort(language, algorithm, arr):
    """Dispatch to the appropriate language runner."""
    runners = {
        "python": run_python,
        "java": run_java,
        "rust": run_rust,
        "julia": run_julia,
        "go": run_go,
    }

    runner = runners.get(language)
    if not runner:
        print(f"Error: Language '{language}' is not supported yet.")
        sys.exit(1)

    print(f"\nRunning {algorithm.title()} Sort in {language.title()}...")
    print(f"Input: {arr}\n")

    # Check that the source file exists before trying to run
    src_key = (language, algorithm)
    if src_key in FILE_MAP:
        src_path = os.path.join(BASE_DIR, FILE_MAP[src_key])
        if not os.path.exists(src_path):
            print(f"Error: Source file not found: {FILE_MAP[src_key]}")
            print("The implementation for this language/algorithm has not been added yet.")
            return 1

    start = time.perf_counter()
    result = runner(algorithm, arr)
    elapsed = time.perf_counter() - start

    if result.returncode != 0:
        print("--- ERROR ---")
        print(result.stderr)
    else:
        print("--- Output ---")
        print(result.stdout.strip())

    print(f"\nTime: {elapsed:.4f}s")

    return result.returncode


def interactive_mode():
    """Run the orchestrator in interactive mode with menus."""
    print("=" * 50)
    print("   Sorting Algorithm Orchestrator")
    print("=" * 50)

    # Choose language
    print("\nAvailable Languages:")
    print("  1) Python")
    print("  2) Java")
    print("  3) Rust")
    print("  4) Julia")
    print("  5) Go")
    lang_choice = input("\nSelect a language (1-5): ").strip()
    language = LANGUAGES.get(lang_choice)
    if not language:
        print("Invalid choice.")
        sys.exit(1)

    # Choose algorithm
    print("\nAvailable Algorithms:")
    print("  1) Bubble Sort")
    print("  2) Insertion Sort")
    print("  3) Selection Sort")
    print("  4) Quick Sort")
    print("  5) Merge Sort")
    algo_choice = input("\nSelect an algorithm (1-5): ").strip()
    algorithm = ALGORITHMS.get(algo_choice)
    if not algorithm:
        print("Invalid choice.")
        sys.exit(1)

    # Get array input
    raw = input("\nEnter array (comma-separated integers, e.g. 5,3,8,1): ").strip()
    arr = parse_array(raw)

    run_sort(language, algorithm, arr)


def cli_mode():
    """Run from command-line arguments: orchestrator.py <lang> <algo> <array>"""
    language = sys.argv[1].lower()
    algorithm = sys.argv[2].lower()
    arr = parse_array(sys.argv[3])

    valid_langs = set(LANGUAGES.values())
    valid_algos = set(ALGORITHMS.values())

    if language not in valid_langs:
        print(f"Error: Unknown language '{language}'. Choose from: {', '.join(sorted(valid_langs))}")
        sys.exit(1)
    if algorithm not in valid_algos:
        print(f"Error: Unknown algorithm '{algorithm}'. Choose from: {', '.join(sorted(valid_algos))}")
        sys.exit(1)

    run_sort(language, algorithm, arr)


if __name__ == "__main__":
    if len(sys.argv) == 4:
        cli_mode()
    elif len(sys.argv) == 1:
        interactive_mode()
    else:
        print(__doc__)
        sys.exit(1)
