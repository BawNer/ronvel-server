import { UserEntity } from "@app/users/user.entity";
import { Request } from "express";

export interface ExpressRequestInterface extends Request {
  user?: UserEntity
}