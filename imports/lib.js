
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
function filterOutWeekends(startDate, endDate){
  let filteredDates = [];
   let date = new Date(startDate);
   let eDate = new Date(endDate);
   eDate.setDate(eDate.getDate()+1);

   while(date.getTime() != eDate.getTime()){
     if(date.getUTCDay() != 0 && date.getUTCDay() != 6){
       filteredDates.push((new Date(date)).getTime());
     }
     date.setDate(date.getDate()+1);
   }
   return filteredDates;
}
function displayDateFromMs(ms){
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fr', 'Sat'];
  let date = new Date(ms);
  let month = date.getMonth()+1;
  let day = date.getDate();
  let dayOfTheWeek = weekDays[date.getDay()];
  return dayOfTheWeek+ ' ' + month +'/' + day;
}

const helper = (function() {
  return {
     getIterations: getIterations,
     filterOutWeekends: filterOutWeekends,
     displayDateFromMs: displayDateFromMs
  }
})();

module.exports = helper;
