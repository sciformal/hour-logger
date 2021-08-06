module.exports = {
    word: (str) => {
        return (str !== '' && (typeof str === 'string') && str.match(/^[A-Za-z]+$/));
    },
    str: (str) => {
        return (str !== '' && (typeof str === 'string'));
    },
    studentNum: (num) => {
        return num.length === 8 && /^\d\d\d\d\d\d\d\d$/.test(num);
    },
    password: (pass) => {
        return /.........*/.test(pass);
    }
}