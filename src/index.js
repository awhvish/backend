// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then()
  .catch((err) => {
    console.log("MongoDB connection failed: ", err);
  });
