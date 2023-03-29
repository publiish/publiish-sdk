import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// _____enable cors____________________________________________________
import Cors from "cors";

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

// _____________________end cors___________________________________________

export const config = {
  api: {
    bodyParser: false,
  },
};

type Data = {
  status: boolean;
  error?: ApiError;
  data?: string;
};

type ApiError = {
  message: String;
  code: Number;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  // ____________________enable cors _______________________
  // Run the middleware
  await runMiddleware(req, res, cors);
  //_____________________end cors___________________________

  // let default_cluster_url = "http://localhost:9094/add?cid-version=1";
  let clusterUrl = process.env.CLUSTER_URL || "http://cluster:9094";
  //add endpoint
  clusterUrl += "/add";
  //check and add cid version default is zero
  if (process.env.CLUSTER_CONF_CID_VERSION) {
    clusterUrl += "?" + process.env.CLUSTER_CONF_CID_VERSION;
  }
  // console.log(clusterUrl)

  if (req.method == "POST") {
    try {
      const { data } = await axios.post(clusterUrl, req, {
        headers: {
          "Content-Type": req.headers["content-type"], // which is multipart/form-data with boundary included
        },
      });

      if (data) {
        let ipfsData = typeof data !== "string" ? JSON.stringify(data) : data;

        const jsonStrings = ipfsData.split("\n");
        const jsonObjects: any = jsonStrings
          .filter((s) => s.length > 0)
          .map((s) => JSON.parse(s));

        res.status(200).json({ status: true, data: jsonObjects });
      } else {
        //cluster is up and runnning but the operation failed. check 'docker-compose logs' for detailed log
        //one scenario of fail is if minimum number of clusters are not availbale to pin
        res
          .status(406)
          .json({
            status: false,
            error: { message: "cluster error. check cluster logs", code: 1004 },
          });
      }
    } catch (error) {
      console.log("error  in response:", error);
      res
        .status(406)
        .json({
          status: false,
          error: { message: "unable to connect", code: 1005 },
        });
    }
  } else {
    //only POST req.method allowed for this operation
    return res
      .status(405)
      .json({
        status: false,
        error: { message: "Method not allowed", code: 1002 },
      });
  }
};
