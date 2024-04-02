const fs = require('fs');
const path = require('path');
const intencjePath = path.join(__dirname, '..', 'src', 'assets', 'intencje');
const ogloszeniaPath = path.join(__dirname, '..', 'src', 'assets', 'ogloszenia');

saveFilenames(intencjePath, path.join(__dirname, '..', 'src', 'assets', 'intencje.json'));
saveFilenames(ogloszeniaPath, path.join(__dirname, '..', 'src', 'assets', 'ogloszenia.json'));

function saveFilenames(scanPath, savePath) {
    fs.readdir(scanPath, (err, files) => {
        if (err) {
            return console.log('Unable to scan directory (' + scanPath + ') : ' + err);
        }
        let filenames = files.filter(file => file.endsWith('.html')).map(file => file.replace('.html', ''));
        filenames = getLatestDates(filenames);
        fs.writeFile(savePath, JSON.stringify(filenames), (err) => {
            if (err) {
                return console.log('Unable to write file (' + savePath + ') : ' + err);
            };
            console.log(savePath + ' saved');
        });
    });
}

function getLatestDates(dates) {
    // Sort the dates array in descending order
    let sortedDates = dates.sort((a, b) => new Date(b) - new Date(a));

    // Get the 10 latest dates
    let latestDates = sortedDates.slice(0, 10);

    return latestDates;
}



