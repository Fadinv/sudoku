export type SudokuElement = {
    value: number
    position: {
        i: number
        j: number
        square: number
    }
    visible: boolean
    visibleOnTable: boolean
    possibleValues: number[] | undefined
}

export type ReverseArrayResponse = {
    mixSudokuArray: () => MixSudokuArrayResponse
    arr: any[][]
}

export type GetInitialValuesResponse = {
    mixSudokuArray: () => MixSudokuArrayResponse
    arr: number[][]
}

export type MixSudokuArrayResponse = {
    reverse: () => ReverseArrayResponse
    arr: number[][]
}

export type ArrangeElementsResponse = {
    rows: SudokuElement[][]
    columns: SudokuElement[][]
    circles: SudokuElement[][]
}

export const mixArray = (initialArr: any[]): number[][] => {

    const array = initialArr

    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }

    return array
}

export const getSquareIndex = (i: number, j: number): number => {

    let square: number = 0

    if (+i >= 3 && +i <= 5) {
        square += 3
    } else if (+i >= 6 && +i <= 8) {
        square += 6
    }
    if (+j >= 3 && +j <= 5) {
        square += 1
    } else if (+j >= 6 && +j <= 8) {
        square += 2
    }

    return square
}

export const reverseArray = (arr: any[][]): ReverseArrayResponse => {

    const newArray: number[][] = [[], [], [], [], [], [], [], [], []]

    for (let i in arr) {
        for (let j in arr) {
            newArray[j].push(arr[i][j])
        }
    }

    return {
        mixSudokuArray: () => {
            return mixSudokuArray(newArray)
        },
        arr: newArray,
    }
}

const mixSudokuArray = (arr: number[][]): MixSudokuArrayResponse => {

    const mixAllBlocks = mixArray([mixArray(arr.slice(0, 3)), mixArray(arr.slice(3, 6)), mixArray(arr.slice(6, 9))])

    const newArr: number[][] = Array.prototype.concat(mixAllBlocks[0], mixAllBlocks[1], mixAllBlocks[2])

    return {
        reverse: () => {
            return reverseArray(newArr)
        },
        arr: newArr,
    }
}

export const getInitialValues = (): GetInitialValuesResponse => {

    const initialArr: number[][] = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6, 7, 8],
    ]

    return {
        mixSudokuArray: () => {
            return mixSudokuArray(initialArr)
        },
        arr: initialArr,
    }
}

export const makeObjectsFromSudokuArray = (arr: number[][]): SudokuElement[][] => {

    const responseArray = [[], [], [], [], [], [], [], [], []] as SudokuElement[][]

    for (let i in arr) {
        for (let j in arr) {

            const square = getSquareIndex(+i, +j)

            responseArray[i].push({
                position: {
                    i: +i,
                    j: +j,
                    square: square,
                },
                value: arr[i][j],
                visible: true,
                visibleOnTable: true,
                possibleValues: undefined,
            })
        }
    }

    return responseArray
}

export const arrangeElements = (arr: SudokuElement[][]): ArrangeElementsResponse => {

    const rows = arr
    const columns = reverseArray(arr).arr
    const circles = [[], [], [], [], [], [], [], [], []] as SudokuElement[][]

    for (let i in arr) {

        for (let j in arr) {
            const square = getSquareIndex(+i, +j)

            circles[square].push(arr[i][j])
        }
    }

    return {
        rows,
        columns,
        circles,
    }
}

