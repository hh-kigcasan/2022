class Profiler {
    static queries = [];

    constructor(req, res, next) {
        this.req = req;
        this.res = res;
        this.next = next;
    }

    enable_profiler(is_enabled = true) {
        const profiler = {
            protocol: this.req.protocol,
            host: this.req.hostname,
            url: this.req.url,
            http_method: this.req.method,
            params: this.req.params,
            post: this.req.body,
            sessions: this.collect_sessions(),
            queries: Profiler.queries,
            status_code: this.res.statusCode
        }

        if (is_enabled) {
            console.log('Profiler:', profiler);
        }

        this.next();
    }

    collect_sessions() {
        const sessions = {};

        for (const property in this.req.session) {
            if (property !== 'cookie' && property !== 'errors') {
               sessions[property] = this.req.session[property];
            }
        }

        return sessions;
    }

    static collect_queries(query, data) {
        Profiler.queries = [];
        for (let i = 0; i < data.length; i++) {
            query = query.replace(`$${i+1}`, `'${data[i]}'`);
        }
        this.queries.push(query);
    }

}

module.exports = Profiler;