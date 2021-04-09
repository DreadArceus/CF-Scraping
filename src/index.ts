import axios from "axios";
import cheerio from "cheerio";
import { Cheerio } from "cheerio/types";

const main = async () => {
  const AxiosInstance = axios.create();
  const last_page = 38;
  for (var page_id = 1; page_id <= last_page; page_id++) {
    const url = `https://codeforces.com/submissions/Ashishgup/page/${page_id}`;
    await AxiosInstance.get(url)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const problemTable: Cheerio = $(".status-small > a");
        problemTable.map((key, item) => {
          console.log(key + (page_id - 1) * 49 + 1);
          console.log("https://codeforces.com" + item.attribs.href);
        });
      })
      .catch(console.error);
  }
};

main();
