import { AccountEntity } from "@app/accounts/account.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'categories' })
export class CategoriesEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  rule: string

  @Column()
  weight: number

  @OneToMany(() => AccountEntity, account => account.categoryId, { onDelete: 'CASCADE' })
  account: AccountEntity
}