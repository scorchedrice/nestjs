// express가 http보다 보기 좋다. (가독성이 좋음)
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('<h1>Home Page</h1>');
});

app.use((req, res) => {
  res.status(404).send('Not Found');
})

app.listen(3000, () => {
  console.log('server running on localhost 3000')
})
