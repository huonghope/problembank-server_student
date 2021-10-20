const { spawn } = require('child_process');
const path = require('path');
const rs = require('randomstring');
const fs = require('fs-extra'); // TODO REFECTOR THIS
var _fs = require('fs');
const ROOT = process.env.ROOT_PATH;
const PROBLEM_PATH = process.env.DEBUG_TEMP_PATH;


const run = (projectPath, category) => {
    const sourcePath = path.resolve(ROOT, projectPath);
    let docker = null;
    switch(category.toLowerCase()) {
        case "java":
            docker = spawn("docker", ["run", "--rm", "-i", "-v", `${sourcePath}:/src`, "java-compile-run:1.0"]);
            break;
        case "c": case "cpp":
            docker = spawn("docker", ["run", "--rm", "-i", "-v", `${sourcePath}:/src`, "c-compile-run:1.0"]);
            break;
        case "python":
            docker = spawn("docker", ["run", "--rm", "-i", "-v", `${sourcePath}:/src`, "python-compile-run:1.0"]);
            break;
        case "r":
            docker = spawn("docker", ["run", "--rm", "-i", "-v", `${sourcePath}:/src`, "r-compile-run:1.0"]);
            break;
    }
    return docker;
};

const cpplint = (projectPath, category) => {
    if(category.toLowerCase() !== "cpp") return null;
    const sourcePath = path.resolve(ROOT, projectPath);
    return spawn("docker", ["run", "--rm", "-i", "-v", `${sourcePath}:/src`, "cpp-lint:1.0"]);
}

const getProblemDocker = (source, category, tempPath) => {
    let filename;
    switch(category) {
        case "java":
            filename = "Main.java"; break;
        case "cpp": 
            filename = "main.cpp"; break;
        case "c": 
            filename = "main.c"; break;
        case "python": 
            filename = "main.py";
        break;
    }
    const mainFilePath = path.resolve(tempPath, filename);
    fs.createFileSync(mainFilePath);
    fs.writeFileSync(mainFilePath, Buffer.from(source));
    let docker;
    switch(category) {
        case "java":
            docker = spawn("docker", ["run", "--rm", "-i", "-v", `${tempPath}:/src`, "java-problem-run:1.0"]);;
            break;
        case "cpp":
            docker = spawn("docker", ["run", "--rm", "-i", "-v", `${tempPath}:/src`, "cpp-problem-run:1.0"]);;
            break;
        case "c":
            docker = spawn("docker", ["run", "--rm", "-i", "-v", `${tempPath}:/src`, "c-problem-run:1.0"]);;
            break;
        case "python": default:
            docker = spawn("docker", ["run", "--rm", "-i", "-v", `${tempPath}:/src`, "python-compile-run:1.0"]);;
            break;
    }

    return docker; 
}

module.exports = { run, cpplint, getProblemDocker };