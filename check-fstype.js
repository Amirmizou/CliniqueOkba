const fs = require('fs');

function checkFsType(filePath) {
    const buffer = fs.readFileSync(filePath);
    
    // Find OS/2 table
    // Font header starts with sfnt version (4 bytes), numTables (2 bytes), etc.
    const numTables = buffer.readUInt16BE(4);
    let os2Offset = -1;
    
    // Table directory entries are 16 bytes each, starting at byte 12
    for (let i = 0; i < numTables; i++) {
        const entryOffset = 12 + (i * 16);
        const tag = buffer.toString('ascii', entryOffset, entryOffset + 4);
        if (tag === 'OS/2') {
            os2Offset = buffer.readUInt32BE(entryOffset + 8);
            break;
        }
    }
    
    if (os2Offset !== -1) {
        // OS/2 table found. fsType is at offset 8 within the OS/2 table.
        const fsType = buffer.readUInt16BE(os2Offset + 8);
        console.log(`${filePath} - fsType: ${fsType.toString(16).toUpperCase()} (hex) - ${fsType} (dec)`);
        
        // Check for restrictive embedding
        if ((fsType & 0x0002) !== 0) {
            console.log('  ⚠️ Restricted License Embedding (Browser WILL block this web font)');
        }
        if ((fsType & 0x0100) !== 0) {
            console.log('  ⚠️ No Subsetting');
        }
        if ((fsType & 0x0200) !== 0) {
            console.log('  ⚠️ Bitmap embedding only');
        }
        if (fsType === 0) {
            console.log('  ✅ Installable embedding (Browser will load this web font)');
        }
    } else {
        console.log(`${filePath} - OS/2 table not found!`);
    }
}

checkFsType('public/fonts/montserrat-arabic/alfont_com_Montserrat-Arabic-Regular.ttf');
checkFsType('public/fonts/montserrat-arabic/Montserrat-Arabic-Regular.ttf');
checkFsType('public/fonts/lemon-milk/lemon_milk/LEMONMILK-Regular.otf');
