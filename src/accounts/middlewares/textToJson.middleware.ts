import { TextToJsonHelper } from "@app/accounts/helpers/textToJson.helper";
import { CategoriesService } from "@app/categories/categories.service";
import { ExpressRequestInterface } from "@app/types/expressRequest.interface";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";

@Injectable()
export class TextToJsonMiddleware implements NestMiddleware {
  
  async use (req: ExpressRequestInterface, res: Response, next: NextFunction) {
    const pureText = req.body.account.log
    const jsonText = new TextToJsonHelper(pureText).makeJson()
    req.body.account.info = jsonText
    next()
  }
}