# Sudoku Solver

**Sudoku Solver** is a classic constraint satisfaction problem solved using **backtracking** with intelligent **constraint propagation**. The algorithm systematically fills empty cells while maintaining Sudoku rules, backtracking when conflicts arise, and using heuristics to improve performance significantly.

Modern Sudoku solvers combine backtracking with constraint propagation techniques like **naked singles**, **hidden singles**, and **constraint checking** to solve most puzzles without extensive search.

## Problem Statement

Given a partially filled 9×9 Sudoku grid, fill the empty cells such that:

- Each **row** contains digits 1-9 exactly once
- Each **column** contains digits 1-9 exactly once
- Each **3×3 sub-grid** contains digits 1-9 exactly once

**Input**: 9×9 grid with some cells filled (1-9) and empty cells (0 or '.')
**Output**: Complete valid Sudoku solution or indication if no solution exists

## Key Concepts

- **Constraint Satisfaction**: Each placement must satisfy row, column, and box constraints
- **Backtracking**: Try values and backtrack when constraints are violated
- **Constraint Propagation**: Deduce forced moves to reduce search space
- **Heuristics**: Choose cells and values strategically to minimize backtracking
- **Arc Consistency**: Maintain consistency between related constraints

## Time and Space Complexity

| Approach                    | Time Complexity | Space Complexity |
| --------------------------- | --------------- | ---------------- |
| Naive Backtracking          | O(9^(n²))       | O(n²)            |
| Optimized Backtracking      | O(9^k)          | O(n²)            |
| With Constraint Propagation | O(1) - O(9^k)   | O(n²)            |

**n** = 9 (grid size), **k** = number of empty cells (typically much less than 81)

## Implementation

### Basic Sudoku Solver

```typescript
class SudokuSolver {
  private board: number[][];
  private readonly SIZE = 9;
  private readonly BOX_SIZE = 3;

  constructor(board: number[][]) {
    this.board = board.map((row) => [...row]);
  }

  solve(): boolean {
    const emptyCell = this.findEmptyCell();
    if (!emptyCell) {
      return true;
    }

    const [row, col] = emptyCell;

    for (let num = 1; num <= 9; num++) {
      if (this.isValidPlacement(row, col, num)) {
        this.board[row][col] = num;

        if (this.solve()) {
          return true;
        }

        this.board[row][col] = 0;
      }
    }

    return false;
  }

  private findEmptyCell(): [number, number] | null {
    for (let row = 0; row < this.SIZE; row++) {
      for (let col = 0; col < this.SIZE; col++) {
        if (this.board[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null;
  }

  private isValidPlacement(row: number, col: number, num: number): boolean {
    return (
      this.isValidRow(row, num) &&
      this.isValidColumn(col, num) &&
      this.isValidBox(row, col, num)
    );
  }

  private isValidRow(row: number, num: number): boolean {
    for (let col = 0; col < this.SIZE; col++) {
      if (this.board[row][col] === num) {
        return false;
      }
    }
    return true;
  }

  private isValidColumn(col: number, num: number): boolean {
    for (let row = 0; row < this.SIZE; row++) {
      if (this.board[row][col] === num) {
        return false;
      }
    }
    return true;
  }

  private isValidBox(row: number, col: number, num: number): boolean {
    const boxRow = Math.floor(row / this.BOX_SIZE) * this.BOX_SIZE;
    const boxCol = Math.floor(col / this.BOX_SIZE) * this.BOX_SIZE;

    for (let i = boxRow; i < boxRow + this.BOX_SIZE; i++) {
      for (let j = boxCol; j < boxCol + this.BOX_SIZE; j++) {
        if (this.board[i][j] === num) {
          return false;
        }
      }
    }
    return true;
  }

  getSolution(): number[][] {
    return this.board.map((row) => [...row]);
  }

  isValid(): boolean {
    for (let row = 0; row < this.SIZE; row++) {
      for (let col = 0; col < this.SIZE; col++) {
        if (this.board[row][col] !== 0) {
          const num = this.board[row][col];
          this.board[row][col] = 0;

          if (!this.isValidPlacement(row, col, num)) {
            this.board[row][col] = num;
            return false;
          }

          this.board[row][col] = num;
        }
      }
    }
    return true;
  }
}
```

### Optimized Sudoku Solver with Heuristics

