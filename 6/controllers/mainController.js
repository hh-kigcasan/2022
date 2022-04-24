const db = require('../models/mainModel');
/**
 * DOCU: The class Users loads the specific view page.
 */

class MainController {
    /**
     * DOCU: Loads the index page.
     */

    async main(req, res) {
        const user = req.session.user;
        if(!user) {
            res.redirect('/');
            return;
        }
        const scores = (await db.get_scores(req, user[0].id)) || [];

        res.render('../views/main/main', { user: user[0], scores: scores });
    }

    add_question(req, res) {
        const user = req.session.user;

        if(!user) {
            res.redirect('/');
            return;
        }
        
        res.render('../views/main/add_question');
    }

    play(req, res) {
        const user = req.session.user;
        if(!user) {
            res.redirect('/');
            return;
        }
        
        res.render('../views/main/play', { user: user[0] });
    }

    async questions(req, res) {
        const subject_code = req.body.subject_code;
        if(subject_code != '') {
            const subj = await db.get_subject(req);

            if(subj[0] == undefined) {
                req.session.errors = {'Subject Name': 'Invalid Subject Code'};
            } else {
                let subj_data = subj[0].question_data;
                db.update_question_data(req, subj_data);
            }
        } else {
            db.add_subject(req);
        }
        
        const errors = req.session.errors || {};
        req.session.errors = undefined;
        res.send(JSON.stringify(errors));
    }

    async load_subjects(req, res) {
        const subject = await db.get_subjects(req);
        
        res.send(JSON.stringify(subject));
    }

    async load_questions(req, res) {
        const questions = await db.get_questions(req);
        
        res.send(JSON.stringify(questions));
    }

    update_score(req, res) {
        db.update_score(req);
    }

    async share_subject(req, res) {
        const subject_code = req.body.subject_code;
        if(subject_code != '') {
            const subj = await db.get_subject(req);

            if(subj[0] == undefined) {
                req.session.errors = {'Subject Name': 'Invalid Subject Code'};
            } else {
                db.share_subject(req, subj[0]);
            }
        }

        const errors = req.session.errors || {};
        req.session.errors = undefined;
        res.send(JSON.stringify(errors));
    }
}

/**
 * DOCU: Export Survey object to routes.
 */

module.exports = new MainController();

