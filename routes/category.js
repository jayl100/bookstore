const express = require("express");
const router = express.Router();
const {
    allCategory
} = require("../controllers/CategoryController");

router.use(express.json())

router.get("/", allCategory); // 카테고리 전체조회

module.exports = router

