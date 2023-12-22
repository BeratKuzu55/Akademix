const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.status(200).send("merhaba");
})


const port = 3000;
app.listen(port, () => {
    console.log(`server has started on port ${port}`);
});