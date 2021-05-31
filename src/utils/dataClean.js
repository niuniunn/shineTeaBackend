export function addKey(arr) {
  arr.map((item,index)=>{arr[index]['key'] = index;})
  return arr;
}
