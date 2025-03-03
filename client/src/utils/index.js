export const daysLeft = (deadline) => {
    const difference = new Date(deadline).getTime() - Date.now();

    // Use Math.ceil to round up - if there's any time left in the day, it counts as 1 day
    const remainingDays = Math.ceil(difference / (1000 * 3600 * 24));

    return remainingDays;
  };
  
  export const calculateBarPercentage = (goal, raisedAmount) => {
    const percentage = Math.round((raisedAmount * 100) / goal);
  
    return percentage;
  };
  
  export const checkIfImage = (url, callback) => {
    const img = new Image();
    img.src = url;
  
    if (img.complete) callback(true);
  
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
  };