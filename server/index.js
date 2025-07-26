import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 8000;

app.use(cors({ origin: '*' }));

app.get('/ngram', async (req, res) => {
  try {
    const { content, year_start = '2019', year_end = '2025', corpus = '26', smoothing = '1', case_insensitive = 'true' } = req.query;

    if (!content) {
      return res.status(400).json({ error: 'Missing ?content=word1,word2' });
    }

    const url = `https://books.google.com/ngrams/json?content=${content}&year_start=${year_start}&year_end=${year_end}&corpus=${corpus}&smoothing=${smoothing}&case_insensitive=${case_insensitive}`;

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: `Failed with ${response.status}` });
    }

    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});