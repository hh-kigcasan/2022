const SessionReplaysController = require(`../../application/controllers/SessionReplaysController`);
const express = require('express');
const router = express.Router({mergeParams: true});
const sessionReplaysController = new SessionReplaysController();

router.get('/', sessionReplaysController.index);
router.post('/process_search', sessionReplaysController.processSearch);

module.exports = router;