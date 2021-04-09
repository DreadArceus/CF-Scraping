import axios from "axios";
import { CFSubmission } from "./types";

const main = async () => {
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
  console.log(`Total Submissions:  ${totalCount}, Accepted: ${acceptedCount}`);
};

main();
