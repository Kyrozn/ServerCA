import { Request, Response } from "express";
import { connection } from "../config/db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const JWT_SECRET = "your_jwt_secret";

export const CocktailLogin = (req: Request, res: Response): void => {
  const { email, password } = req.body; 

  connection.query(
    "SELECT * FROM Users WHERE Email = ?",
    [email],
    async (err, results: any[]) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });

      const user = results[0];
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.Password);
      if (!isMatch)
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });

      const token = jwt.sign({ id: user.ID, role: user.Role }, JWT_SECRET, {
        expiresIn: "1d",
      });

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.ID,
          email: user.Email,
          first_name: user.First_name,
          last_name: user.Last_name,
          role: user.Role,
        },
      });
    }
  );
};

export const CocktailRegister = (req: Request, res: Response): void =>  {
  const { email, name, Sname, password } = req.body;

  connection.query(
    "SELECT * FROM Users WHERE Email = ?",
    [email],
    async (err, results) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });

      if (results.length > 0)
        return res
          .status(409)
          .json({ success: false, message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();

      const insertQuery = `
      INSERT INTO Users (ID, Email, First_name, Last_name, Password, Role)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
      connection.query(
        insertQuery,
        [userId, email, name, Sname, hashedPassword, "user"],
        (err) => {
          if (err)
            return res.status(500).json({
              success: false,
              message: "Error registering user",
              error: err.message,
            });

          res
            .status(201)
            .json({ success: true, message: "User registered", id: userId });
        }
      );
    }
  );
};

export const getUserProfile = (req: Request, res: Response): void => {
  const { ID } = req.body;

  if (!ID) {
    res.status(400).json({ success: false, message: "User ID is required" });
    return;
  }

  const query = "SELECT * FROM Users WHERE ID = ?";
  connection.query(query, [ID], (error, results) => {
    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    res.json({ success: true, profil: results });
  });
};
