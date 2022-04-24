const ChallengeModel = require('../models/model.challenge');

class Challenge {
    static challenge;

    /*  DOCU: Sets the challenge by challenge id
        Owner: Jette
    */
    static async set_challenge(challenge_id) {
        const challenge = await ChallengeModel.get_challenge(challenge_id);
        challenge.test_cases = JSON.parse(challenge.test_cases);
        this.challenge = challenge;
    }

    /*  DOCU: Returns a challenge by challenge id
        Owner: Jette
    */
    static get_challenge() {
        return this.challenge;
    }
}

