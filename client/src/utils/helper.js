const truncateText = (text = "", limit = 250) => {
  if (text.length <= limit) return text;
  return text.slice(0, limit).trim() + "…";
};
export default truncateText;