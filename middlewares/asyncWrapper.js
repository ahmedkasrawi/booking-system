module.exports = (asyncFn) => {
  return async (req, res, next) => {
    try {
      await asyncFn(req, res, next);
    } catch (error) {
      console.error("🔴 Caught Error in asyncWrapper:", error);
      next(error);
    }
  };
};
