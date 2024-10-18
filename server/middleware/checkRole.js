// middleware/checkRole.js
// const checkRole = (allowedCategories) => {
//   return (req, res, next) => {
//     const userCategory = req.user.category;

//     if (allowedCategories.includes(userCategory)) {
//       next();
//     } else {
//       res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
//     }
//   };
// };

// export default checkRole;
