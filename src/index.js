const express = require('express');
const app = express();
const port = 6969;

app.get('/', (req, res) => {res.send('<h1 style="color:blue"> Miky ...!</h1>')} );

app.listen(port, () => console.log(`Example app listening on port ${port}!`));