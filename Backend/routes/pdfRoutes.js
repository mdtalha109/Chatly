const express = require("express");
const router = express.Router();
const { uploadPdf, queryPdf } = require("../controller/pdfController");
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

router.post("/upload", protect, upload.single("pdf"), uploadPdf);
router.post("/query", protect, queryPdf);


module.exports = router;