```typescript
class OptimizedSudokuSolver {
  private board: number[][];
  private candidates: Set<number>[][][];
  private readonly SIZE = 9;
  private readonly BOX_SIZE = 3;

  constructor(board: number[][]) {
    this.board = board.map((row) => [...row]);
    this.candidates = this.initializeCandidates();
    this.updateAllCandidates();
  }

  private initializeCandidates(): Set<number>[][][] {
    const candidates: Set<number>[][][] = [];
    for (let i = 0; i < this.SIZE; i++) {
      candidates[i] = [];
      for (let j = 0; j < this.SIZE; j++) {
        candidates[i][j] = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      }
    }
    return candidates;
  }

  private updateAllCandidates(): void {
    for (let row = 0; row < this.SIZE; row++) {
      for (let col = 0; col < this.SIZE; col++) {
        if (this.board[row][col] !== 0) {
          this.eliminateNumber(row, col, this.board[row][col]);
        }
      }
    }
  }

  solve(): boolean {
    if (!this.propagateConstraints()) {
      return false;
    }

    const cell = this.findBestCell();
    if (!cell) {
      return true;
    }

    const [row, col] = cell;
    const possibleValues = Array.from(this.candidates[row][col]);

    for (const num of possibleValues) {
      const boardBackup = this.board.map((row) => [...row]);
      const candidatesBackup = this.copyCandidates();

      this.placeNumber(row, col, num);

      if (this.solve()) {
        return true;
      }

      this.board = boardBackup;
      this.candidates = candidatesBackup;
    }

    return false;
  }

  private propagateConstraints(): boolean {
    let changed = true;

    while (changed) {
      changed = false;

      if (!this.findNakedSingles()) return false;
      if (this.findHiddenSingles()) changed = true;
      if (this.checkContradictions()) return false;
    }

    return true;
  }

  private findNakedSingles(): boolean {
    for (let row = 0; row < this.SIZE; row++) {
      for (let col = 0; col < this.SIZE; col++) {
        if (this.board[row][col] === 0) {
          if (this.candidates[row][col].size === 0) {
            return false;
          }

          if (this.candidates[row][col].size === 1) {
            const num = Array.from(this.candidates[row][col])[0];
            this.placeNumber(row, col, num);
          }
        }
      }
    }
    return true;
  }

  private findHiddenSingles(): boolean {
    let found = false;

    for (let row = 0; row < this.SIZE; row++) {
      if (this.findHiddenSinglesInRow(row)) found = true;
    }

    for (let col = 0; col < this.SIZE; col++) {
      if (this.findHiddenSinglesInColumn(col)) found = true;
    }

    for (let boxRow = 0; boxRow < this.SIZE; boxRow += this.BOX_SIZE) {
      for (let boxCol = 0; boxCol < this.SIZE; boxCol += this.BOX_SIZE) {
        if (this.findHiddenSinglesInBox(boxRow, boxCol)) found = true;
      }
    }

    return found;
  }

  private findHiddenSinglesInRow(row: number): boolean {
    let found = false;

    for (let num = 1; num <= 9; num++) {
      const possibleCols: number[] = [];

      for (let col = 0; col < this.SIZE; col++) {
        if (this.board[row][col] === 0 && this.candidates[row][col].has(num)) {
          possibleCols.push(col);
        }
      }

      if (possibleCols.length === 1) {
        this.placeNumber(row, possibleCols[0], num);
        found = true;
      }
    }

    return found;
  }

  private findHiddenSinglesInColumn(col: number): boolean {
    let found = false;

    for (let num = 1; num <= 9; num++) {
      const possibleRows: number[] = [];

      for (let row = 0; row < this.SIZE; row++) {
        if (this.board[row][col] === 0 && this.candidates[row][col].has(num)) {
          possibleRows.push(row);
        }
      }

      if (possibleRows.length === 1) {
        this.placeNumber(possibleRows[0], col, num);
        found = true;
      }
    }

    return found;
  }

  private findHiddenSinglesInBox(startRow: number, startCol: number): boolean {
    let found = false;

    for (let num = 1; num <= 9; num++) {
      const possibleCells: Array<[number, number]> = [];

      for (let i = startRow; i < startRow + this.BOX_SIZE; i++) {
        for (let j = startCol; j < startCol + this.BOX_SIZE; j++) {
          if (this.board[i][j] === 0 && this.candidates[i][j].has(num)) {
            possibleCells.push([i, j]);
          }
        }
      }

      if (possibleCells.length === 1) {
        const [row, col] = possibleCells[0];
        this.placeNumber(row, col, num);
        found = true;
      }
    }

    return found;
  }

  private findBestCell(): [number, number] | null {
    let bestCell: [number, number] | null = null;
    let minCandidates = 10;

    for (let row = 0; row < this.SIZE; row++) {
      for (let col = 0; col < this.SIZE; col++) {
        if (this.board[row][col] === 0) {
          const candidateCount = this.candidates[row][col].size;
          if (candidateCount < minCandidates) {
            minCandidates = candidateCount;
            bestCell = [row, col];
          }
        }
      }
    }

    return bestCell;
  }

  private placeNumber(row: number, col: number, num: number): void {
    this.board[row][col] = num;
    this.candidates[row][col].clear();
    this.eliminateNumber(row, col, num);
  }

  private eliminateNumber(row: number, col: number, num: number): void {
    for (let i = 0; i < this.SIZE; i++) {
      this.candidates[row][i].delete(num);
      this.candidates[i][col].delete(num);
    }

    const boxRow = Math.floor(row / this.BOX_SIZE) * this.BOX_SIZE;
    const boxCol = Math.floor(col / this.BOX_SIZE) * this.BOX_SIZE;

    for (let i = boxRow; i < boxRow + this.BOX_SIZE; i++) {
      for (let j = boxCol; j < boxCol + this.BOX_SIZE; j++) {
        this.candidates[i][j].delete(num);
      }
    }
  }

  private checkContradictions(): boolean {
    for (let row = 0; row < this.SIZE; row++) {
      for (let col = 0; col < this.SIZE; col++) {
        if (
          this.board[row][col] === 0 &&
          this.candidates[row][col].size === 0
        ) {
          return true;
        }
      }
    }
    return false;
  }

  private copyCandidates(): Set<number>[][][] {
    const copy: Set<number>[][][] = [];
    for (let i = 0; i < this.SIZE; i++) {
      copy[i] = [];
      for (let j = 0; j < this.SIZE; j++) {
        copy[i][j] = new Set(this.candidates[i][j]);
      }
    }
    return copy;
  }

  getSolution(): number[][] {
    return this.board.map((row) => [...row]);
  }

  countSolutions(): number {
    return this.countSolutionsRecursive();
  }

  private countSolutionsRecursive(): number {
    const cell = this.findBestCell();
    if (!cell) {
      return 1;
    }

    const [row, col] = cell;
    let count = 0;

    for (const num of this.candidates[row][col]) {
      const boardBackup = this.board.map((row) => [...row]);
      const candidatesBackup = this.copyCandidates();

      this.placeNumber(row, col, num);

      if (this.propagateConstraints()) {
        count += this.countSolutionsRecursive();
      }

      this.board = boardBackup;
      this.candidates = candidatesBackup;
    }

    return count;
  }
}
```

