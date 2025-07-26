// import fetch from 'node-fetch';

// export default async function handler(req, res) {
//   const { content } = req.query;
//   if (!content) {
//     return res.status(400).json({ error: 'Missing content parameter' });
//   }

//   try {
//     const url = `https://books.google.com/ngrams/json?content=${encodeURIComponent(
//       content
//     )}&year_start=2019&year_end=2025&corpus=26&smoothing=1&case_insensitive=True`;

//     const response = await fetch(url);
//     const data = await response.json();

//     // Add CORS headers
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET');
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }
