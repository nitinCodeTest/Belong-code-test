export interface GridCell {
    isSelected: boolean,
    cellId?: any,
    toggleCell: any
}

export interface Cell {
    row: number,
    col: number,
    selected: boolean
}

export interface CellCoordinates {
    position: string[],
    isAlive: boolean,
}

export interface CellValue {
    position: string,
    value: boolean,
}