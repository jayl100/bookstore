const express = require("express");
const {faker} = require("@faker-js/faker");
const router = express.Router();

router.use(express.json());

router.get("/", (req, res) => {
    let {num} = req.query;
    num = parseInt(num);

    let index = 1;
    let usersArray = [];

    while (index <= num) {
        usersArray.push({
            email: faker.internet.email(),
            password: faker.internet.password(),
            fullName: faker.person.fullName(),
            phoneNumber: faker.phone.number({style: 'national'})
        });
        index++;
    }
    res.status(200).json(usersArray)

}); // (카테고리별) 전체 도서 조회

module.exports = router;

// req로 숫자를 받아서, 그 수만큼 사용자 정보를 생성해주는 api