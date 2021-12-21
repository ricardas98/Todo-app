export const convertDate = (d) => {
  let date = new Date(d);
  date = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return year + "-" + month + "-" + day;
};
