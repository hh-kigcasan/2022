const {router} = require('../system/core/includes');
const UserController = require('../app/controllers/controller.user');

router.get('/', (req, res) => new UserController(req, res).login());
router.get('/login', (req, res) => new UserController(req, res).login());
router.get('/register', (req, res) => new UserController(req, res).register());
router.post('/process_register', (req, res) => new UserController(req, res).process_register());
router.post('/process_login', (req, res) => new UserController(req, res).process_login());
router.get('/rankings', (req, res) => new UserController(req, res).rankings());
router.get('/admin', (req, res) => new UserController(req, res).admin());
router.get('/profile', (req, res) => new UserController(req, res).profile());
router.get('/logout', (req, res) => new UserController(req, res).logout());

//router.get('/get_challenge/:id', (req, res) => new UserController(req, res).get_challenge());

module.exports = router;