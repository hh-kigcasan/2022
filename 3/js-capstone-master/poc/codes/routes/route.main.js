const {router} = require('../system/core/includes');
const MainController = require('../app/controllers/controller.main');

router.get('/', (req, res) => new MainController(req, res).index());

module.exports = router;