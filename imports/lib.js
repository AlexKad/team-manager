
function getIterations(start, end){
  let iterations = [];
  start = new Date(start);
  while(start.getTime() < end){
    let iter_st = new Date(start);
    let iter_end = new Date(start);
    let offset = start.getDay();
    iter_st.setDate(start.getDate() - offset+1);
    iter_end.setDate(start.getDate() - offset+5);
    if(iter_end.getTime()<end){
      iterations.push(iter_st.toLocaleDateString() + ' - ' + iter_end.toLocaleDateString());
    }
    start = new Date(iter_end);
    start.setDate(start.getDate() + 2);
  }
  return iterations;
}

const helper = (function() {
  return {
     getIterations: getIterations
  }
})();

module.exports = helper;
