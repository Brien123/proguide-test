// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import mysql from 'mysql2';

var User='root';
var Pass = '';
const dbConnect = mysql.createConnection({
  host: "localhost",
  user: User,
  password:Pass,
  database: 'crypzlhr_materialsdb'
});

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method === 'POST'){
    res.status(200).json({data: 'post worked'})

  }else if(req.method === 'GET'){
    res.status(200).json({data: 'get worked'})

  }
}
