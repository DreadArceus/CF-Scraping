import { User } from "../entities/User";
import { CFSubmission, LoginInput, MyContext, RegisterInput } from "../types";
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

  @Mutation(() => String)
  async updateSubmissions(): Promise<string> {
    const AxiosInstance = axios.create();
    const url = "https://codeforces.com/api/user.status?handle=ashishgup";
    let totalCount = 0;
    let acceptedCount = 0;
    await AxiosInstance.get(url)
      .then((response) => {
        totalCount = response.data.result.length;
        response.data.result.map((submission: CFSubmission) => {
          if (submission.verdict === "OK") {
            acceptedCount++;
            // console.log(submission.problem);
          } else {
            // console.log(submission.verdict);
          }
        });
      })
      .catch(console.error);
    return `Total Submissions:  ${totalCount}, Accepted: ${acceptedCount}`;
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
