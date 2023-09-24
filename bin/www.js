require("dotenv").config();

const router = require("../src/server");
const PORT = process.env.PORT;

router.listen(PORT, (req, res) => {
    console.log(PORT + "번에서 실행");
});