export const isOnlyOneDecision = (rows: SudokuElement[][], columns: SudokuElement[][]): boolean => {

    const checkedRows = JSON.parse(JSON.stringify(rows))
    const checkedColumns = JSON.parse(JSON.stringify(columns))

    const checkedRowsArray = [[], [], [], [], [], [], [], [], []] as number[][]
    const checkedColumnsArray = [[], [], [], [], [], [], [], [], []] as number[][]
    const checkedCirclesArray = [[], [], [], [], [], [], [], [], []] as number[][]

    for (let i in checkedRows) {

        for (let j in checkedColumns) {

            if (!checkedRows[+i][+j].visible) continue
            const square = getSquareIndex(+i, +j)

            checkedRowsArray[+i].push(checkedRows[+i][+j].value)
            checkedColumnsArray[+j].push(checkedRows[+i][+j].value)
            checkedCirclesArray[square].push(checkedRows[+i][+j].value)
        }
    }

    let nextIteration = true

    const checkElement = (element: SudokuElement): void => {

        let possibleValues: number[] = element.possibleValues || []

        if (possibleValues.length === 0) {
            for (let i = 1; i <= 9; i++) {

                if (
                    !checkedRowsArray[element.position.i].includes(i)
                    && !checkedColumnsArray[element.position.j].includes(i)
                    && !checkedCirclesArray[element.position.square].includes(i)
                ) {
                    possibleValues.push(i)
                    if (!nextIteration) nextIteration = true
                }
            }
        } else {
            for (let i of possibleValues) {

                if (
                    checkedRowsArray[element.position.i].includes(i)
                    || checkedColumnsArray[element.position.j].includes(i)
                    || checkedCirclesArray[element.position.square].includes(i)
                ) {
                    possibleValues = possibleValues.filter((value) => value !== i)
                    if (!nextIteration) nextIteration = true
                }
            }
        }

        element.possibleValues = possibleValues

        if (possibleValues.length === 1) {
            checkedRowsArray[element.position.i].push(element.value)
            checkedColumnsArray[element.position.j].push(element.value)
            checkedCirclesArray[element.position.square].push(element.value)
            if (!nextIteration) nextIteration = true
            element.visible = true
        }
    }


    const next = (): boolean => {

        if (!nextIteration) return false

        let checked: number = 0
        nextIteration = false

        for (let i in checkedRows) {

            for (let j in checkedColumns) {

                if (checkedRows[+i][+j].visible) {
                    checked++
                    if (checked >= 80) return true
                    continue
                }

                checkElement(checkedRows[+i][+j])
            }
        }

        return next()
    }

    return next()
}

export const getRandomIndexFromArray = (rows: SudokuElement[][]) => {

    const arr: SudokuElement[] = []

    for (let i in rows) {

        for (let j in rows) {
            if (rows[i][j].visible && arrayIndexes[+i] !== +j) arr.push(rows[i][j])
        }
    }

    const random = Math.round(Math.random() * (arr.length - 1))

    return {
        i: arr[random].position.i,
        j: arr[random].position.j,
    }
}

export const arrayIndexes: any = {}


export const recurseAddDifficult = (
    rows: SudokuElement[][],
    columns: SudokuElement[][],
    circles: SudokuElement[][],
    difficult: number,
    allElements: number,
    tryCounter: number,
): void => {

    if (difficult === allElements) return

    const random = getRandomIndexFromArray(rows)

    if (!rows[random.i][random.j].visible) {
        recurseAddDifficult(rows, columns, circles, difficult, allElements, tryCounter)
        return
    }

    rows[random.i][random.j].visible = false
    rows[random.i][random.j].visibleOnTable = false
    columns[random.j][random.i].visible = false
    columns[random.j][random.i].visibleOnTable = false
    difficult++

    const onlyOneDecision = isOnlyOneDecision(rows, columns)

    if (!onlyOneDecision) {
        tryCounter += 1
        if (tryCounter >= 10) return
    }

    if (onlyOneDecision && difficult !== allElements) {
        recurseAddDifficult(rows, columns, circles, difficult, allElements, tryCounter)
    } else if (!onlyOneDecision && difficult !== allElements) {
        rows[random.i][random.j].visible = true
        rows[random.i][random.j].visibleOnTable = true
        columns[random.j][random.i].visible = true
        columns[random.j][random.i].visibleOnTable = true

        arrayIndexes[random.i] = random.j
        difficult--

        recurseAddDifficult(rows, columns, circles, difficult, allElements, tryCounter)
    }
}

export const makePlayground = (arr: ArrangeElementsResponse, visibleValues: number): ArrangeElementsResponse => {

    let tryCounter: number = 0

    recurseAddDifficult(
        arr.rows,
        arr.columns,
        arr.circles,
        visibleValues,
        arr.rows.length * arr.columns.length,
        tryCounter,
    )

    return arr
}