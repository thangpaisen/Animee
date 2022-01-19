import dateFormat from 'dateformat';

export const timeSince = (date)=> {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " năm";
  }
  interval = seconds / 86400;
  if (interval > 1 && interval <= 7) {
    return Math.floor(interval) + " ngày";
  }
  else if (interval > 7) {
      return dateFormat(date, "dd 'tháng' mm 'lúc' HH:MM");
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " giờ";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " phút";
  }
  if(seconds == 0)
    return "Vừa xong";
  return Math.floor(seconds) + " giây";
}
export const timeSinceComment = (date)=> {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " năm";
  }
  interval = seconds / 604800;
  if (interval > 1) {
    return Math.floor(interval) + " tuần";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " ngày";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " giờ";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " phút";
  }
  if(seconds == 0)
    return "Vừa xong";
  return Math.floor(seconds) + " giây";
}