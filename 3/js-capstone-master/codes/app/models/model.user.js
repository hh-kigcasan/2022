const Model = require('../../system/core/model');

class UserModel extends Model {
    constructor() {
        super();
    }

    /*  DOCU: Returns user rank details
        Owner: Jette
    */
    async get_user_ranking(id) {
        if (await this.execute_query(`SET GLOBAL sql_mode = ''`)) {
            return (await this.execute_query(`SELECT uch.user_id, u.username, CONCAT(count(uch.challenge_id), '/', (SELECT count(id) no_of_challenges FROM challenges)) no_of_challenges_taken, d.total_duration FROM user_challenges_history uch LEFT JOIN (SELECT user_id, SEC_TO_TIME(SUM(TIME_TO_SEC(duration))) total_duration FROM user_challenges_history GROUP BY user_id) d on uch.user_id = d.user_id LEFT JOIN challenges c on uch.challenge_id = c.id LEFT JOIN users u on uch.user_id = u.id WHERE uch.user_id = ? GROUP BY uch.user_id`, id))[0];
        }
    }

    /*  DOCU: Returns users ranking who already took 1 and more challenges
        Owner: Jette
    */
    async get_rankings() {
        if (await this.execute_query(`SET GLOBAL sql_mode = ''`)) {
            return (await this.execute_query(`SELECT uch.user_id, u.username, CONCAT(count(uch.challenge_id), '/', (SELECT count(id) no_of_challenges FROM challenges)) no_of_challenges_taken, d.total_duration FROM user_challenges_history uch LEFT JOIN (SELECT user_id, SEC_TO_TIME(SUM(TIME_TO_SEC(duration))) total_duration FROM user_challenges_history GROUP BY user_id) d on uch.user_id = d.user_id LEFT JOIN challenges c on uch.challenge_id = c.id LEFT JOIN users u on uch.user_id = u.id GROUP BY uch.user_id`));
        }
    }

    /*  DOCU: Returns user record by username
        Owner: Jette
    */
    async get_user(username) {
        return (await this.execute_query('SELECT id, username, is_admin FROM users WHERE username = ?', username))[0];
    }

    /*  DOCU: Returns user record by id
        Owner: Jette
    */
    async get_user_by_id(id) {
        return (await this.execute_query('SELECT id, username, is_admin FROM users WHERE id = ?', id))[0];
    }

    /*  DOCU: Returns true or false value whether the login credentials is valid or not.
        Owner: Jette
    */
    async is_credentials_valid(username, password) {
        return (await this.execute_query('SELECT id, username FROM users WHERE username = ? AND password = ? LIMIT 1', [username, password])).length > 0;
    }

    /*  DOCU: Returns true or false value whether user data is successfully added or not.
        Owner: Jette
    */
    async add_user(data) {
        return (await this.execute_query('INSERT INTO users(username, password) VALUES(?, ?)', data)).affectedRows > 0;
    }

    /*  DOCU: Returns true or false value whether the username is unique or not.
        Owner: Jette
    */
    async is_username_unique(username) {
        return (await this.execute_query('SELECT username FROM users WHERE username = ?', username)).length < 1;
    }

    /*  DOCU: Returns xss filtered data or error messages whether the validation is successful or not.
        Owner: Jette
    */
    async validate(post, is_login = true) {
        const rules = [
            ['Username', post.username, {min_length: 5}],
            ['Password', post.password, {min_length: 6}],
            ['Confirm password', post.confirm_password, {is_match: 'Password'}]
        ];

        if (is_login) {
            rules.pop();
        }

        const errors = this.set_rules(rules).run(), result = {};

        if (!is_login) {
            if (await this.is_username_unique(this.xss_clean(post.username))) {
                result.data = [this.xss_clean(post.username), this.md5(this.xss_clean(post.password))];
            } else {
                errors.push('Username is already taken');
            }
        } else if (is_login) {
            if (await this.is_credentials_valid(this.xss_clean(post.username), this.md5(this.xss_clean(post.password)))) {
                result.data = await this.get_user(this.xss_clean(post.username));
            } else {
                errors.push('Invalid credentials');
            }
        }

        if (errors.length > 0) {
            result.errors = errors;
        }

        return result;
    }
}
module.exports = new UserModel();