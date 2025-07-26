import express from 'express';
import cors from 'cors';
import streamifier from 'streamifier';
import { getIdnLive } from './func.js';

const server = express();
server.use(cors());
server.use(express.json());

server.get('/list-stream', async (req, res) => {
  try {
    const { category } = req.query;
    const data = await getIdnLive(category);
    const liveData = data.data;
    const filtered = liveData.filter((item) => item.status == 'live');
    return res.status(200).json({
      status: 'OK',
      data: filtered,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: 'failed get live' });
  }
});
server.get('/stream', async (req, res) => {
  try {
    const { url } = req.query;
    if (!req.query?.url) {
      return res.status(400).json({ message: 'invalid query or unkown' });
    }
    const response = await fetch(url, {
      method: 'GET',
    });
    if (!response.ok) {
      console.log(response);
      return res.status(500).json({ message: 'failed get stream' });
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    streamifier.createReadStream(buffer).pipe(res);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: 'failed stream live' });
  }
});
server.listen(9595, '0.0.0.0', () => {
  console.log(`server running at port ${9595}`);
});
