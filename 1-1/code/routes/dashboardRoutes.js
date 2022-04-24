const express = require("express");
const router = express.Router();
const DashboardController = require("../controllers/dashboard");
const path = require("path");
const multer = require("multer");

// setup storing uploaded images
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./assets/images/");
	},
	filename: (req, file, cb) => {
		cb(
			null,
			file.fieldname + "-" + Date.now() + path.extname(file.originalname)
		);
	},
});

const upload = multer({
	storage: storage,
});

router.get("/", DashboardController.index);
router.get("/admin", DashboardController.admin);
router.get("/candidates", DashboardController.candidates);
router.post(
	"/candidates",
	upload.single("candidate_image"),
	DashboardController.add
);
router.post(
	"/update/:id",
	upload.single("candidate_image"),
	DashboardController.update
);
router.post("/delete/:id", DashboardController.delete);
router.post("/vote/:id", DashboardController.vote);
module.exports = router;
