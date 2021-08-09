import React, { useState, useEffect } from 'react';
import GridCell from './../grid-cell/grid-cell.component';
import { Cell, CellCoordinates, CellValue } from './../../interfaces/grid-interfaces';
import * as _ from 'lodash';

export default function GridMultiplier() {
    const [gridTwoDimesionalData, setDataRefresh] = useState({});
    const gridRef: any = React.useRef<HTMLTableElement>();
    const gridSize = 6;

    const getGridArray = () => {
        let twoDimesionalArray: Cell[] = [];
        for (let i = 1; i <= gridSize; i++) {
            for (let j = 1; j <= gridSize; j++) {
                twoDimesionalArray.push({ row: i, col: j, selected: false });
            }
        }
        // align created grid with respective x/y cordinates for render as array
        setDataRefresh(_.groupBy(twoDimesionalArray, (cell) => cell.row));
    }

    useEffect(() => {
        getGridArray()
    }, [])

    const getCellId = (selectedCell: Object | any) => {
        let id = selectedCell?.dataset?.id.split('-');
        return id && isCellWithinMatrix(id);
    }

    // check if adjacent cells are out of bounds of given grid
    const isCellWithinMatrix = (position: string[]) => {
        if (parseInt(position[0]) > 0 && parseInt(position[0]) <= gridSize && parseInt(position[1]) > 0 && parseInt(position[1]) <= gridSize) {
            return { position: [parseInt(position[0]), parseInt(position[1])], isAlive: isCellAlive(position) };
        }
    }

    const isCellAlive = (position: string[]) => {
        let cellId = position[0] + '-' + position[1];
        const cellStatus = gridRef.current.querySelectorAll("td[data-id=" + CSS.escape(cellId) + "].selected-cell");
        return cellStatus && cellStatus.length === 1;
    }


    const getNextGenerationPattern = () => {
        const allCells = gridRef.current.querySelectorAll('td');
        let adjacentLocationIds: Array<object>[] = [];
        let newData: CellValue[] = [];
        // for given cell, get hold of all adjacent cells and their current status 
        allCells.forEach((selectedCell: object | any) => {
            let adjacentCell = [];
            let cellId = getCellId(selectedCell);
            let left = getCellId(selectedCell.previousSibling);
            let right = getCellId(selectedCell.nextSibling);
            let top = cellId?.position && isCellWithinMatrix([cellId.position[0] - 1, cellId.position[1]]);
            let topLeft = top?.position && isCellWithinMatrix([top.position[0], top.position[1] - 1]);
            let topRight = top?.position && isCellWithinMatrix([top.position[0], top.position[1] + 1]);
            let bottom = cellId?.position && isCellWithinMatrix([cellId.position[0] + 1, cellId.position[1]]);
            let bottomLeft = bottom?.position && isCellWithinMatrix([bottom.position[0], bottom.position[1] - 1]);
            let bottomRight = bottom?.position && isCellWithinMatrix([bottom.position[0], bottom.position[1] + 1]);
            adjacentCell = [cellId, left, right, top, topLeft, topRight, bottom, bottomLeft, bottomRight];
            adjacentCell = adjacentCell.filter((values: CellCoordinates) => !_.isEmpty(values));
            adjacentLocationIds.push(adjacentCell);
        });
        // update elements based on cluster rule for next generation requirement
        adjacentLocationIds.forEach((cluster: CellCoordinates[] | any) => {
            let currentCell = cluster[0];
            let checkAdjacentLiveCells = cluster.filter((x: CellCoordinates, index: number) => x && index !== 0 && x.isAlive)?.length
            if ((checkAdjacentLiveCells === 2 || checkAdjacentLiveCells === 3)) {
                if (currentCell.isAlive) {
                    newData.push({ position: currentCell[0] + '-' + currentCell[1], value: true });
                } else if (!currentCell.isAlive && checkAdjacentLiveCells === 3) {
                    //empty Cell with exactly 3 live neighbours "comes to life"
                    newData.push({ position: currentCell.position[0] + '-' + currentCell.position[1], value: true });
                } else {
                    newData.push({ position: currentCell.position[0] + '-' + currentCell.position[1], value: false })
                }
            } else if (checkAdjacentLiveCells > 3) {
                newData.push({ position: currentCell.position[0] + '-' + currentCell.position[1], value: false })
            } else {
                //cell with fewer than two live neighbours dies of under-population
                newData.push({ position: currentCell.position[0] + '-' + currentCell.position[1], value: false })
            }
        });
        updateCellColor(newData);
    }

    const toggleCellManually = (event: React.MouseEvent<HTMLElement> | any) => {
        const isSelected = event.target.className === 'selected-cell';
        updateCellColor([{ position: event.target.dataset.id, value: !isSelected }]);
    }

    // finds cells using data-id and set/ reset color according to value
    const updateCellColor = (updatedCells: CellValue[]) => {
        updatedCells.forEach((item: CellValue) => {
            let position = item.position.split('-');
            _.find(_.flatMap(gridTwoDimesionalData), (cell: Cell) => {
                if (cell.row === parseInt(position[0]) && cell.col === parseInt(position[1])) {
                    cell.selected = item.value;
                    return cell
                }
            })
        });
        setDataRefresh({ ...gridTwoDimesionalData });
    }

    return (
        <div className="cell-grid">
            <h3>Belong - Assignment</h3>
            <table ref={gridRef}>
                <tbody>
                    {
                        Object.entries(gridTwoDimesionalData).map((rowData: any[], index) =>
                            <tr className="grid-row" key={'row' + index}>
                                {
                                    rowData[1].map((cell: { row: string, col: string, selected: boolean }) =>
                                        <GridCell isSelected={cell['selected']} toggleCell={toggleCellManually} key={cell['row'] + ',' + cell['col']} cellId={cell['row'] + '-' + cell['col']}></GridCell>
                                    )
                                }
                            </tr>
                        )
                    }
                </tbody>
            </table>
            <div className="action-buttons">
                <button onClick={() => getGridArray()}>Reset Grid</button>
                <button onClick={() => getNextGenerationPattern()}>Next Generation</button>
            </div>
            <i>Functionality has been tested according to test guide provided in assignment email <a target="blank" href='https://user-images.githubusercontent.com/7149052/53603476-bfb00e00-3c05-11e9-8862-1dfd31836dcd.jpg'>expected behaviour</a> link.</i>
        </div>
    );
}
