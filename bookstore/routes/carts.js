const express = require("express");
const router = express.Router();
const {addToCart, getCartItems, removeFromCart} = require("../controllers/CartController");

router.use(express.json())

router.post("/", addToCart) // 장바구니 담기
router.get("/", getCartItems) // 장바구니 조회 // 장바구니 선택상품 조회
router.delete("/:id", removeFromCart) // 장바구니 삭제

module.exports = router



