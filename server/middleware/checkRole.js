// middleware/checkRole.js
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRole = req.user.role;
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (roles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  };
};

export default checkRole;
