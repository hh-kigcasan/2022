const Record = require("./Record");

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
                    
                    if (output !== test_cases[i].output) {
                        result.has_error = true;
                    } else {
                        result.has_error = false;
                    }
                    
                    result.test_cases.push({value: test_cases[i].value, output: test_cases[i].output, is_success: output === test_cases[i].output});
                }
                
                return result;`)();

            result.has_error = run_result.has_error;

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

module.exports = new Compiler();