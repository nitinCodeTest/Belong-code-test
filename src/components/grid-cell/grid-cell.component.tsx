import React from 'react';
import { GridCell } from './../../interfaces/grid-interfaces'

export default function GridCellComponent({ isSelected, cellId, toggleCell }: GridCell) {
    return (
        <td
            className={isSelected ? "selected-cell" : "unselected-cell"}
            onClick={toggleCell}
            data-id={cellId}
        ></td>
    );
}