### Advanced Sudoku Solver with Dancing Links

```typescript
class DancingLinksSudokuSolver {
  private matrix: number[][];
  private header: DLXNode;
  private solution: number[];
  private solutionFound: boolean;

  constructor(private board: number[][]) {
    this.matrix = this.createExactCoverMatrix();
    this.header = this.buildDancingLinksStructure();
    this.solution = [];
    this.solutionFound = false;
  }

  private createExactCoverMatrix(): number[][] {
    const matrix: number[][] = [];
    const SIZE = 9;

    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        for (let num = 1; num <= SIZE; num++) {
          if (this.board[row][col] === 0 || this.board[row][col] === num) {
            const constraintRow = new Array(324).fill(0);

            const cellConstraint = row * SIZE + col;
            const rowConstraint = 81 + row * SIZE + (num - 1);
            const colConstraint = 162 + col * SIZE + (num - 1);
            const boxConstraint =
              243 +
              (Math.floor(row / 3) * 3 + Math.floor(col / 3)) * SIZE +
              (num - 1);

            constraintRow[cellConstraint] = 1;
            constraintRow[rowConstraint] = 1;
            constraintRow[colConstraint] = 1;
            constraintRow[boxConstraint] = 1;

            matrix.push(constraintRow);
          }
        }
      }
    }

    return matrix;
  }

  private buildDancingLinksStructure(): DLXNode {
    const header = new DLXNode();
    const columnHeaders: DLXNode[] = [];

    for (let j = 0; j < 324; j++) {
      const colHeader = new DLXNode();
      colHeader.size = 0;
      colHeader.name = j;
      columnHeaders.push(colHeader);

      header.left.right = colHeader;
      colHeader.right = header;
      colHeader.left = header.left;
      header.left = colHeader;
    }

    for (let i = 0; i < this.matrix.length; i++) {
      let prev: DLXNode | null = null;

      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j] === 1) {
          const newNode = new DLXNode();
          newNode.rowId = i;
          newNode.column = columnHeaders[j];

          if (columnHeaders[j].down === columnHeaders[j]) {
            columnHeaders[j].down = newNode;
            newNode.up = columnHeaders[j];
          } else {
            newNode.up = columnHeaders[j].up;
            columnHeaders[j].up.down = newNode;
          }

          newNode.down = columnHeaders[j];
          columnHeaders[j].up = newNode;
          columnHeaders[j].size++;

          if (prev === null) {
            newNode.left = newNode;
            newNode.right = newNode;
          } else {
            newNode.left = prev;
            newNode.right = prev.right;
            prev.right.left = newNode;
            prev.right = newNode;
          }

          prev = newNode;
        }
      }
    }

    return header;
  }

  solve(): boolean {
    this.search(0);
    return this.solutionFound;
  }

  private search(k: number): void {
    if (this.solutionFound) return;

    if (this.header.right === this.header) {
      this.solutionFound = true;
      return;
    }

    const column = this.chooseColumn();
    this.cover(column);

    let row = column.down;
    while (row !== column && !this.solutionFound) {
      this.solution[k] = row.rowId!;

      let j = row.right;
      while (j !== row) {
        this.cover(j.column!);
        j = j.right;
      }

      this.search(k + 1);

      row = this.solution[k];
      column = this.getRowNode(row).column!;

      j = this.getRowNode(row).left;
      while (j !== this.getRowNode(row)) {
        this.uncover(j.column!);
        j = j.left;
      }

      row = row.down;
    }

    this.uncover(column);
  }

  private chooseColumn(): DLXNode {
    let minSize = Infinity;
    let chosenColumn = this.header.right;

    let column = this.header.right;
    while (column !== this.header) {
      if (column.size! < minSize) {
        minSize = column.size!;
        chosenColumn = column;
      }
      column = column.right;
    }

    return chosenColumn;
  }

  private cover(column: DLXNode): void {
    column.right.left = column.left;
    column.left.right = column.right;

    let row = column.down;
    while (row !== column) {
      let j = row.right;
      while (j !== row) {
        j.down.up = j.up;
        j.up.down = j.down;
        j.column!.size!--;
        j = j.right;
      }
      row = row.down;
    }
  }

  private uncover(column: DLXNode): void {
    let row = column.up;
    while (row !== column) {
      let j = row.left;
      while (j !== row) {
        j.column!.size!++;
        j.down.up = j;
        j.up.down = j;
        j = j.left;
      }
      row = row.up;
    }
    column.right.left = column;
    column.left.right = column;
  }

  private getRowNode(rowId: number): DLXNode {
    let column = this.header.right;
    while (column !== this.header) {
      let row = column.down;
      while (row !== column) {
        if (row.rowId === rowId) {
          return row;
        }
        row = row.down;
      }
      column = column.right;
    }
    throw new Error(`Row ${rowId} not found`);
  }

  getSolution(): number[][] {
    if (!this.solutionFound) {
      return this.board;
    }

    const result = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0));

    this.solution.forEach((rowId) => {
      if (rowId !== undefined) {
        const row = Math.floor(rowId / 81);
        const col = Math.floor((rowId % 81) / 9);
        const num = (rowId % 9) + 1;
        result[row][col] = num;
      }
    });

    return result;
  }
}

class DLXNode {
  left: DLXNode;
  right: DLXNode;
  up: DLXNode;
  down: DLXNode;
  column?: DLXNode;
  size?: number;
  name?: number;
  rowId?: number;

  constructor() {
    this.left = this;
    this.right = this;
    this.up = this;
    this.down = this;
  }
}
```

