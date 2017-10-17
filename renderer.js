// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const fs = require("fs");
const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;
const {dialog} = require('electron').remote
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
            data = data.replace(new RegExp("@epitech.eu", 'g'), "");
            studentArray = data.split(";");
        });
    }
});
document.addEventListener('dragover', function (e) {
    e.preventDefault();
    e.stopPropagation();
});

var createTrombi = function () {


    dialog.showSaveDialog(function (fileName) {
        $("#trombiContainer").html("");
        $("#menuContainer").hide();
        $("#trombiContainer").show();
        var content = "";
        for (var i = 0; i < studentArray.length; i++) {
            content += "<div style='width: 20%;text-align: center;display: inline-block'><div><img src='./pictures/" + studentArray[i] + ".bmp' style='max-width: 100%'></div><div style='max-width: 100%;word-break: break-all;text-align: center'>" + studentArray[i] + "</div></div></div>";
        }

        $("#trombiContainer").html(content);

        // var docDefinition = {
        //     content: [
        //         {text: 'noBorders:', fontSize: 14, bold: true, pageBreak: 'before', margin: [0, 0, 0, 8]},
        //         {
        //             table: {body: []},
        //             layout: 'noBorders'
        //         }]
        // };
        // var actualArray = [];

        // pdfMake.createPdf(docDefinition).download("lemeilleurpdf.pdf");
        setTimeout(() => {
            const webContents = remote.getCurrentWebContents();

            webContents.printToPDF({
                pageSize: 'A4',
                landscape: false
            }, (err, data) => {
                fs.writeFile(fileName, data);
            });
        }, 500);
    });
};

var createExam = function () {
    dialog.showSaveDialog(function (fileName) {

        if (fileName === undefined) return;
        var arr = [];
        var finalTab = [];
        while (arr.length < studentArray.length) {
            var randomnumber = Math.ceil(Math.random() * 100 % studentArray.length);
            if (arr.indexOf(randomnumber) > -1) continue;
            arr[arr.length] = randomnumber;
        }
        fs.closeSync(fs.openSync(fileName, 'w'));
        var wstream = fs.createWriteStream(fileName);

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
    });
};

document.getElementById("createExam").onclick = function () {
    createExam();
}

document.getElementById("createTrombi").onclick = function () {
    createTrombi();
}