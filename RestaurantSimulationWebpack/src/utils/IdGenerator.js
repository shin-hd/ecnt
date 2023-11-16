export const getNewIdGenerator = () => {
  let id = 1;
  return () => id++;
};