## Step-by-Step Example

Let's solve a simple Sudoku puzzle:

### Initial Board

```
5 3 0 | 0 7 0 | 0 0 0
6 0 0 | 1 9 5 | 0 0 0
0 9 8 | 0 0 0 | 0 6 0
------+-------+------
8 0 0 | 0 6 0 | 0 0 3
4 0 0 | 8 0 3 | 0 0 1
7 0 0 | 0 2 0 | 0 0 6
------+-------+------
0 6 0 | 0 0 0 | 2 8 0
0 0 0 | 4 1 9 | 0 0 5
0 0 0 | 0 8 0 | 0 7 9
```

### Step 1: Constraint Propagation

- Cell (0,2): Only 4 possible (eliminates from row, column, box)
- Cell (1,1): Only 7 possible (naked single)
- Cell (2,0): Only 1 possible (hidden single in box)

### Step 2: After Initial Propagation

```
5 3 4 | 6 7 8 | 9 1 2
6 7 2 | 1 9 5 | 3 4 8
1 9 8 | 3 4 2 | 5 6 7
------+-------+------
8 5 9 | 7 6 1 | 4 2 3
4 2 6 | 8 5 3 | 7 9 1
7 1 3 | 9 2 4 | 8 5 6
------+-------+------
9 6 1 | 5 3 7 | 2 8 4
2 8 7 | 4 1 9 | 6 3 5
3 4 5 | 2 8 6 | 1 7 9
```

