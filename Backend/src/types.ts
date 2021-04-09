import { Request, Response } from "express";
import { InputType, Field } from "type-graphql";

export type MyContext = {
  req: Request;
  res: Response;
};

@InputType()
export class LoginInput {
  @Field()
  handleOrEmail: string;
  @Field()
  password: string;
}

@InputType()
export class RegisterInput {
  @Field()
  email: string;
  @Field()
  password: string;
  @Field()
  codeforcesHandle: string;
}

export type SubmissionData = {
  id: number;
  link: string;
  verdict?: string;
};

export type ProblemData = {
  rating?: number;
  submissions: SubmissionData[];
  link: string;
};

export type CFProblem = {
  contestId?: number;
  name: string;
  rating?: number;
  index: string;
};

export type CFSubmission = {
  id: number;
  problem: CFProblem;
  verdict?: verdictType;
};

type verdictType =
  | "FAILED"
  | "OK"
  | "PARTIAL"
  | "COMPILATION_ERROR"
  | "RUNTIME_ERROR"
  | "WRONG_ANSWER"
  | "PRESENTATION_ERROR"
  | "TIME_LIMIT_EXCEEDED"
  | "MEMORY_LIMIT_EXCEEDED"
  | "IDLENESS_LIMIT_EXCEEDED"
  | "SECURITY_VIOLATED"
  | "CRASHED"
  | "INPUT_PREPARATION_CRASHED"
  | "CHALLENGED"
  | "SKIPPED"
  | "TESTING"
  | "REJECTED";
