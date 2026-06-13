const fs = require('fs');

function scanForAdobe(filePath) {
    const buffer = fs.readFileSync(filePath);
    let found = false;
    
    // Scan for A d o b e (utf-16be encoding: 0x00 0x41 0x00 0x64 0x00 0x6F 0x00 0x62 0x00 0x65)
    // and ASCII 'Adobe'
    for (let i = 0; i < buffer.length - 10; i++) {
        // ASCII check
        if (buffer[i] === 0x41 && buffer[i+1] === 0x64 && buffer[i+2] === 0x6F && buffer[i+3] === 0x62 && buffer[i+4] === 0x65) {
            console.log(`Found 'Adobe' (ASCII) in ${filePath} at offset ${i}`);
            // extract some context
            let start = Math.max(0, i - 10);
            let end = Math.min(buffer.length, i + 30);
            let context = '';
            for(let j=start; j<end; j++) {
                context += (buffer[j] >= 32 && buffer[j] <= 126) ? String.fromCharCode(buffer[j]) : '.';
            }
            console.log('Context:', context);
            found = true;
        }
        
        // UTF-16BE check
        if (buffer[i] === 0x00 && buffer[i+1] === 0x41 && 
            buffer[i+2] === 0x00 && buffer[i+3] === 0x64 && 
            buffer[i+4] === 0x00 && buffer[i+5] === 0x6F && 
            buffer[i+6] === 0x00 && buffer[i+7] === 0x62 && 
            buffer[i+8] === 0x00 && buffer[i+9] === 0x65) {
            console.log(`Found 'Adobe' (UTF-16BE) in ${filePath} at offset ${i}`);
            // extract context
            let start = Math.max(0, i - 20);
            let end = Math.min(buffer.length, i + 40);
            let context = '';
            for(let j=start; j<end; j+=2) {
                let charCode = buffer.readUInt16BE(j);
                context += (charCode >= 32 && charCode <= 126) ? String.fromCharCode(charCode) : '.';
            }
            console.log('Context:', context);
            found = true;
        }
    }
    
    if (!found) {
        console.log(`No 'Adobe' found in ${filePath}`);
    }
}

scanForAdobe('public/fonts/montserrat-arabic/alfont_com_Montserrat-Arabic-Regular.ttf');
scanForAdobe('public/fonts/montserrat-arabic/Montserrat-Arabic-Regular.ttf');
