class Validator {
    constructor() {
        this.errors = [];
    }

    set_rules(config) {
        this.errors = [];

        for (let i = 0; i < config.length; i++) {
            const label = config[i][0];
            const value = config[i][1];
            const rules = config[i][2];

            if (rules['min_length'] !== undefined) {
                this.has_min_length(label, value, rules['min_length']);
            }
            if (rules === 'is_numeric') {
                this.is_numeric(label, value);
            }
            if (rules === 'is_email') {
                this.is_email(label, value);
            }
            if (rules['is_match'] !== undefined) {
                this.is_match(label, value, rules['is_match'], config);
            }
        }

        return this;
    }

    has_min_length(label, value, length) {
        if (value.length < 1) {
            this.errors.push(`${label} is required`);
        } else if (!(value.length >= length)) {
            this.errors.push(`${label} must at least have (${length}) characters`);
        }
    }

    is_numeric(label, value) {
        if (`${value}`.length < 1) {
            this.errors.push(`${label} is required`);
        } else if (!Number.isInteger(parseInt(value))) {
            this.errors.push(`${label} must be numeric`);
        }
    }

    is_email(label, value) { // using regex temporary only, will change this with my own codes :)
        const regEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (value.length < 1) {
            this.errors.push(`${label} is required`);
        } else if (!regEx.test(value)) {
            this.errors.push(`${label} is invalid`);
        }
    }

    is_match(label, value, is_match, config) {
        const result = this.find_match(is_match, config);

        if (result === undefined) {
            this.errors.push(`Unknown label ${is_match}`);
        } else if (result[1] !== value) {
            this.errors.push(`${label} and ${result[0]} must match`);
        } else if (value.length < 1) {
            this.errors.push(`${label} is required`);
        }
    }

    find_match(label, config) {
        let result = undefined;

        for (let i = 0; i < config.length; i++) {
            if (label === config[i][0]) {
                result = config[i];
            }
        }

        return result;
    }

    run() {
        return this.errors;
    }
}

module.exports = new Validator();