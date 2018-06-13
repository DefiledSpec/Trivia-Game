//Recursion
let unsorted = [4, 6, 23,132, 12, 233, 22, 1123, 66, 443, 234, 33, 223, 12, 43, 64, 5544, 33, 1, 23, 55, 2, 2, 2, 2, 2]
console.log(quickSort(unsorted));
function quickSort(data) {
    if(data.length < 1) {
        return data;
    }
    let pivot = data[data.length - 1];
    let left = [];
    let right = [];
    // console.log(left, right)
    for(let i = 0; i < data.length - 1; i++) {
        if(data[i] < pivot) {
            left.push(data[i]);
        }else{
            right.push(data[i])
        }
    }
    console.log([...left, pivot, ...right])
    return [...quickSort(left), pivot, ...quickSort(right)];

}