import { Request, Response, Router } from "express";
import { pool } from "../../config/db";
import { userControllers } from "./user.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

const router = Router();

// app.use("/users", userRoutes)

//routes -> controller -> service(all logic work here)

router.post("/", userControllers.createUser)


// users get
  router.get("/", logger, auth("admin"), userControllers.getUser);

//   single user get
router.get("/:id", auth("admin","user"), userControllers.getSingleUser)

// update user
router.put("/:id", userControllers.updateUser);

// delete user
router.delete("/:id", userControllers.deleteUser);


// export all
export const userRoutes = router;