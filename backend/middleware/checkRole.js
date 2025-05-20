// middleware/checkRole.js
module.exports = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Accès interdit" });
    }
    next();
  };
};
