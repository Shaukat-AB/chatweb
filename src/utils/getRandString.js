const getRandString = (pre="") => {
  let randStr = Math.random().toString(36).substring(2);
  return pre + randStr;
};

export default getRandString;
