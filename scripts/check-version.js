const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
const js = fs.readFileSync('www/script.js','utf8');
const gradle = fs.readFileSync('android/app/build.gradle','utf8');
console.log('package.json:', pkg.version);
console.log('script.js VERSION_APP:', (js.match(/VERSION_APP\s*=\s*["']([^"']+)/)||[])[1]);
console.log('Gradle versionName:', (gradle.match(/versionName\s+["']([^"']+)/)||[])[1]);
console.log('Gradle versionCode:', (gradle.match(/versionCode\s+(\d+)/)||[])[1]);
