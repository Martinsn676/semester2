export const getTime = {
  format(dateString) {
    const date = new Date(dateString);
    return {
      dd: String(date.getDate()).padStart(2, "0"),
      mo: String(date.getMonth() + 1).padStart(2, "0"),
      yy: String(date.getFullYear()).slice(-2),
      hh: String(date.getHours()).padStart(2, "0"),
      mm: String(date.getMinutes()).padStart(2, "0"),
      ss: String(date.getSeconds()).padStart(2, "0"),
    };
  },
  difference(dateString) {
    const millisec = new Date(dateString) - new Date();
    return {
      totalMin: Math.floor(millisec / (1000 * 60)),
      hh: Math.floor(millisec / (1000 * 60 * 60)),
      mm: Math.floor((millisec % (1000 * 60 * 60)) / (1000 * 60)),
      ss: Math.floor((millisec % (1000 * 60)) / 1000),
    };
  },
};
