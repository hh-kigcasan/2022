const {body_parser, path, express, app, constants, Profiler} = require('./system/core/includes');

app.use(express.static(path.join(__dirname, './', constants.directories.public)));
app.use(body_parser.urlencoded(constants.body_parser));
app.set('views', path.join(__dirname, './', constants.directories.views));
app.set('view engine', constants.view_engine);

function profiler(req, res, next) {
    new Profiler(req, res, next).enable_profiler(false);
}

const main_route = require('./routes/route.main');
app.use('/', profiler, main_route);

const server = app.listen(constants.port);
const io = require('socket.io')(server);

const challenges = [
    {
        id: 0,
        is_taken: false,
        problem: 'Get the sum of array numbers',
        test_cases: [
            {value: [1, 1, 1], output: 3},
            {value: [2, 2, 2], output: 6},
            {value: [3, 3, 3], output: 9}
        ],
        test_cases_str: `[
            {value: [1, 1, 1], output: 3},
            {value: [2, 2, 2], output: 6},
            {value: [3, 3, 3], output: 9}
        ]`
    }
];

class Compiler {
    static run(code, challenge) {
        return new Function(`
            const result = {test_cases: [], output: [], has_error: undefined};
            const test_cases = ${challenge.test_cases_str};
            const fetch_log = function() {                               
                let str = '';
                
                for (let i = 0; i < arguments.length; i++) {
                    if (i < arguments.length-1) {
                        str += arguments[i] + ' ';
                    } else {
                        str += arguments[i];
                    }
                }                    
                
                console.log(str);
                result.output.push(str);
            }
            
            const operation = function(value) {
                ${code.replace(/console.log/g, 'fetch_log')};
            };
            
            for (let i = 0; i < test_cases.length; i++) {
                const output = operation(test_cases[i].value);
                
                if (output !== test_cases[i].output) {
                    result.has_error = true;
                } else {
                    result.has_error = false;
                }
                
                result.test_cases.push({test_case: test_cases[i].value, is_success: output === test_cases[i].output});
            }
            
            return result;
        `)();
    }

    static get_result(code, challenge) {
        let result = {test_cases: '', output: '', has_error: undefined};

        try {
            const response = Compiler.run(code, challenge);

            result['has_error'] = response.has_error;

            for (let i = 0; i < response.test_cases.length; i++) {
                const color = response.test_cases[i].is_success ? 'success' : 'muted';

                result['test_cases'] += `<p class='${color}'><span class="iconify" data-icon="iconoir:security-pass"></span><span>${response.test_cases[i].test_case}</span></p>`;

                if (response.output.length > 0) {
                    result['output'] += `<p>${response.test_cases[i].test_case}:<br><span class="iconify" data-icon="bi:arrow-return-right"></span>${response.output[i]}</p>`;
                }

            }

        } catch (e) {
            result['test_cases'] = Compiler.get_test_cases(challenge.test_cases);
            result['output'] = `<p class="danger">${e.message}</p>`;
        }

        return result;
    }

    static get_test_cases(test_cases) {
        let html_str = '';
        for (let i = 0; i < test_cases.length; i++) {
            html_str += `<p class="muted"><span class="iconify" data-icon="iconoir:security-pass"></span>[${test_cases[i].value}]</p>`;
        }
        return html_str;
    }

    static submit(socket) {
        if (Record.is_recording) {
            Record.end();
            socket.emit('end_record', Record.format_timestamp(Record.raw_timestamp));
            socket.emit('save_record', Record.get_last_record());
        }
    }

    static clear(is_input = false, socket) {
       if (is_input) {
           socket.emit('display_test_cases', '');
           socket.emit('display_output', '');
       } else {
           socket.emit('replay_display_test_cases', '');
           socket.emit('replay_display_output', '');
       }
    }

}

class Record {
    static raw_timestamp = {milliseconds: 0, seconds: 0, minutes: 0, hours: 0}
    static interval;
    static is_recording = false;
    static record = {};
    static ended_at;
    static records = {};
    static play_interval;
    static is_playing_record = false;
    static speed = 0;
    static max_percentage = 100;

    static start(socket) {
        console.log('recording in progress');

        this.is_recording = true;
        this.interval = setInterval(function () {
            Record.timer(socket);
        }, 10);
    }

    static end(force_stop = false) {
        console.log('recording has ended');

        if (!force_stop) {
            this.records[this.get_info().id] = this.get_info();
        }

        this.reset();
    }

    static timer(socket) {
        this.run_timer(this.raw_timestamp);
        this.ended_at = Record.format_timestamp(this.raw_timestamp);

        socket.emit('set_timestamp', this.format_timestamp(this.raw_timestamp));
    }

    static run_timer(raw_timestamp) {
        raw_timestamp.milliseconds++;

        if (raw_timestamp.milliseconds > 99) {
            raw_timestamp.seconds += 1;
            raw_timestamp.milliseconds = 0;
        }

        if (raw_timestamp.seconds > 59) {
            raw_timestamp.minutes += 1;
            raw_timestamp.seconds = 0;
        }

        if (raw_timestamp.minutes > 59) {
            raw_timestamp.hours += 1;
            raw_timestamp.minutes = 0;
        }

        return raw_timestamp;
    }

