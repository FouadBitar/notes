// checks if id is of a text-area
export function regexCheckID(id) {
    const regex = new RegExp(/^\d+text-area$/);
    const check = regex.test(id);

    return check;
}

export function sortArray(array) {
    if(array[0] !== undefined) {
      
      const sortedArray = array.slice().sort(function(a,b){
        if (a.last_updated > b.last_updated) return -1;
        else if (a.last_updated < b.last_updated) return 1;
        else return  0;
      });

      return sortedArray;
    } else return [];
  }