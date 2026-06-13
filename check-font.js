const fs = require('fs');

function readFontName(filePath) {
    const buffer = fs.readFileSync(filePath);
    
    // Very basic search for "Adobe" in the buffer
    const str = buffer.toString('utf8');
    const str16 = buffer.toString('utf16le');
    const str16be = buffer.toString('utf16be');
    
    console.log(`Checking ${filePath}:`);
    if (str.includes('Adobe') || str16.includes('Adobe') || str16be.includes('Adobe')) {
        console.log('=> Found "Adobe" inside the font file metadata!');
        let idx = str.indexOf('Adobe');
        if(idx !== -1) console.log('Snippet (utf8):', str.substring(Math.max(0, idx - 20), idx + 20).replace(/[^a-zA-Z0-9 ]/g, '.'));
        
        idx = str16be.indexOf('Adobe');
        if(idx !== -1) console.log('Snippet (utf16be):', str16be.substring(Math.max(0, idx - 20), idx + 20).replace(/[^a-zA-Z0-9 ]/g, '.'));
    } else {
        console.log('=> No "Adobe" string found.');
    }
}

readFontName('public/fonts/montserrat-arabic/alfont_com_Montserrat-Arabic-Regular.ttf');
readFontName('public/fonts/montserrat-arabic/Montserrat-Arabic-Regular.ttf');
