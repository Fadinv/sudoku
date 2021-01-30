export type SudokuElement = {
    value: number
    position: {
        i: number
        j: number
        square: number
    }
    visible: boolean
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
    makeObjectsFromSudokuArray: () => makeObjectsFromSudokuArrayResponse
    reverse: () => ReverseArrayResponse
    arr: number[][]
}

export type ArrangedElements = {
    rows: SudokuElement[][]
    columns: SudokuElement[][]
    circles: SudokuElement[][]
}

export type ArrangeElementsResponse = {
    makePlayground: (difficult: number) => ArrangedElements
    arr: ArrangedElements
}

export type makeObjectsFromSudokuArrayResponse = {
    arrangeElements: () => ArrangeElementsResponse
    arr: SudokuElement[][]
}

/* Рандомное перемешивание массива */
export const mixArray = (initialArr: any[]): number[][] => {

    const array = initialArr

    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }

    return array
}


/* Из входных значений координат высчитываем индекс квадрата */
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


/* Переписывает строки в столбцы, получаем реверсионный массив с функцией сортировки */
export const reverseArray = (arr: any[][]): ReverseArrayResponse => {

    const responseArr: number[][] = [[], [], [], [], [], [], [], [], []]

    for (let i in arr) {
        for (let j in arr) {
            responseArr[j].push(arr[i][j])
        }
    }

    return {
        mixSudokuArray: () => {
            return mixSudokuArray(responseArr)
        },
        arr: responseArr,
    }
}

/* Принимает массив массивов и сортирует его по строкам с сохранением целостности решения */
const mixSudokuArray = (arr: number[][]): MixSudokuArrayResponse => {
    console.log(arr)
    const mixAllBlocks = mixArray([mixArray(arr.slice(0, 3)), mixArray(arr.slice(3, 6)), mixArray(arr.slice(6, 9))])
    console.log(mixAllBlocks)
    const responseArr: number[][] = Array.prototype.concat(mixAllBlocks[0], mixAllBlocks[1], mixAllBlocks[2])

    console.log(responseArr)

    return {
        makeObjectsFromSudokuArray: () => {
            return makeObjectsFromSudokuArray(responseArr)
        },
        reverse: () => {
            return reverseArray(responseArr)
        },
        arr: responseArr,
    }
}

/* Получаем исходный массив с функцией сортировки по строкам */
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

/* Из входного массива создаем массив объектов элементов судоку */
export const makeObjectsFromSudokuArray = (arr: number[][]): makeObjectsFromSudokuArrayResponse => {

    const responseArr = [[], [], [], [], [], [], [], [], []] as SudokuElement[][]

    for (let i in arr) {
        for (let j in arr) {

            const square = getSquareIndex(+i, +j)

            responseArr[i].push({
                position: {
                    i: +i,
                    j: +j,
                    square: square,
                },
                value: arr[i][j],
                visible: true,
                possibleValues: undefined,
            })
        }
    }

    return {
        arrangeElements: () => {
            return arrangeElements(responseArr)
        },
        arr: responseArr,
    }
}

/* Из строк составляем столбцы и квадраты */
export const arrangeElements = (array: SudokuElement[][]): ArrangeElementsResponse => {

    const rows = array
    const columns = reverseArray(array).arr as SudokuElement[][]
    const circles = [[], [], [], [], [], [], [], [], []] as SudokuElement[][]

    for (let i in array) {

        for (let j in array) {
            const square = getSquareIndex(+i, +j)

            circles[square].push(array[i][j])
        }
    }

    const responseArray = {
        rows: Array.prototype.concat(rows),
        columns: Array.prototype.concat(columns),
        circles: Array.prototype.concat(circles),
    }

    return {
        makePlayground: (difficult) => {
            return makePlayground(responseArray, difficult)
        },
        arr: responseArray,
    }
}

/* функция возвращает true - если есть примитивное единственное решение, false - если такого решения нет  */
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

    /* функция проверяет какие решения имеет элемент, с учетом только строк, столбцов и квадратов */
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

    /* функция пробегает по каждому элементу судоку и вызывает проверку на элементах, если это необходимо */
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

/* выдает рандомное значение с учетом тех элементов, которые мы уже проверяли и получили не единственное решение */
export const getRandomIndexFromArray = (rows: SudokuElement[][], usedIndexes: any) => {

    const arr: SudokuElement[] = []

    for (let i in rows) {

        for (let j in rows) {
            if (rows[i][j].visible && !usedIndexes[i + j]) arr.push(rows[i][j])
        }
    }

    const random = Math.round(Math.random() * (arr.length - 1))

    if (arr[random] === undefined) return undefined

    return {
        i: arr[random].position.i,
        j: arr[random].position.j,
    }
}

/* Рекурсия. Каждый шаг удаляет одну ячейку и проверяет судоку на единственность решения */
export const recurseAddDifficult = (
    arr: ArrangedElements,
    difficult: number,
    allElements: number,
    tryCounter: number,
    usedIndexes: any,
): void => {

    if (difficult === allElements) return

    const random = getRandomIndexFromArray(arr.rows, usedIndexes)

    if (random === undefined) return

    if (!arr.rows[random.i][random.j].visible) {
        recurseAddDifficult(arr, difficult, allElements, tryCounter, usedIndexes)
        return
    }

    arr.rows[random.i][random.j].visible = false
    arr.columns[random.j][random.i].visible = false
    difficult++

    const onlyOneDecision = isOnlyOneDecision(arr.rows, arr.columns)

    if (!onlyOneDecision) {
        tryCounter += 1
        if (tryCounter >= 100) return
    }

    if (onlyOneDecision && difficult !== allElements) {
        recurseAddDifficult(arr, difficult, allElements, tryCounter, usedIndexes)
    } else if (!onlyOneDecision && difficult !== allElements) {
        arr.rows[random.i][random.j].visible = true
        arr.columns[random.j][random.i].visible = true

        usedIndexes[random.i.toString() + random.j.toString()] = true
        difficult--

        recurseAddDifficult(arr, difficult, allElements, tryCounter, usedIndexes)
    }
}

/* входная точка для генерации судоку */
export const makePlayground = (arr: ArrangedElements, difficult: number): ArrangedElements => {

    const responseArray = Object.assign(arr, {})

    let tryCounter: number = 0
    const usedIndexes: any = {}

    /* Удаляем элементы судоку пока это возможно */
    recurseAddDifficult(
        responseArray,
        difficult,
        responseArray.rows.length * responseArray.columns.length,
        tryCounter,
        usedIndexes,
    )

    return responseArray
}