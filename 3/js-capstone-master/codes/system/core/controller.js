const {query_string, axios, constants, io} = require("../../system/core/includes");
const {callback} = require("pg/lib/native/query");

class Controller {
    constructor() {
        this.req = arguments[0][0];
        this.res = arguments[0][1];
        this.io = io;
    }

    render(view, data = {}) {
        data['user'] = this.session('user');

        return this.res.render(view, data);
    }

    redirect(path) {
        return this.res.redirect(path);
    }

    send(body) {
        return this.res.send(body);
    }

    path() {
        return this.req.path;
    }

    json(body) {
        return this.res.json(body);
    }

    post(field_name = null) {
        if (this.get('id')) {
            this.req.body['id'] = this.get('id');
        }
        return field_name ? this.req.body[field_name] : this.req.body;
    }

    get(param = null) {
        return param ? this.req.params[param] : this.req.params;
    }

    method() {
        return this.req.method;
    }

    flash(label, data = null) {
        if (data !== null) {
            this.req.session[label] = data;
        } else {
            const flash = this.req.session[label] ? this.req.session[label] : [];
            this.req.session[label] = [];
            return flash;
        }
    }

    session(label, data = null) {
        if (data !== null) {
            this.req.session[label] = data;
        } else {
            return this.req.session[label];
        }
    }

    session_destroy() {
        this.req.session.destroy();
    }

    fetch(path, user_id = undefined, data = undefined) {
        if (data !== undefined) {
            return axios.get(`${constants.base_url}${path}`, query_string.stringify(data));
        } else if (user_id === undefined) {
            return axios.get(`${constants.base_url}${path}/${this.session('user').id}`);
        } else {
            return axios.get(`${constants.base_url}${path}`);
        }

    }

    goto(path) {
        axios.get(`${constants.base_url}${path}`);
    }
}

module.exports = Controller;