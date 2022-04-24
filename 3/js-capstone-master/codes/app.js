const {body_parser, path, express, app, constants, Profiler, io, fs} = require('./system/core/includes');

app.use(express.static(path.join(__dirname, './', constants.directories.public)));
app.use(body_parser.urlencoded(constants.body_parser));
app.set('views', path.join(__dirname, './', constants.directories.views));
app.set('view engine', constants.view_engine);

let current_user;

function middleware(req, res, next) {
    current_user = req.session['user'];
    new Profiler(req, res, next).enable_profiler(false);
}

const user_route = require('./routes/route.user');
const api_route = require('./routes/route.api');

app.use('/', middleware,  user_route);
app.use('/', middleware,  api_route);

const ChallengeModel = require("./app/models/model.challenge");

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

class Compiler {
    /*  DOCU: Clear compiler logs
        Owner: Jette
    */
    static clear_logs(socket, is_from_replay = false) {
        if (is_from_replay) {
            socket.emit('display_replay_logs', {test_cases: '', output: ''});
        } else {
            socket.emit('display_logs', {test_cases: '', output: ''});
        }
    }

    /*  DOCU: Submits the code
        Owner: Jette
    */
    static async submit(socket) {
        await Record.stop_recording(false, socket);
    }

    /*  DOCU: Returns test case in html string
        Owner: Jette
    */
    static get_test_case_html_string(test_case) {
        const color = test_case.is_success ? 'success' : 'muted';
        return `<p class='${color}'><span class="iconify" data-icon="iconoir:security-pass"></span><span class='${color}'>operation([${test_case.value}]) === ${test_case.output}</span></p>`;
    }

    /*  DOCU: Returns output in html string
        Owner: Jette
    */
    static get_output_html_string(message, is_error = false) {
        if (is_error) {
            return `<p class="danger">${message}</p>`;
        } else {
            return `<p class="muted">operation([${message.value}]) === ${message.output}:<br><span class="iconify" data-icon="bi:arrow-return-right"></span>${message.log}</p>`;
        }
    }

    /*  DOCU: Returns all test cases in html string
        Owner: Jette
    */
    static get_test_cases_html_string(test_cases) {
        let test_cases_html_string = '';
        for (let i = 0; i < test_cases.length; i++) {
            test_cases_html_string += `<p class="muted"><span class="iconify" data-icon="iconoir:security-pass"></span>operation([${test_cases[i].value}]) === ${test_cases[i].output}</p>`;
        }
        return test_cases_html_string;
    }

    /*  DOCU: Runs the code
        Owner: Jette
    */
    static async run(socket, code, challenge) {
        const result = {test_cases: '', output: '', has_error: undefined}
        const test_cases_str = JSON.stringify(challenge.test_cases);

        try {
            const run_result = new Function(`
                const result = {test_cases: [], output: [], has_error: undefined};
                //const test_cases = [{value: [1, 1, 1], output: 3},{value: [2, 2, 2], output: 6},{value: [3, 3, 3], output: 9}];
                const test_cases = ${test_cases_str};
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
                
                const operation = function(array) {
                    ${code.replace(/console.log/g, 'fetch_log')};
                };
                
                for (let i = 0; i < test_cases.length; i++) {
                    const output = operation(test_cases[i].value);
                    
                    const is_success = output+'' === test_cases[i].output+'';
                    
                    if (!is_success) {
                        result.has_error = true;
                    } else {
                        result.has_error = false;
                    }
                    
                    result.test_cases.push({value: test_cases[i].value, output: test_cases[i].output, is_success: is_success});
                }
                
                return result;`)();

            result.has_error = run_result.has_error;

            console.log(result);

            for (let i = 0; i < run_result.test_cases.length; i++) {
                result['test_cases'] += this.get_test_case_html_string(run_result.test_cases[i]);

                if (run_result.output.length > 0) {
                    result.output += this.get_output_html_string({value: run_result.test_cases[i].value, output: run_result.test_cases[i].output, log: run_result.output[i]}, false);
                }
            }

        } catch(error) {
            result.test_cases = this.get_test_cases_html_string(challenge.test_cases);
            result.output = this.get_output_html_string(error.message, true);
        }

        Record.add_frame(result);

        if (result.has_error === false) {
            await Compiler.submit(socket);
        }

        socket.emit('display_challenge_logs', {test_cases: result.test_cases, output: result.output});
    }
}

