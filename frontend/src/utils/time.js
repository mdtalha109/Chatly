import moment from "moment";

export const formatDateTime = (dateTime) => {
    const currentDateTime = moment();
    const inputDateTime = moment(dateTime, 'YYYY-MM-DD HH:mm:ss');
    
    if (inputDateTime.isSame(currentDateTime, 'day')) {
      return inputDateTime.format('h:mm a'); // Return just the time
    }
    
    if (inputDateTime.isSame(currentDateTime.clone().subtract(1, 'day'), 'day')) {
      return 'Yesterday';
    }
    
    // If neither today nor yesterday, return the full formatted date time
    console.log("inputDateTime.format('YYYY-MM-DD HH:mm:ss'): ", inputDateTime.format('YYYY/MM/DD'))
    return inputDateTime.format('YYYY/MM/DD');
  };

