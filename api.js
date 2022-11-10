const router = require("express").Router();

router.use((req, res, next) => {
    req.user = {
        id: 10,
        name: "Shaj"
    };
    next()
})
router.post("/add", (req, res) => {
    res.send({
        status: 200,
        message: "Added"
    })
});
router.delete("/delete", (req, res) => {
    res.send({
        status: 200,
        message: "Deleted"
    })
});
router.put("/update", (req, res) => {
    res.send({
        status: 200,
        message: "Updated"
    })
});
router.patch("/save", (req, res) => {
    res.send({
        status: 200,
        message: "Saved"
    })
});
router.get("/list", (req, res) => {
    res.send({
        status: 200,
        message: "Listed"
    })
});
router.get("/view", (req, res) => {
    res.send({
        status: 200,
        message: "Viewed"
    })
});

module.exports = router;