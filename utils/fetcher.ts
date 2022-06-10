import axios from "axios";

async function fetcher(url: string) {
   try {
      const res = await axios.get(url);
      return res.data;
   } catch (err) {
      console.log(err);
      throw new Error("Error occurred");
   }
}

export default fetcher;
