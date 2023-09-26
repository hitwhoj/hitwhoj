function t(e = Date.now()) {
  return new Date(e - new Date().getTimezoneOffset() * 6e4)
    .toISOString()
    .slice(0, 16);
}
export { t as a };
