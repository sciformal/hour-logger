
module.exports = {
    word: (str) => {
        return (str != '' && (typeof str === 'string') && str.match(/^[A-Za-z]+$/));
    },
    str: (str) => {
        return (str != '' && (typeof str === 'string'));
    },
    email: (email) => {
        return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email);
    },
    studentNum: (num) => {
        return num.length === 8 && /^\d\d\d\d\d\d\d\d$/.test(num);
    },
    password: (pass) => {
        return /.........*/.test(pass);
    }
}