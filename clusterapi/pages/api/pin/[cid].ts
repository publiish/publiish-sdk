import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "DELETE") {
    const {
      query: { cid },
    } = req;
    const cidString = Array.isArray(cid) ? cid[0] : cid;
    let deletePinAddress = "http://cluster0:9094/pins/" + cidString;

    try {
      const { data: ipfsData } = await axios.delete(deletePinAddress);

      if (ipfsData) {
        res.status(200).json({
          status: true,
          cid: ipfsData.cid || "",
          data: ipfsData,
          error: {},
        });
      } else {
        //cluster is up and runnning but the operation failed. check 'docker-compose logs' for detailed log
        //one scenario of fail is if minimum number of clusters are not availbale to pin
        res.status(406).json({
          status: false,
          error: {
            message: "cluster error. check cluster logs",
            code: 1004,
          },
        });
      }
    } catch (error: any) {
      let ipfsError = error?.response?.data; // error response from the cluster

      res.status(ipfsError ? ipfsError.code || 406 : 406).json({
        error: ipfsError || {
          status: false,
          error: {
            message: "may be unable to connect to cluster",
            code: 1005,
          },
        },
      });
    }

    // data.pipe(res);
    // console.log('response in the backed:',data)
    // return res.status(200).json({...data, name:data.name, cid: data.cid,} )
  } else {
    //only POST req.method allowed for this operation
    return res.status(405).json({
      status: false,
      error: { message: "Method not allowed", code: 1002 },
    });
  }
};
