// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import excuteQuery from "../../lib/database/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const file = {
    id: 1,
    brand_id: 123123,
    filename: "filename",
    file_type: "image/png",
    cid: "ajsdaskjdhskajdsakd",
    consumer_id: 213231,
    created_by: 123123,
    updated_by: 123123,
    created_at: "2017-02-04 11:23:54",
    updated_at: "2017-02-04 11:23:54",
    new_filename: null,
    delete_flag: 0,
  };

  const result = await excuteQuery("INSERT INTO file VALUES(?)", [file]);

  res.status(200).json(result);
}
