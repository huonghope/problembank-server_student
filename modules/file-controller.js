var fs = require('fs').promises;
var path = require('path');
var _fs = require('fs');
var mkdirp = require('mkdirp');
var fse = require('fs-extra');
var exec = require('child_process').exec;
var moment = require('moment'); 

const ROOT= process.env.ROOT_PATH; //project path
const BOILERPLATES = process.env.BOILERPLATE_PATH
const ROOT_PROJECT= process.env.ROOT_CODE;

function createProject(childPath, language){
    const destPath = path.resolve(ROOT, childPath);
	const filePath = path.resolve(BOILERPLATES, language);
	
	if(!_fs.existsSync(filePath)) {
		throw { code: -102, msg: "파일이 존재하지 않습니다", path: filePath};
	}


	
	// 하위 폴더 구조 생성s
	fse.copy(filePath, destPath);
}
function createProjectByCategory(category,language, name, userId){
	const basicCodeProjectPath = path.resolve(BOILERPLATES, language);
	const parent_projectCategoryPath = path.resolve(ROOT_PROJECT, category);

	var today = moment(); 
	var fileName = `${today.format("YYYY-MM-DD")}_user${userId}_${name}_${language}`.replace(/\s/g, '');
	const child_projectCategoryPath = path.resolve(parent_projectCategoryPath, fileName)

	
	if(!_fs.existsSync(basicCodeProjectPath)) {
		throw { code: -102, msg: "파일이 존재하지 않습니다", path: basicCodeProjectPath};
	}

	// 하위 폴더 구조 생성s
	fse.copy(basicCodeProjectPath, child_projectCategoryPath);
}

// 해당하는 결로 code-server 및 project 생성
async function createProjectFolder(childPath){
	try {
		const projectFolder = path.resolve(ROOT, childPath);
		
		const myProjectPath = path.resolve(projectFolder, 'projects');
		const codeServerPath =  path.resolve(projectFolder, 'code-server');
	
		const defaultCodeServer = path.resolve(ROOT, 'code-server');
		await (new Promise((resolve, reject) => {
			mkdirp(myProjectPath, (err) => {
				if(err) { console.log(err); reject(err); return; }
				resolve();
			});
		}));
		await (new Promise((resolve, reject) => {
			mkdirp(codeServerPath, (err) => {
				if(err) { console.log(err); reject(err); return; }
				resolve();
			});
		}));
		
		try {
			var child = exec(`Xcopy ${defaultCodeServer} ${codeServerPath} /s/h/e/k/f/c`,
				function (error, stdout, stderr) {
					if (error !== null) {
						console.log('stdout: ' + stdout);
						console.log('stderr: ' + stderr);
						console.log('exec error: ' + error);
					}
					console.log(stdout)
			});
		} catch (error) {
			console.log(error)
		}
	} catch (error) {
		console.log(error)
	}

}
module.exports = { createProject, createProjectFolder, createProjectByCategory }