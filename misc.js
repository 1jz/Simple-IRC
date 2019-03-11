//misc functions that might be used.

module.exports = {
    binarySearch: (arr, needle) => {
        var min = 0;
        var max = arr.length-1;
    
        while(true){
            var mid = Math.floor((min+max)/2);
            if(arr[mid] === needle) {
                return mid;
            } else if(min > max){
                return -1;
            } else if(needle > arr[mid]) {
                min = mid+1;
            } else if (needle < arr[mid]) {
                max = mid-1;
            }
        }
    },
    sort: (arr) => {
        for(var i = 0; i < arr.length; i++) {
            for(var j = 0; j < arr.length; j++) {
                if(arr[i] > arr[j] === false) {
                    temp = arr[j];
                    arr[j] = arr[i];
                    arr[i] = temp;
                }
            }
        }
    },
    sortedAdd: (arr, needle) => { //new binarysearch that adds stuff sorted automatically unless its a duplicate then it returns boolean at cell 0 and index at cell 1.
        var min = 0;
        var max = arr.length-1;
        
        while(true){
            var mid = Math.floor((min+max)/2);
            if(arr[mid] === needle) {
                return [true, mid]; //return true if there are dupes.
            } else if(min > max){
                return [false, mid+1];
            } else if(needle > arr[mid]) {
                min = mid+1;
            } else if (needle < arr[mid]) {
                max = mid-1;
            }
        }
    }
}