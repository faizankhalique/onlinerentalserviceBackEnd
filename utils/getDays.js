module.exports = function(d) {
  var date = new Date(d + ",00:00");
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  firstDay = formatDate(new Date(firstDay).toLocaleDateString());
  var lastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    daysInMonth(date.getMonth() + 1, date.getFullYear())
  );
  lastDay = formatDate(new Date(lastDay).toLocaleDateString());
  return { firstDay, lastDay };
};
function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
