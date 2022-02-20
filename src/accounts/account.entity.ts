import { CategoriesEntity } from "@app/categories/categories.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'accounts'})
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({default: null})
  categoryId: number

  @Column()
  info: string

  @Column({default: 'pending'})
  status: string

  @ManyToOne(() => CategoriesEntity, category => category.id, { eager: true })
  category: CategoriesEntity
}