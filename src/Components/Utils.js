import { NOTE_ID } from "../Constants/index";
// function takes in the ID string to be checked and
// matches it against a standard id of a Note object text-area assumed to be *-note
export function regexCheckIdIsNote(id) {
  let exp = "^\\d+" + NOTE_ID + "$";
  const regex = new RegExp(exp);
  // const regex = new RegExp(/^\d+-note$/);
  const check = regex.test(id);

  return check;
}

export function sortArray2(array) {
  if (array[0] !== undefined) {
    const sortedArray = array.slice().sort(function (a, b) {
      if (a.last_updated > b.last_updated) return -1;
      else if (a.last_updated < b.last_updated) return 1;
      else return 0;
    });

    return sortedArray;
  } else return [];
}
// sort the array
// 2nd argument: the object key as a string for which the array will be sorted by
export function sortArray(array, str) {
  if (array[0] !== undefined) {
    const sortedArray = array.slice().sort(function (a, b) {
      if (a[str] > b[str]) return -1;
      else if (a[str] < b[str]) return 1;
      else return 0;
    });

    return sortedArray;
  } else return [];
}
