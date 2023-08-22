const express = require('express');
const app = express();
const PORT = 8008;

app.get('/numbers', async (req, res) => {
    const urls = req.query.url;

    if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const results = await Promise.all(urls.map(fetchNumbers));

    const mergedNumbers = results
        .flatMap(numbers => numbers)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort((a, b) => a - b);

    res.json({ numbers: mergedNumbers });
});

async function fetchNumbers(url) {
    try {
        const response = await fetch(url, { timeout: 500 });
        const data = await response.json();
        return data.numbers;
    } catch (error) {
        return [];
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
