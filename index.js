import express from 'express';
import cors from 'cors';
import streamifier from 'streamifier';
import { getJkt48Live } from './func.js';

const server = express();
server.use(cors());
server.use(express.json());

server.get('/live-jkt48', async (req, res) => {
  try {
    const data = await getJkt48Live();
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
server.get('/stream-live', async (req, res) => {
  try {
    const userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';
    const { url } = req.query;
    if (!req.query?.url) {
      return res.status(400).json({ message: 'invalid query or unkown' });
    }
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Android/13/Redmi Note 8/6.51.0',
        'x-api-key': '123f4c4e-6ce1-404d-8786-d17e46d65b5c',
      },
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
