const Controller = require("../../system/core/controller");
const ChallengeModel = require("../models/model.challenge");
const UserModel = require("../models/model.user");

class APIController extends Controller {
    constructor() {
        super(arguments);
    }

    /*  DOCU: Sends back all user challenges history html
        Owner: Jette
    */
    async get_all_user_challenges_history() {
        const histories = await ChallengeModel.get_all_user_challenges_history(this.get('id'));

        if (histories.length > 0) {
            const selected_index = 0;
            const history = histories[selected_index];
            history.test_cases = JSON.parse(history.test_cases);
            this.render('partials/history', {histories: histories, selected_index: selected_index, history: history})
        } else {
            this.render('partials/empty', 'History empty')
        }

    }

    /*  DOCU: Sends back video html partial
        Owner: Jette
    */
    async get_video() {
        if (await ChallengeModel.is_challenge_retake(this.get('id'), this.session('user').id)) {
            const user_challenge_history = await ChallengeModel.get_user_challenge_history(this.get('id'), this.session('user').id);
            this.render('partials/video', user_challenge_history);
        } else{
            this.render('partials/empty');
        }
    }

    /*  DOCU: Sends backs editor html partial
        Owner: Jette
    */
    async get_editor() {
        const challenge = await ChallengeModel.get_challenge(this.get('id'));
        challenge.test_cases = await JSON.parse(challenge.test_cases);
        this.render('partials/editor', challenge);
    }

    /*  DOCU: Sends back nav html partial
        Owner: Jette
    */
    async get_nav() {
        const ranking = await UserModel.get_user_ranking(this.get('id'));
        const user = await UserModel.get_user_by_id(this.get('id'));
        const total_no_of_challenges = await ChallengeModel.total_no_of_challenges();
        this.render('partials/nav', {data: {user: user, ranking: ranking, total_no_of_challenges: total_no_of_challenges}});
    }
}

module.exports = APIController;