## Advanced Applications

### 1. Sudoku Generator

```typescript
class SudokuGenerator {
  private solver: OptimizedSudokuSolver;

  generatePuzzle(
    difficulty: "easy" | "medium" | "hard" | "expert"
  ): number[][] {
    const fullGrid = this.generateFullGrid();
    return this.removeCells(fullGrid, difficulty);
  }

  private generateFullGrid(): number[][] {
    const emptyGrid = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0));

    this.fillDiagonal(emptyGrid);

    this.solver = new OptimizedSudokuSolver(emptyGrid);
    this.solver.solve();

    return this.solver.getSolution();
  }

  private fillDiagonal(grid: number[][]): void {
    for (let box = 0; box < 9; box += 3) {
      this.fillBox(grid, box, box);
    }
  }

  private fillBox(grid: number[][], row: number, col: number): void {
    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let index = 0;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        grid[row + i][col + j] = numbers[index++];
      }
    }
  }

  private removeCells(grid: number[][], difficulty: string): number[][] {
    const result = grid.map((row) => [...row]);
    const cellsToRemove = this.getCellsToRemove(difficulty);
    const positions = this.getAllPositions();
    this.shuffleArray(positions);

    let removed = 0;
    for (const [row, col] of positions) {
      if (removed >= cellsToRemove) break;

      const backup = result[row][col];
      result[row][col] = 0;

      const testSolver = new OptimizedSudokuSolver(result);
      if (testSolver.countSolutions() === 1) {
        removed++;
      } else {
        result[row][col] = backup;
      }
    }

    return result;
  }

  private getCellsToRemove(difficulty: string): number {
    const ranges = {
      easy: [36, 46],
      medium: [46, 52],
      hard: [52, 58],
      expert: [58, 64],
    };

    const [min, max] = ranges[difficulty];
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  private getAllPositions(): Array<[number, number]> {
    const positions: Array<[number, number]> = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        positions.push([i, j]);
      }
    }
    return positions;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
```

### 2. Sudoku Validator

