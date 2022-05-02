// function takes in the ID string to be checked and
// matches it against a standard id of a Note object text-area assumed to be *-note
export function regexCheckIdIsNote(id) {
  const regex = new RegExp(/^\d+-note$/);
  const check = regex.test(id);

  return check;
}

export function sortArray(array) {
  if (array[0] !== undefined) {
    const sortedArray = array.slice().sort(function (a, b) {
      if (a.last_updated > b.last_updated) return -1;
      else if (a.last_updated < b.last_updated) return 1;
      else return 0;
    });

    return sortedArray;
  } else return [];
}
