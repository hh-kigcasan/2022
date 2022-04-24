class Controller {
    constructor() {
        this.req = arguments[0][0];
        this.res = arguments[0][1];
    }

    render(view, data = undefined) {
        if (data && data['user']) {
            data['user'] = this.session('user');
        }

        return this.res.render(view, data);
    }

    redirect(path) {
        return this.res.redirect(path);
    }

    send(body) {
        return this.res.send(body);
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



}

module.exports = Controller;