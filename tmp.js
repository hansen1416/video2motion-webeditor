/**
 * binary search algorithm
 * @param {Array} arr 
 * @param {number} target 
 * @returns 
 */
function binarySearch (arr, target) {

    let low = 0;
    let high = arr.length - 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (arr[mid] === target) return mid; // Found at the middle
        else if (arr[mid] < target) low = mid + 1; // Search in the right half
        else high = mid - 1; // Search in the left half
    }
    // If not found, return the insertion index (between elements)
    return low;
}

/**
 * insert a number into a sorted array, keeping it sorted
 * @param {number[]} arr 
 * @param {number} num 
 * @returns 
 */
function insertIntoSortedArray (arr, num) {
    const insertionIndex = binarySearch(arr, num);
    arr.splice(insertionIndex, 0, num);
    return arr;
}

const sortedArray = [-77, -8, -2, 0, 1, 8, 243, 42342];
const numberToInsert = 9;

const newArray = insertIntoSortedArray(sortedArray, numberToInsert);
console.log(newArray); // Output: [1, 3, 4, 5, 7]