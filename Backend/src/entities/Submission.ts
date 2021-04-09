import { Field, ObjectType } from "type-graphql";
import { Entity, BaseEntity, PrimaryColumn, ManyToOne, Column } from "typeorm";
import { Problem } from "./Problem";

@ObjectType()
@Entity()
export class Submission extends BaseEntity {
  @Field()
  @PrimaryColumn()
  id: number;

  @Field()
  @Column({ default: "NA" })
  verdict?: string;

  @Field()
  @Column()
  link: string;

  @ManyToOne(() => Problem, (problem) => problem.submissions, {
    onDelete: "CASCADE",
  })
  problem: Problem;
}
