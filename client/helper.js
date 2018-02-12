export function makeListFromEnum(obj){
  return Object.keys(obj)
               .map(key => {return { id: obj[key], name: obj[key] } });
}
