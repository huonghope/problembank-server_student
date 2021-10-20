var exec = require('child_process').exec;
var fse = require('fs-extra');
var path = require('path');
var mkdirp = require('mkdirp');

const ROOT= process.env.ROOT_PATH; //project path
function runDocker(name, home , port) {
    // const filePath = path.resolve(ROOT, 'code-server');
    // const destPath = path.resolve(ROOT, 'user1/code-server');
    // const dir =  path.resolve(ROOT, 'user1/code-server');
    // console.log(destPath, filePath)
    // mkdirp(dir, async function() {
    //     fse.copy(filePath, destPath);
    // })
    console.log(`${__dirname}/make-container.sh ${name} ${home} ${port}`)
    try {
        var child = exec(`${__dirname}/make-container.sh ${name} ${home} ${port}`,
            function (error, stdout, stderr) {
                if (error !== null) {
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    console.log('exec error: ' + error);
                }
        });
    } catch (error) {
        console.log(error)
    }

}
module.exports = { runDocker };