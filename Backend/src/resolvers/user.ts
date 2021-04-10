import { User } from "../entities/User";
import {
  CFSubmission,
  LoginInput,
  MyContext,
  ProblemData,
  RegisterInput,
} from "../types";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import axios from "axios";
import { Problem } from "../entities/Problem";
import { getConnection } from "typeorm";
import { Submission } from "../entities/Submission";

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User | undefined> {
    if (!req.session.userID) {
      return undefined;
    }
    return User.findOne(req.session.userID);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: RegisterInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      user = await User.create({
        email: options.email,
        password: hashedPassword,
        codeforcesHandle: options.codeforcesHandle,
      }).save();
    } catch (err) {
      if (err.code === "23505") {
        let errorField;
        if (err.detail.includes("email")) {
          errorField = "email";
        } else {
          errorField = "codeforces handle";
        }
        return {
          errors: [
            {
              field: errorField,
              message: `user with this ${errorField} already exists`,
            },
          ],
        };
      }
    }

    req.session!.userID = user?.id;

    return { user: user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: LoginInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    let choice;
    if (options.handleOrEmail.includes(".com")) {
      choice = "email";
    } else {
      choice = "codeforces handle";
    }
    const user = await User.findOne({
      where:
        choice === "email"
          ? { email: options.handleOrEmail }
          : { codeforcesHandle: options.handleOrEmail },
    });
    if (!user) {
      return {
        errors: [
          {
            field: choice,
            message: `user with this ${choice} not found`,
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session!.userID = user.id;

    return { user: user };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req }: MyContext): Promise<Boolean> {
    if (!req.session.userID) {
      return false;
    }
    req.session.userID = undefined;
    return true;
  }

  @Mutation(() => [Problem], { nullable: true })
  async syncUserProblems(
    @Arg("targetHandle") targetHandle: string
  ): Promise<Problem[] | undefined> {
    const conn = getConnection();
    let targetUser = await User.findOne({
      where: { codeforcesHandle: targetHandle },
      relations: ["problems"],
    });
    if (!targetUser) {
      targetUser = new User();
      targetUser.codeforcesHandle = targetHandle;
      targetUser.email = "";
      targetUser.password = "";
      await conn.manager.save(targetUser);
    } else {
      await Problem.remove(targetUser.problems);
    }
    const AxiosInstance = axios.create();
    const url = `https://codeforces.com/api/user.status?handle=${targetHandle}&count=100`;
    const problemCollection: { [id: string]: ProblemData } = {};
    await AxiosInstance.get(url)
      .then((response) => {
        response.data.result.map((submission: CFSubmission) => {
          const name = submission.problem.name;
          if (!(name in problemCollection)) {
            problemCollection[name] = {
              rating: submission.problem.rating,
              link: `/${submission.problem.contestId}/${submission.problem.index}`,
              submissions: [
                {
                  id: submission.id,
                  link: `/${submission.problem.contestId}/${submission.id}`,
                  verdict: submission.verdict,
                },
              ],
              tags: submission.problem.tags,
            };
          } else {
            if (submission.verdict)
              problemCollection[name].submissions.push({
                id: submission.id,
                link: `/${submission.problem.contestId}/${submission.id}`,
                verdict: submission.verdict,
              });
          }
        });
      })
      .catch(console.error);
    console.log(problemCollection);
    for (let [key, value] of Object.entries(problemCollection)) {
      const newProblem = new Problem();
      newProblem.user = targetUser;
      newProblem.name = key;
      newProblem.link = value.link;
      newProblem.rating = value.rating;
      newProblem.tags = value.tags;
      await conn.manager.save(newProblem);
      for (let submission of value.submissions) {
        const newSubmission = new Submission();
        newSubmission.id = submission.id;
        newSubmission.link = submission.link;
        newSubmission.problem = newProblem;
        newSubmission.verdict = submission.verdict;
        await conn.manager.save(newSubmission);
      }
    }
    const problems = await Problem.find({
      where: { user: targetUser },
      relations: ["submissions"],
    });
    return problems;
  }

  @Mutation(() => [Problem], { nullable: true })
  async getUserProblems(
    @Arg("targetHandle") targetHandle: string
  ): Promise<Problem[] | undefined> {
    const targetUser = await User.findOne({
      where: { codeforcesHandle: targetHandle },
    });
    if (!targetUser) return undefined;
    const problems = await Problem.find({
      where: { user: targetUser },
      relations: ["submissions"],
    });
    return problems;
  }

  @Query(() => [User])
  async devAllUsers(): Promise<User[]> {
    return User.find();
  }

  @Mutation(() => User, { nullable: true })
  async devDeleteUsers(): Promise<void> {
    User.delete({});
  }
}
