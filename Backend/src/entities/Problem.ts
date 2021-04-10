import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Submission } from "./Submission";
import { User } from "./User";

@ObjectType()
@Entity()
export class Problem extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.problems)
  user: User;

  @Field(() => [String])
  @Column({ type: "simple-array" })
  tags: string[];

  //date

  @Field()
  @Column()
  link: string;

  @Field(() => [Submission])
  @OneToMany(() => Submission, (submission) => submission.problem)
  submissions: Submission[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  rating?: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
