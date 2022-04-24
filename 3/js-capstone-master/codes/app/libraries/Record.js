const {fs, constants} = require("../../system/core/includes");
const ChallengeModel = require('../models/model.challenge');
const Challenge = require('./Challenge');

const Compiler = require('./Compiler');

let current_user = constants.user;

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
    static async stop_recording(is_force_stop = false) {
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

module.exports = new Record();