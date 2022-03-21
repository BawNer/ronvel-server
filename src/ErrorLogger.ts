import { ConsoleLogger } from "@nestjs/common";
import * as fs from 'fs'

export class ErrorLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string): void {
    super.error(message, stack, context);
    fs.writeFileSync(`${__dirname}/error.json`, JSON.stringify({message, stack, context}))
  }

}