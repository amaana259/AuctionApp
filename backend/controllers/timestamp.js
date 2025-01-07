const currentDate = new Date();

const twoDaysLater = new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000);

const timestamp = twoDaysLater.getTime();
// console.log(timestamp);

// const timestamp = Date.now();
// console.log(timestamp);