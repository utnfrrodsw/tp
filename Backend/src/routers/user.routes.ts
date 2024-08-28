import { Router } from "express"
import { signupUser, getUsers, updateUser, delateUser, getUser, signinUser, profile } from "../User/user.controller"
import { schemaValidation } from "../middlewares/schemaValidacion"
import { signupUserSchema, updateUserSchema, signinUserSchema } from "../schemas/schema.user"
import { checkAuthToken } from "../middlewares/authToken"
import { checkRoleAuth } from "../middlewares/checkRole"

const router = Router()

router.post("/login", schemaValidation(signinUserSchema), signinUser)
router.post("/register", schemaValidation(signupUserSchema), signupUser)
router.get("/p", getUsers)
router.get("/:id", getUser)
router.put("/:id", schemaValidation(updateUserSchema), updateUser)
router.delete("/:id", delateUser)

//ruta protegida 
router.get("/", checkAuthToken, checkRoleAuth(["user"]), profile)



export default router