    static format_timestamp(raw_timestamp) {
        const timestamp = {};

        for (const property in raw_timestamp) {
            if (raw_timestamp[property] < 10) {
                timestamp[property] = `0${raw_timestamp[property]}`;
            } else {
                timestamp[property] = `${raw_timestamp[property]}`;
            }
        }

        return `${timestamp.hours}:${timestamp.minutes}:${timestamp.seconds}:${timestamp.milliseconds}`;
    }

    static add_record(data) {
        this.record[this.format_timestamp(this.raw_timestamp)] = data;
    }

    static get_info() {
        return {
            ended_at: this.ended_at,
            id: Date.now(),
            record: this.record
        }
    }

    static reset() {
        this.raw_timestamp = {milliseconds: 0, seconds: 0, minutes: 0, hours: 0}
        this.is_recording = false;
        clearInterval(this.interval);
        this.record = {};
        this.ended_at = this.format_timestamp(this.raw_timestamp);
    }

    static get_last_record() {
        const record = this.records[Object.keys(this.records)[Object.keys(this.records).length - 1]];
        return `<li id="${record.id}"><span class="iconify play" data-icon="bx:play-circle"></span> <span id="timestamp">${record.ended_at}</span> <span class="iconify remove" data-icon="akar-icons:cross"></span></li>`;
    }

    static play(record_id, socket, raw_timestamp = {milliseconds: 0, seconds: 0, minutes: 0, hours: 0}, count = 0) {
        if (!this.is_playing_record) {
            this.is_playing_record = true;

            const playbacks = [10, 8, 6, 4, 2];
            const record_info = this.records[record_id];
            const progress_max_count = Object.keys(record_info.record).length;

            this.play_interval = setInterval(function() {
                const text = record_info.record[Object.keys(record_info.record)[count]];
                const timestamp = Record.format_timestamp(Record.run_timer(raw_timestamp));

                if (count > progress_max_count) {
                    setTimeout(function() {
                        Compiler.clear(false, socket);
                    }, 100)
                    Record.stop(record_id, socket);
                } else {
                    if (typeof text !== 'string' && text !== undefined) {
                        socket.emit('replay_display_test_cases', text['test_cases']);
                        socket.emit('replay_display_output', text['output']);
                    } else {
                        socket.emit('start_playing_record', {record_id: record_id, timestamp: timestamp, text: text, progress: ((count/progress_max_count) * Record.max_percentage)});
                    }
                }

                count++;
            }, playbacks[this.speed]);

            //console.log('playing record:', record_id, 'w/ speed of', playbacks[this.speed]);

            socket.on('jump', (data) => {
                const width = (data.progress_x + data.progress_width) - data.progress_x;
                const progress_percentage = ((data.x - data.progress_x)/width) * Record.max_percentage;
                console.log('max count:', progress_max_count, 'count:', parseInt(progress_percentage * progress_max_count)/Record.max_percentage);

                Compiler.clear(false, socket);

                Record.stop(record_id, socket, raw_timestamp, parseInt((progress_percentage * progress_max_count)/Record.max_percentage))
            });
        }

        socket.on('change_playback_speed', (data) => {
            Record.stop(record_id, socket, raw_timestamp, count)
        });
    }

    static stop(record_id, socket, raw_timestamp = undefined, count = undefined) {
        if (this.is_playing_record) {
            clearInterval(this.play_interval);
            this.is_playing_record = false;

            if (raw_timestamp !== undefined && count !== undefined) {
                this.play(record_id, socket, raw_timestamp, count);
                console.log('continue');
            } else {
                socket.emit('stop_playing_record', {record_id: record_id, ended_at: Record.records[record_id].ended_at});
                console.log('stop');
            }
        }
    }
}

io.on('connection', (socket) => {
    let challenge;

    socket.on('display_challenge', (data) => {
        challenge = challenges[data];

        socket.emit('display_challenge', {test_cases: Compiler.get_test_cases(challenge.test_cases), output: '', problem: challenge.problem, challenge_id: challenge.id, is_taken: challenge.is_taken});
    });

    socket.on('start_record', () => {
        if (!Record.is_recording) {
            Record.start(socket);
            socket.emit('start_record');
            Compiler.clear(true, socket);
        }
    });

    socket.on('add_record', (data) => {
        Record.add_record(data);
    });

    socket.on('remove_record', (data) => {
       delete Record.records[data];

       console.log(Record.records);
       socket.emit('remove_record', data);
    });

    socket.on('start_playing_record', (data) => {
        Record.play(data, socket);
    });

    socket.on('stop_playing_record', (data) => {
        Record.stop(data, socket);
    });

    socket.on('change_playback_speed', (data) => {
        Record.speed = data;
        console.log('change playback speed', Record.speed);
    });

    socket.on('disconnect', function() {
        if (Record.is_recording) {
            Record.end(true);
        }
    });

    socket.on('run_code', (code) => { // signaled when run button is triggered
        const result = Compiler.get_result(code, challenge);

        Record.add_record(result);

        if (result.has_error === false) {
            Compiler.submit(socket);
        }

        socket.emit('display_test_cases', result['test_cases']);
        socket.emit('display_output', result['output']);
    });
});

//npx kill-port 2003