class Record {
    static playback_speed_index = 0;
    static playing_interval;
    static is_playing = false;
    static record = {};
    static timer_ended_at = undefined;
    static timer = {milliseconds: 0, seconds: 0, minutes: 0, hours: 0};
    static default_interval_milliseconds = 10;
    static recording_interval;
    static is_recording = false;

    /*  DOCU: Kill processes
        Owner: Jette
    */
    static async kill_processes(socket) {
        await Record.stop_recording(true);
        Record.stop_playing(socket);
    }

    /*  DOCU: Stops playing the records
        Owner: Jette
    */
    static stop_playing(socket) {
        if (this.is_playing) {
            clearInterval(this.playing_interval);

            this.is_playing = false;

            socket.emit('stop_playing');

            console.log('stop playing record');
        } else {
            Compiler.clear_logs(socket, true);
        }
    }

    /*  DOCU: Starts playing the record
        Owner: Jette
    */
    static start_playing(socket, filepath, record_index = 0, timer = {milliseconds: 0, seconds: 0, minutes: 0, hours: 0}) {
        this.stop_playing(socket);
        this.is_playing = true;

        const playback_speeds = [10, 8, 6, 4, 2], full_progress_percentage = 100, excess_frame = 1;

        const record = JSON.parse(fs.readFileSync(`./${constants.directories.private}/${filepath}`).toString());
        const record_length = Object.keys(record).length-excess_frame;

        const callback = function() {
            const current_frame = record[Object.keys(record)[record_index]];
            const current_timer = Record.get_timer_string(Record.update_timer(timer));

            if (record_index > record_length) {
                Record.stop_playing(socket);
            } else if (typeof current_frame !== 'string' && current_frame !== undefined) {
                socket.emit('display_replay_logs', {test_cases: current_frame['test_cases'], output: current_frame['output']});
            } else {
                socket.emit('display_frame', {filepath: filepath, current_frame: current_frame, current_timer: current_timer, progress_percentage: ((record_index/record_length) * full_progress_percentage)});
            }

            record_index++;
        }

        this.playing_interval = setInterval(callback, playback_speeds[this.playback_speed_index]);

        socket.on('jump_frame', (properties) => {
            const width = (properties.progress_x + properties.progress_width) - properties.progress_x;
            const current_progress_percentage = ((properties.x - properties.progress_x)/width) * full_progress_percentage;
            record_index = parseInt((current_progress_percentage * record_length)/full_progress_percentage);
        });

        socket.on('change_playback_speed', (index) => {
            this.playback_speed_index = index;
            if (this.is_playing) {
                clearInterval(this.playing_interval);
                this.playing_interval = setInterval(callback, playback_speeds[this.playback_speed_index]);
            }
        });

        console.log('start playing record:', filepath);
    }

    /*  DOCU: Returns last record in html string
        Owner: Jette
    */
    static get_last_record_html_string(record) {
        return `<p class="record" data-filepath="${record.record_path}"><span class="iconify" data-icon="gg:play-button-o" data-height="14" data-width="14"></span> ${record.title} <span class="duration">${record.record_ended_at}</span></p>`;
    }

    /*  DOCU: Resets recording properties
        Owner: Jette
    */
    static reset_recording_properties() {
        this.is_recording = false;
        clearInterval(this.recording_interval);
        this.timer = {milliseconds: 0, seconds: 0, minutes: 0, hours: 0};
        this.timer_ended_at = undefined;
        this.record = {};
    }

    /*  DOCU: Removes milliseconds indexes from ended_at string
        Owner: Jette
   */
    static get_duration(record_ended_at) {
        let duration = '';
        const milliseconds_indexes = 3;
        for (let i = 0; i < record_ended_at.length - milliseconds_indexes; i++) {
            duration += record_ended_at[i];
        }
        return duration;
    }

