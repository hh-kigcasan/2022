const {router} = require('../system/core/includes');
const APIController = require('../app/controllers/controller.api');

router.get('/get_video/:id', (req, res) => new APIController(req, res).get_video());
router.get('/get_editor/:id', (req, res) => new APIController(req, res).get_editor());
router.get('/get_all_user_challenges_history/:id', (req, res) => new APIController(req, res).get_all_user_challenges_history());
router.get('/get_nav/:id', (req, res) => new APIController(req, res).get_nav());

module.exports = router;