const validator = require('../static/lib/validator/validator');
const uniq = require('../static/lib/universal-query/universalQuery');
const xssFilter = require('xss-filters');

class MainModel {
    update_score(req) {
        let subject_code = xssFilter.inHTMLData(req.body.subject_code).toUpperCase();
        let score = xssFilter.inHTMLData(req.body.score);
        const user_id = req.session.user[0].id;
        const values = [score, subject_code, user_id];
        const query = "UPDATE scores SET correct_answer = ?, updated_at = NOW() WHERE subject_code = ? AND user_id = ?;";
        return uniq.queryAll(query, values, req);
    }

    get_subject(req) {
        let subject_code = xssFilter.inHTMLData(req.body.subject_code).toUpperCase();
        const query = "SELECT * FROM questions WHERE subject_code = ?;";
        const values = [subject_code];

        return uniq.queryAll(query, values, req);
    }

    get_questions(req) {
        let subject_code = xssFilter.inHTMLData(req.body.subject_code).toUpperCase();
        const query = "SELECT * FROM questions WHERE subject_code = ?;";
        const values = [subject_code];

        return uniq.queryAll(query, values, req);
    }

    get_scores(req, user_id) {
        const query = "SELECT * FROM scores WHERE user_id = ? ORDER BY updated_at DESC;";

        return uniq.queryAll(query, [user_id], req);
    }

    update_question_data(req, subj_data) {
        const subject_code = xssFilter.inHTMLData(req.body.subject_code).toUpperCase();
        const questions = req.body.questions;
        const question_str = questions;
        const subj = JSON.parse(subj_data);
        const query = "UPDATE questions SET question_data = ?, updated_at = NOW() WHERE subject_code = ?;";
        const all_questions = [...question_str, ...subj];
        const number_item = all_questions.length;
        const new_question_data = JSON.stringify(all_questions);
        const values = [new_question_data, subject_code];
        
        uniq.queryNone(query, values, req);

        const new_query = "UPDATE scores SET number_item = ?, updated_at = NOW() WHERE subject_code = ?;";
        const new_values = [number_item, subject_code];

        uniq.queryNone(new_query, new_values, req);
        req.session.errors = {'Subject Name': 'Question/s has been successfully updated!'};
    }
    
    add_subject(req) {
        const subject_name = xssFilter.inHTMLData(req.body.subject_name).toUpperCase();
        const questions = req.body.questions;
        let subject_code = xssFilter.inHTMLData(req.body.subject_code).toUpperCase();

        validator.setField('Subject Name', subject_name).isLength({ min: 2 });

        const errors = validator.validationErrors();
        if(Object.keys(errors).length !== 0) { 
            req.session.errors = errors;
            return;
        }

        if(!questions) {
            req.session.errors = {'Subject Name': 'No questions found!'};
            return;
        }
        
        if(!subject_code) {
            subject_code = MainModel.generate_random_code();
        }
        const question_str = JSON.stringify(questions);
        const query = "INSERT INTO questions(subject_code, subject_name, question_data, created_at, updated_at) VALUES(?, ?, ?, NOW(), NOW());";
        const values = [subject_code, subject_name, question_str];
        
        uniq.queryNone(query, values, req);

        const user_id = req.session.user[0].id;
        const number_item = questions.length;
        const new_query = "INSERT INTO scores(user_id, subject_code, subject_name, number_item, correct_answer, created_at, updated_at) VALUES(?, ?, ?, ?, ?, NOW(), NOW());";
        const new_values = [user_id, subject_code, subject_name, number_item, 0];
        
        uniq.queryNone(new_query, new_values, req);
        req.session.errors = {'Subject Name': 'Question/s has been successfully added!'};
    }

    share_subject(req, subj) {
        const user_id = req.session.user[0].id;
        const questions = JSON.parse(subj.question_data);
        const number_item = questions.length;
        const new_query = "INSERT INTO scores(user_id, subject_code, subject_name, number_item, correct_answer, created_at, updated_at) VALUES(?, ?, ?, ?, ?, NOW(), NOW());";
        const new_values = [user_id, subj.subject_code, subj.subject_name, number_item, 0];
        
        uniq.queryNone(new_query, new_values, req);
        req.session.errors = {'Subject Name': 'Question/s has been successfully Migrated!'};
    }

    static generate_random_code() {
        let code = '';
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for(let i = 0; i < 7; i++) {
            let is_num = Math.round(Math.random());
            if(is_num) {
                code += Math.floor(Math.random() * 10);
            } else {
                let index = Math.floor(Math.random() * 25);
                code += alphabet[index];
            }
        }
        
        return code;
    }

    get_subjects(req) {
        const user_id = req.session.user[0].id;

        const query = 'SELECT * FROM scores WHERE user_id = ?;';
        return uniq.queryAll(query, [user_id], req);
    }
}

module.exports = new MainModel();