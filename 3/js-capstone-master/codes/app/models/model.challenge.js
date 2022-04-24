const Model = require('../../system/core/model');

class ChallengeModel extends Model {
    constructor() {
        super();
    }

    /*  DOCU: Returns total no of challenges
       Owner: Jette
    */
    async total_no_of_challenges() {
        return (await this.execute_query('SELECT count(id) total_no_of_challenges FROM challenges'))[0].total_no_of_challenges;
    }

    /*  DOCU: Returns true or false value whether the user already took a specific challenge
        Owner: Jette
    */
    async is_challenge_retake(challenge_id, user_id) {
        return (await  this.execute_query('SELECT id FROM user_challenges_history WHERE challenge_id = ? AND user_id = ?', [challenge_id, user_id])).length > 0;
    }

    /*  DOCU: Returns user challenges history
        Owner: Jette
    */
    async get_all_user_challenges_history(id) {
        return (await this.execute_query('SELECT c.*, uch.id uch_id, uch.user_id, uch.record_path, uch.record_ended_at, uch.duration FROM challenges c LEFT JOIN user_challenges_history uch on c.id = uch.challenge_id WHERE uch.user_id = ? ORDER BY uch.id DESC', id));
    }

    /*  DOCU: Returns user challenge history
        Owner: Jette
    */
    async get_user_challenge_history(challenge_id, user_id) {
        return (await this.execute_query(`SELECT c.*, uch.id uch_id, uch.user_id, uch.record_path, uch.record_ended_at FROM challenges c LEFT JOIN user_challenges_history uch on c.id = uch.challenge_id WHERE c.id = ? AND uch.user_id = ?`, [challenge_id, user_id]))[0];
    }

    /*  DOCU: Updates user challenge history record
        Owner: Jette
    */
    async update_user_challenge_history(data) {
        return (await this.execute_query(`UPDATE user_challenges_history SET record_ended_at = ?, updated_at = NOW(), duration = TIME(?) WHERE user_id = ? AND challenge_id = ?`, data)).affectedRows > 0;
    }

    /*  DOCU: Returns true or false value whether the user challenge history is successfully added or not.
        Owner: Jette
    */
    async add_user_challenge_history(data) {
        return (await this.execute_query('INSERT INTO user_challenges_history (user_id, challenge_id, record_ended_at, duration, record_path) VALUES(?, ?, ?, TIME(?), ?)', data)).insertId;
    }

    /*  DOCU: Returns challenge
        Owner: Jette
    */
    async get_challenge(id) {
        return (await this.execute_query('SELECT * FROM challenges WHERE id = ? LIMIT 1', id))[0];
    }

    /*  DOCU: Returns all the challenges available
        Owner: Jette
    */
    async get_all_challenges() {
        return (await this.execute_query('SELECT * FROM challenges'));
    }

}
module.exports = new ChallengeModel();