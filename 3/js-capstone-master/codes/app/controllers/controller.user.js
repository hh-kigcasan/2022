const Controller = require("../../system/core/controller");
const UserModel = require('../models/model.user');
const ChallengeModel = require('../models/model.challenge');

class UserController extends Controller {
    constructor() {
        super(arguments);
    }

    /*  DOCU: Renders challenge partials
        Owner: Jette
    */
    /*async get_challenge() {
        const challenge = await ChallengeModel.is_challenge_retake(this.get('id'), this.session('user').id) ?
            await ChallengeModel.get_user_challenge_history(this.get('id'), this.session('user').id) :
            await ChallengeModel.get_challenge(this.get('id'));

        challenge.test_cases = await JSON.parse(challenge.test_cases);

        this.render('partials/challenge', {challenge: challenge});
    }*/

    /*  DOCU: Renders the admin page
        Owner: Jette
    */
    async admin() {
        if (!this.session('user')) {
            this.redirect('/login');
        } else if (this.session('user').is_admin) {
            const rankings = await UserModel.get_rankings();
            const context = this;

            this.fetch('/get_nav').then(function(response) {
                context.render('admin', {rankings: rankings, nav_partial: response.data});
            });
        } else if (!this.session('user').is_admin) {
            this.redirect('/rankings');
        }
    }

    /*  DOCU: Renders the user profile page
        Owner: Jette
    */
    async profile() {
        if (!this.session('user')) {
            this.redirect('/login');
        } else if (!this.session('user').is_admin) {
            const challenges = await ChallengeModel.get_all_challenges();
            const context = this;

            this.fetch('/get_nav').then(function(response) {
                context.render('profile', {challenges: challenges, nav_partial: response.data});
            });
        } else if (this.session('user').is_admin) {
            this.redirect('/admin');
        }
    }

    /*  DOCU: Renders the user rankings page
        Owner: Jette
    */
    async rankings() {
        if (!this.session('user')) {
            this.redirect('/login');
        } else if (!this.session('user').is_admin) {
            const rankings = await UserModel.get_rankings();
            const context = this;

            this.fetch('/get_nav').then(function(response) {
                context.render('rankings', {rankings: rankings, nav_partial: response.data});
            });
        } else if (this.session('user').is_admin) {
            this.redirect('/admin');
        }
    }

    /*  DOCU: Renders the login page
        Owner: Jette
    */
    login() {
        if (this.session('user') && this.session('user').is_admin) {
            this.redirect('/admin');
        } else if (this.session('user') && !this.session('user').is_admin) {
            this.redirect('/profile');
        } else {
            this.render('login');
        }
    }

    /*  DOCU: Renders the registration page
        Owner: Jette
    */
    register() {
        if (this.session('user') && this.session('user').is_admin) {
            this.redirect('/admin');
        } else if (this.session('user') && !this.session('user').is_admin) {
            this.redirect('/rankings');
        } else {
            this.render('register');
        }
    }

    /*  DOCU: Sends back a success or an errors partial if the validation fails or not. Also, sends a socket signal if login is successful
        Owner: Jette
    */
    async process_login() {
        const result = await UserModel.validate(this.post(), true);

        if (!result.errors) {
            this.session('user', result.data);
            this.render('partials/success', {message: 'Successfully logged in'});
            this.io.emit('redirect', '/login');
        } else {
            this.render('partials/errors', {errors: result.errors});
        }
    }

    /*  DOCU: Sends back a success or an errors partial if the validation fails or not. Also, sends a socket signal when add user is successful
        Owner: Jette
    */
    async process_register() {
        const result = await UserModel.validate(this.post(), false);

        if (!result.errors) {
            if (await UserModel.add_user(result.data)) {
                this.render('partials/success', {message: 'Successfully registered!'});
                this.io.emit('reset_form', this.path());
            } else {
                this.render('partials/errors', {errors: ['Failed to register user']});
            }
        } else {
            this.render('partials/errors', {errors: result.errors});
        }

    }

    /*  DOCU: Clears session and logouts user
        Owner: Jette
    */
    logout() {
        this.session_destroy();
        this.redirect('/login');
    }
}

module.exports = UserController;
