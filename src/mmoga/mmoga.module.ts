import { AccountModule } from "@app/accounts/account.module";
import { CategoriesModule } from "@app/categories/categories.module";
import { Module } from "@nestjs/common";
import { MmogaController } from "./mmoga.controller";
import { MmogaService } from "./mmoga.service";


@Module({
  imports: [CategoriesModule, AccountModule],
  providers: [MmogaService],
  controllers: [MmogaController]
})
export class MmogaModule {}