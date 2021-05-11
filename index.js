const express = require('express');
const models = require('./models');

var app = express();
app.use(express.json()); // Allows use of req.body (for json)

app.post('/api', async (req, res) => {
  const filter = req.body;
  
  // build query
  // if (filter && Object.keys(filter).length > 0) {
    const records = await models.getData(filter);
    res.json({
      message: "success",
      data: records
    });
    return;
  // } else {
  //   res.status(400).json({ error : 'invalid filters' });
  //   return;
  // }
});

app.listen(3001, function () {
  console.log('Listening on port 3001!')
});