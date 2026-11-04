"use strict";
const express = require("express");
const path = require("path");
const app = express();
const port = Number(process.env.PORT || 8090);
app.get("/", (req, res) => res.redirect("/PTGenAI.html"));
app.use(express.static(path.join(__dirname, "public_html")));
app.listen(port, "127.0.0.1", () => console.log(`PTGenAI: http://localhost:${port}/PTGenAI.html`));