    /*  DOCU: Creates new file or retrieve file path whether the file already exists or not
        Owner: Jette
    */
    static async create_file() {
        const file = {};

        if (await ChallengeModel.is_challenge_retake(Challenge.get_challenge().id, current_user.id)) {
            const user_challenge_history = await ChallengeModel.get_user_challenge_history(Challenge.get_challenge().id, current_user.id);

            file.path = user_challenge_history.record_path;
            file.full_path = `${constants.directories.private}/${user_challenge_history.record_path}`
            file.is_already_exist = true;
        } else {
            const filename = `${current_user.id}${Date.now()}.txt`;
            const filepath = `records/${filename}`;

            fs.createWriteStream(`./${constants.directories.private}/${filepath}`);

            file.path = filepath;
            file.full_path = `${constants.directories.private}/${filepath}`
            file.is_already_exist = false;
        }

        return file;
    }

    /*  DOCU: Stops recording
        Owner: Jette
    */
    static async stop_recording(is_force_stop = false, socket) {
        if (Record.is_recording && !is_force_stop) {
            const file = await this.create_file();

            fs.writeFile(file.full_path, JSON.stringify(this.record), async function(error) {
                if (error) {
                    console.error('write file error:', error);
                } else if (file.is_already_exist) {
                    await ChallengeModel.update_user_challenge_history([Record.timer_ended_at, Record.get_duration(Record.timer_ended_at), current_user.id, Challenge.get_challenge().id]);
                } else {
                    await ChallengeModel.add_user_challenge_history([current_user.id, Challenge.get_challenge().id, Record.timer_ended_at, Record.get_duration(Record.timer_ended_at), file.path]);
                }

                Record.reset_recording_properties();

                socket.emit('alert_success_message', 'Congratulations! You passed all the test cases!');

                console.log('recording has stopped', file.path);
            });

        } else if (Record.is_recording && is_force_stop) {
            this.reset_recording_properties();
        }
    }

    /*  DOCU: Adds new frame to current record
        Owner: Jette
    */
    static add_frame(frame) {
        this.record[this.get_timer_string(this.timer)] = frame;
    }

    /*  DOCU: Converts timer to string
        Owner: Jette
    */
    static get_timer_string(timer) {
        const string_timer = {};

        for (const key in timer) {
            if (timer[key] < this.default_interval_milliseconds) {
                string_timer[key] = `0${timer[key]}`;
            } else {
                string_timer[key] = `${timer[key]}`;
            }
        }

        return `${string_timer.hours}:${string_timer.minutes}:${string_timer.seconds}:${string_timer.milliseconds}`;
    }

    /*  DOCU: Updates timer milliseconds by 1 every 10 milliseconds passed
        Owner: Jette
    */
    static update_timer(timer) {

        if (timer.milliseconds > 99) {
            timer.seconds += 1;
            timer.milliseconds = 0;
        }

        if (timer.seconds > 59) {
            timer.minutes += 1;
            timer.seconds = 0;
        }

        if (timer.minutes > 59) {
            timer.hours += 1;
            timer.minutes = 0;
        }

        timer.milliseconds++;

        return timer;
    }

    /*  DOCU: Starts recording
        Owner: Jette
    */
    static async start_recording(socket, challenge_id) {
        if (!this.is_recording) {
            await Challenge.set_challenge(challenge_id);

            this.is_recording = true;
            this.recording_interval = setInterval(function() {
                Record.update_timer(Record.timer);
                Record.timer_ended_at = Record.get_timer_string(Record.timer);

                socket.emit('display_timer_running', Record.timer_ended_at);
            }, this.default_interval_milliseconds);

            socket.emit('display_run_button');

            console.log('recording in progress...');
        }
    }
}


io.on('connection', function(socket) {

    socket.on('kill_processes', async function() { // signaled when partial is loaded
        await Record.kill_processes(socket);
    });

    socket.on('start_playing', function(filepath) { // signaled when record is played
        Record.start_playing(socket, filepath);
    });

    socket.on('disconnect', async function() { // signaled when page is about to unload
        await Record.kill_processes(socket);
    });

    socket.on('run_code', function(code) { // signaled when run button is clicked
        Compiler.run(socket, code, Challenge.get_challenge());
    });

    socket.on('add_frame', function(code) { // signaled while recording is in progress
        Record.add_frame(code);
    });

    socket.on('start_recording', function (challenge_id) { // signaled when textarea from editor is changed for the first time
        Record.start_recording(socket, challenge_id);
    });
});

//npx kill-port 2003

