console.log_ = console.log;

let logs = [];

console.log = function() {
    let str = '';
    for (let i = 0; i < arguments.length; i++) {
        if (i < arguments.length-1) {
            str += arguments[i] + ' ';
        } else {
            str += arguments[i];
        }
    }
    console.log_(str);

    logs.push(str);
}

run = function(code) {
    new Function(code)();
}

const str = "function foo() {for(let i = 0; i < 10; i++) { console.log(i}} foo();";
run(str);
console.log(logs);

//console.log(console.logs);