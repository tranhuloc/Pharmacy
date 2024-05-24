export default {
  format(input: any, fix: number) {
    return input
      ? Number(Number(input).toFixed(fix ?? 0)).toLocaleString()
      : null;
  },
  increaseNumber(num: string, totalLength: number) {
    return String(num).padStart(totalLength, '0');
  }
};