```typescript
class SudokuValidator {
  private readonly SIZE = 9;
  private readonly BOX_SIZE = 3;

  isValidSudoku(board: (number | string)[][]): boolean {
    return this.isValidComplete(board) || this.isValidPartial(board);
  }

  private isValidComplete(board: (number | string)[][]): boolean {
    for (let i = 0; i < this.SIZE; i++) {
      if (
        !this.isValidRow(board, i) ||
        !this.isValidColumn(board, i) ||
        !this.isValidBox(board, Math.floor(i / 3) * 3, (i % 3) * 3)
      ) {
        return false;
      }
    }
    return true;
  }

  private isValidPartial(board: (number | string)[][]): boolean {
    const seen = new Set<string>();

    for (let i = 0; i < this.SIZE; i++) {
      for (let j = 0; j < this.SIZE; j++) {
        const value = board[i][j];
        if (value !== 0 && value !== "." && value !== "") {
          const rowKey = `row${i}-${value}`;
          const colKey = `col${j}-${value}`;
          const boxKey = `box${
            Math.floor(i / 3) * 3 + Math.floor(j / 3)
          }-${value}`;

          if (seen.has(rowKey) || seen.has(colKey) || seen.has(boxKey)) {
            return false;
          }

          seen.add(rowKey);
          seen.add(colKey);
          seen.add(boxKey);
        }
      }
    }

    return true;
  }

  private isValidRow(board: (number | string)[][], row: number): boolean {
    const seen = new Set<number | string>();

    for (let col = 0; col < this.SIZE; col++) {
      const value = board[row][col];
      if (value !== 0 && value !== "." && value !== "") {
        if (seen.has(value)) {
          return false;
        }
        seen.add(value);
      }
    }

    return true;
  }

  private isValidColumn(board: (number | string)[][], col: number): boolean {
    const seen = new Set<number | string>();

    for (let row = 0; row < this.SIZE; row++) {
      const value = board[row][col];
      if (value !== 0 && value !== "." && value !== "") {
        if (seen.has(value)) {
          return false;
        }
        seen.add(value);
      }
    }

    return true;
  }

  private isValidBox(
    board: (number | string)[][],
    startRow: number,
    startCol: number
  ): boolean {
    const seen = new Set<number | string>();

    for (let i = 0; i < this.BOX_SIZE; i++) {
      for (let j = 0; j < this.BOX_SIZE; j++) {
        const value = board[startRow + i][startCol + j];
        if (value !== 0 && value !== "." && value !== "") {
          if (seen.has(value)) {
            return false;
          }
          seen.add(value);
        }
      }
    }

    return true;
  }

  findErrors(
    board: (number | string)[][]
  ): Array<{ row: number; col: number; error: string }> {
    const errors: Array<{ row: number; col: number; error: string }> = [];

    for (let i = 0; i < this.SIZE; i++) {
      for (let j = 0; j < this.SIZE; j++) {
        const value = board[i][j];
        if (value !== 0 && value !== "." && value !== "") {
          if (!this.isValidPlacement(board, i, j, value)) {
            errors.push({
              row: i,
              col: j,
              error: this.getErrorDescription(board, i, j, value),
            });
          }
        }
      }
    }

    return errors;
  }

  private isValidPlacement(
    board: (number | string)[][],
    row: number,
    col: number,
    value: number | string
  ): boolean {
    const originalValue = board[row][col];
    board[row][col] = 0;

    const valid = !this.hasConflict(board, row, col, value);

    board[row][col] = originalValue;
    return valid;
  }

  private hasConflict(
    board: (number | string)[][],
    row: number,
    col: number,
    value: number | string
  ): boolean {
    for (let i = 0; i < this.SIZE; i++) {
      if (board[row][i] === value || board[i][col] === value) {
        return true;
      }
    }

    const boxRow = Math.floor(row / this.BOX_SIZE) * this.BOX_SIZE;
    const boxCol = Math.floor(col / this.BOX_SIZE) * this.BOX_SIZE;

    for (let i = boxRow; i < boxRow + this.BOX_SIZE; i++) {
      for (let j = boxCol; j < boxCol + this.BOX_SIZE; j++) {
        if (board[i][j] === value) {
          return true;
        }
      }
    }

    return false;
  }

  private getErrorDescription(
    board: (number | string)[][],
    row: number,
    col: number,
    value: number | string
  ): string {
    const conflicts: string[] = [];

    for (let i = 0; i < this.SIZE; i++) {
      if (i !== col && board[row][i] === value) {
        conflicts.push(`row conflict at column ${i}`);
      }
      if (i !== row && board[i][col] === value) {
        conflicts.push(`column conflict at row ${i}`);
      }
    }

    const boxRow = Math.floor(row / this.BOX_SIZE) * this.BOX_SIZE;
    const boxCol = Math.floor(col / this.BOX_SIZE) * this.BOX_SIZE;

    for (let i = boxRow; i < boxRow + this.BOX_SIZE; i++) {
      for (let j = boxCol; j < boxCol + this.BOX_SIZE; j++) {
        if ((i !== row || j !== col) && board[i][j] === value) {
          conflicts.push(`box conflict at (${i}, ${j})`);
        }
      }
    }

    return conflicts.join(", ");
  }
}
```

## Performance Optimization Techniques

### 1. Bitmasking for Candidates

