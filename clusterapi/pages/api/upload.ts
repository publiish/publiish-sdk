import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export const config = {
  api: {
    bodyParser: false,
  },
};

type Data = {
  status: boolean;
  error?: ApiError;
  // name: string
};

type ApiError = {
  message: String;
  code: Number;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // let default_cluster_url = "http://localhost:9094/add?cid-version=1";
  let clusterUrl = (process.env.CLUSTER_URL || "http://cluster:9094") + "/add";

  //check and add cid version default is zero
  if (process.env.CLUSTER_CONF_CID_VERSION) {
    clusterUrl += "?" + process.env.CLUSTER_CONF_CID_VERSION;
  }

  if (req.method == "POST") {
    try {
      const { data: ipfsData } = await axios.post(clusterUrl, req, {
        headers: {
          "Content-Type": req.headers["content-type"], // which is multipart/form-data with boundary included
        },
      });

      if (ipfsData) {
        res
          .status(200)
          .json({
            status: true,
            cid: ipfsData.cid || "",
            data: ipfsData,
            error: {},
          });
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
