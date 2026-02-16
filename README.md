# Software Engineering – Team 1 GitHub Repository  
**CS416 – Software Engineering | Dr. Dai**

This repository serves as the central hub for Team 1’s projects and assignments.  
It supports structured collaboration, version control, and streamlined submission of coursework.

> ⚠️ Commands below include both **Windows (CMD/PowerShell)** and **macOS/Linux (Unix)** where applicable.

---

# 1. Cloning the Repository (First-Time Setup Only)

## Step A: Navigate to Your Desired Project Directory

Move to the folder where you want the repository stored.

### Windows (CMD / PowerShell)
```bash
cd C:\Users\YourUsername\exampleFolderName
```

### macOS / Linux (Unix)
```bash
cd ~/exampleFolderName
```

> 🔎 Always verify your file path before cloning.

---

## Step B: Clone the Repository

1. Go to GitHub.
2. Click the green **Code** button.
3. Copy the **HTTPS URL**.
4. Run:

```bash
git clone PASTE_THE_HTTPS_URL_HERE
```

---

## Step C: Enter the Repository Folder

```bash
cd repo-folder-name
```

---

# 2. Pulling the Latest Changes (Before Starting Work)

Always update your local repository first.

If on `main`:
```bash
git pull
```

If on another branch:
```bash
git pull origin your-branch-name
```

---

# 3. Checking Repository Status

Check staged and unstaged files:
```bash
git status
```

View file changes:
```bash
git diff
```

Use these commands frequently.

---

# 4. Creating Files and Folders (Without Using GUI)

For a seamless terminal-based workflow, use the following commands.

---

## Creating a Folder

### Windows (CMD / PowerShell)
```bash
mkdir FolderName
```

### macOS / Linux (Unix)
```bash
mkdir FolderName
```

Create nested folders:

```bash
mkdir FolderName/SubFolderName
```

---

## Creating a New File

### Windows (CMD)
```bash
type nul > filename.txt
```

### Windows (PowerShell)
```bash
New-Item filename.txt
```

### macOS / Linux (Unix)
```bash
touch filename.txt
```

---

## Creating a File Inside a Specific Folder

### Windows
```bash
type nul > FolderName\filename.py
```

### macOS / Linux
```bash
touch FolderName/filename.py
```

---

## Renaming a File

### Windows
```bash
rename oldname.txt newname.txt
```

### macOS / Linux
```bash
mv oldname.txt newname.txt
```

---

## Moving a File to Another Folder

### Windows
```bash
move filename.txt FolderName\
```

### macOS / Linux
```bash
mv filename.txt FolderName/
```

---

## Deleting a File

### Windows
```bash
del filename.txt
```

### macOS / Linux
```bash
rm filename.txt
```

---

## Deleting a Folder

### Windows
```bash
rmdir FolderName
```

Delete non-empty folder:
```bash
rmdir /s FolderName
```

### macOS / Linux
```bash
rm -r FolderName
```

---

# 5. Creating a New Branch (Recommended Workflow)

🚫 Do NOT work directly on `main` unless instructed.

Create and switch to a new branch:

```bash
git checkout -b yourname-AssignmentRequiredNamingConvention
```

### Example Branch Names

```bash
git checkout -b Daniel-Hw1PythonMergeSort
git checkout -b Chase-Hw1JuliaQuickSort
```

Include your name for accountability and clarity.

---

# 6. Saving Changes (Add + Commit)

## Stage Changes

Add all files:
```bash
git add .
```

Add a specific file:
```bash
git add path/to/file
```

---

## Commit Changes

```bash
git commit -m "Short description of what you did"
```

### Example Commit Messages

- Completed Python Merge Sort implementation
- Fixed edge case in Quick Sort
- Updated README instructions

Use clear and professional messages.

---

# 7. Pushing Changes to GitHub

## First Push of a New Branch

```bash
git push -u origin Daniel-Hw1PythonMergeSort
```

## After First Push

```bash
git push
```

---

# 8. Opening a Pull Request (PR)

1. Go to the repository on GitHub.
2. Click **Compare & pull request**.
3. Add a clear title and description.
4. Submit the PR.
5. Wait for approval from at least **two team members** before merging.

---

# 9. Syncing Your Branch with `main`

Before pushing large changes:

```bash
git checkout main
git pull
git checkout Daniel-Hw1PythonMergeSort
git merge main
```

If conflicts appear, resolve them before pushing.

---

# 10. Common Recovery Commands

## Discard Uncommitted Changes
```bash
git reset --hard
```

## Unstage Files
```bash
git reset
```

## Amend Commit Message (If Not Pushed Yet)
```bash
git commit --amend -m "Improved commit message"
```

## View and Switch Branches
```bash
git branch
git checkout branch-name
```

---

# 11. Standard Daily Workflow

Follow this process every time:

1. Pull latest changes:
```bash
git pull
```

2. Make changes.

3. Check status:
```bash
git status
```

4. Stage and commit:
```bash
git add .
git commit -m "Describe your changes"
```

5. Push:
```bash
git push
```

6. Open a Pull Request on GitHub.

---

# Collaboration Guidelines

- Do not push directly to `main`
- Use descriptive branch names
- Write meaningful commit messages
- Always open a PR before merging
- Keep communication clear within the team
- Prefer terminal-based file management for consistency across environments

---

**Team 1 – CS416 Software Engineering**  
Professional collaboration through structured version control.