```typescript
class BitMaskSudokuSolver {
  private board: number[][];
  private rowMask: number[];
  private colMask: number[];
  private boxMask: number[];

  constructor(board: number[][]) {
    this.board = board.map((row) => [...row]);
    this.rowMask = new Array(9).fill(0);
    this.colMask = new Array(9).fill(0);
    this.boxMask = new Array(9).fill(0);

    this.initializeMasks();
  }

  private initializeMasks(): void {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.board[row][col] !== 0) {
          const num = this.board[row][col];
          const bit = 1 << (num - 1);

          this.rowMask[row] |= bit;
          this.colMask[col] |= bit;
          this.boxMask[this.getBoxIndex(row, col)] |= bit;
        }
      }
    }
  }

  private getBoxIndex(row: number, col: number): number {
    return Math.floor(row / 3) * 3 + Math.floor(col / 3);
  }

  solve(): boolean {
    const cell = this.findEmptyCell();
    if (!cell) return true;

    const [row, col] = cell;
    const candidates = this.getCandidates(row, col);

    for (let num = 1; num <= 9; num++) {
      if (candidates & (1 << (num - 1))) {
        this.placeNumber(row, col, num);

        if (this.solve()) {
          return true;
        }

        this.removeNumber(row, col, num);
      }
    }

    return false;
  }

  private getCandidates(row: number, col: number): number {
    const boxIndex = this.getBoxIndex(row, col);
    const usedMask =
      this.rowMask[row] | this.colMask[col] | this.boxMask[boxIndex];
    return ~usedMask & 0x1ff;
  }

  private placeNumber(row: number, col: number, num: number): void {
    this.board[row][col] = num;
    const bit = 1 << (num - 1);

    this.rowMask[row] |= bit;
    this.colMask[col] |= bit;
    this.boxMask[this.getBoxIndex(row, col)] |= bit;
  }

  private removeNumber(row: number, col: number, num: number): void {
    this.board[row][col] = 0;
    const bit = 1 << (num - 1);

    this.rowMask[row] &= ~bit;
    this.colMask[col] &= ~bit;
    this.boxMask[this.getBoxIndex(row, col)] &= ~bit;
  }

  private findEmptyCell(): [number, number] | null {
    let bestCell: [number, number] | null = null;
    let minCandidates = 10;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.board[row][col] === 0) {
          const candidateCount = this.countBits(this.getCandidates(row, col));
          if (candidateCount < minCandidates) {
            minCandidates = candidateCount;
            bestCell = [row, col];

            if (candidateCount === 1) {
              return bestCell;
            }
          }
        }
      }
    }

    return bestCell;
  }

  private countBits(mask: number): number {
    let count = 0;
    while (mask) {
      count += mask & 1;
      mask >>= 1;
    }
    return count;
  }
}
```

## Comparison with Other Constraint Satisfaction Problems

| Problem        | Variables   | Domain Size | Constraints | Typical Solving Time |
| -------------- | ----------- | ----------- | ----------- | -------------------- |
| Sudoku         | 81          | 1-9         | 324         | Milliseconds         |
| N-Queens       | N           | N positions | O(N²)       | Seconds (N=20)       |
| Graph Coloring | V vertices  | K colors    | E edges     | Varies greatly       |
| SAT Problem    | N variables | {0,1}       | M clauses   | NP-Complete          |

## Practice Problems

### LeetCode Problems

1. **[37. Sudoku Solver](https://leetcode.com/problems/sudoku-solver/)** - Direct implementation
2. **[36. Valid Sudoku](https://leetcode.com/problems/valid-sudoku/)** - Validation logic
3. **[980. Unique Paths III](https://leetcode.com/problems/unique-paths-iii/)** - Similar backtracking

### Advanced Challenges

1. **Multi-Sudoku**: Solve overlapping Sudoku grids
2. **Killer Sudoku**: Additional sum constraints
3. **Diagonal Sudoku**: Additional diagonal constraints
4. **Irregular Sudoku**: Non-standard region shapes

## Key Insights for Interviews

1. **Constraint Propagation**: Essential for practical performance
2. **Heuristic Selection**: Choose cells with fewest candidates first
3. **Early Termination**: Detect contradictions quickly
4. **Space Optimization**: Use bitmasks for better performance
5. **Problem Reduction**: Simplify before backtracking

## Related Algorithms

- **[N-Queens](./n-queens.md)** - Another classic backtracking problem
- **[Graph Coloring](../graph/graph-coloring.md)** - Similar constraint satisfaction
- **[Subset Sum](./subset-sum.md)** - Backtracking with different constraints
- **[Dancing Links](../advanced/dancing-links.md)** - Exact cover algorithm for Sudoku

The Sudoku Solver demonstrates the power of combining backtracking with intelligent constraint propagation, transforming a potentially exponential search into a tractable problem through strategic pruning and heuristics.
