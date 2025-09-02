import jwt from "jsonwebtoken";


export const verifyToken = (req, res, next) => {
  console.log("Cookies received:", req.cookies);
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not authenticated!" });

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is invalid!" });

    console.log("UserId from token:", payload.userId);
    req.userId = payload.userId;
    next();
  });
};