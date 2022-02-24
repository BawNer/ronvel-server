import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './accounts/account.module';
import { TextToJsonMiddleware } from './accounts/middlewares/textToJson.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { MmogaModule } from './mmoga/mmoga.module';
import ormconfig from './ormconfig'
import { AuthMiddleware } from './users/middlewares/auth.middleware';
import { UserModule } from './users/user.module';
import { ScheduleModule } from '@nestjs/schedule'
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';



@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'client'), exclude: ['/api*']}), ScheduleModule.forRoot(), UserModule, CategoriesModule, MmogaModule, AccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    })
    consumer.apply(TextToJsonMiddleware).forRoutes({
      path: '/account',
      method: RequestMethod.POST
    })
  }
}
