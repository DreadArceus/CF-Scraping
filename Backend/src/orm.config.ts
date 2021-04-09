import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import { User } from "./entities/User";

export default {
  synchronize: true,
  logging: true,
  entities: [User],
  database: "CFStalkDB",
  type: "postgres",
  debug: !__prod__,
  user: "dreadarceus",
  password: "123",
} as Parameters<typeof createConnection>[0];
