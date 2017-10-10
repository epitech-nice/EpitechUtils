// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const fs = require("fs");

var studentArray = [];

document.addEventListener('drop', function (e) {
    e.preventDefault();
    e.stopPropagation();

    for (let f of e.dataTransfer.files) {
        fs.readFile(f.path, 'utf-8', (err, data) => {
            if (err) {
                alert("An error ocurred reading the file :" + err.message);
                return;
            }

            // Change how to handle the file content
            data = data.replace(new RegExp("present\n", 'g'), "");
            data = data.replace(new RegExp("\n", 'g'), "");
            studentArray = data.split(";");
        });
    }
});
document.addEventListener('dragover', function (e) {
    e.preventDefault();
    e.stopPropagation();
});

var createTrombi = function () {

};

var createExam = function () {
    var arr = [];
    var finalTab = [];
    while (arr.length < studentArray.length) {
        var randomnumber = Math.ceil(Math.random() * 100 % studentArray.length);
        if (arr.indexOf(randomnumber) > -1) continue;
        arr[arr.length] = randomnumber;
    }
    fs.closeSync(fs.openSync(new Date().toDateString() + 'EXAM.txt', 'w'));
    var wstream = fs.createWriteStream(new Date().toDateString() + 'EXAM.txt');

    var writeToStream = function (i) {
        for (; i < studentArray.length; i++) {
            if (!wstream.write(studentArray[i] + " " + arr[i] + '\n')) {
                // Wait for it to drain then start writing data from where we left off
                wstream.once('drain', function () {
                    writeToStream(i + 1);
                });
                return;
            }
            finalTab[i] = {student: studentArray[i], number: arr[i]};
        }
        wstream.end();
    };

    writeToStream(0);
};

document.getElementById("createExam").onclick = function () {
    createExam();
}