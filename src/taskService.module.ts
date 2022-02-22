import { Injectable } from "@nestjs/common";
import { Cron } from '@nestjs/schedule';
import { MmogaService } from "./mmoga/mmoga.service";

@Injectable()
export class TaskService {
  constructor(
    private mmogaService: MmogaService
  ) {}

  @Cron('* */5 * * * *', { name: 'mmogaDeamon' })
  mmogaDeamon() {
    console.log('Anime')
    this.mmogaService.execute()
  }
}