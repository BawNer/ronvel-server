import { CategoriesModule } from "@app/categories/categories.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountControler } from "./account.controller";
import { AccountEntity } from "./account.entity";
import { AccountService } from "./account.service";

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity]), CategoriesModule],
  controllers: [AccountControler],
  providers: [AccountService],
  exports: [AccountService]
})
export class AccountModule {}