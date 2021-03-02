// Here you put the packages for node.js
const inquirer = require('inquirer');
const path = require('path');
const util = require('util');
const fs = require('fs');


// Here you const for the team members lib
const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');


//Here you put the Const for the rendering engine.
const Logger = require('./logger');
const writeFileAsync = util.promisify(fs.writeFile);
const OUTPUT_DIR = path.resolve(__dirname, 'output');
const outputPath = path.join(OUTPUT_DIR, 'team.html');
const render = require('./lib/htmlRenderer');
const log = new Logger();
//* Blank array to be filled in with pushed constructors classes.
const teamMembersArray = [];


function cliIntro() {
	inquirer.prompt(cliIntroQuestion).then((appStart) => {
		if (appStart.cliIntroQ === 'Yes') {
			log.green('Please Select type of employee');
			teamMemberLoop();
		} else {
			log.yellow(`Application stopped `);
		}
	});
}


//* Function to determine the size of the team with additional staff members
function teamSizeInfo() {
	inquirer.prompt(addEmployeeQuestions).then((teamSize) => {
		if (teamSize.teamSize === 'Yes') {
			teamMemberLoop();
		}
		if (teamSize.teamSize === 'No') {
			renderHTML(teamMembersArray);
		}
	});
}



//* Introduction Question to open the application
const cliIntroQuestion = {
	type: 'list',
	message: `Do you wish to input new team members?`,
	choices: ['Yes', 'No'],
	name: 'cliIntroQ',
};

//* Manager Data
const managerQuestions = [
	{
		type: 'input',
		message: "Name: ",
		name: 'managerName',
	},
	{
		type: 'input',
		message: "ID number: ",
		name: 'managerId',

	},
	{
		type: 'input',
		message: "Email: ",
		name: 'manageEmail',
	
	},
	{
		type: 'input',
		message: "Phone #: ",
		name: 'managerOfficeNumber',
	},
];

//* questions that prompts the user if they want to add another team member.
const addEmployeeQuestions = {
	type: 'list',
	message: 'Would you like to add another team member to this team?',
	choices: ['Yes', 'No'],
	name: 'teamSize',
};

//* Question to ask which role the new team member should be mapped to.
const teamMemberRolePick = {
	type: 'list',
	message: '.',
	choices: ['Engineer', 'Intern', 'Manager'],
	name: 'teamMemberRoleType',
};

//* Engineer Data Input
const engineerQuestions = [
	{
		type: 'input',
		message: "Name: ",
		name: 'enginnerName',
	},
	{
		type: 'input',
		message: "ID number: ",
		name: 'engineerId',

	},
	{
		type: 'input',
		message: "Email: ",
		name: 'engineerEmail',
	
	},
	{
		type: 'input',
		message: "GitHub: ",
		name: 'engineerGithub',
	},
];

//* Intern Data Input
const internQuestions = [
	{
		type: 'input',
		message: "Name: ",
		name: 'internName',
	},
	{
		type: 'input',
		message: "ID number: ",
		name: 'internId',

	},
	{
		type: 'input',
		message: "Email: ",
		name: 'internEmail',
	
	},
	{
		type: 'input',
		message: "School/University:",
		name: 'internSchool',
	},
];




//* Function to choose the type of team member (manager, engineer or intern) and prompt questions to build class constructors.
function teamMemberLoop() {
	inquirer.prompt(teamMemberRolePick).then((teamrole) => {
		if (teamrole.teamMemberRoleType === 'Engineer') {
			log.blue('Please Submit Engineer Profile Information');
			inquirer.prompt(engineerQuestions).then((engineerBuild) => {
				let engineer = new Engineer(engineerBuild.enginnerName, engineerBuild.engineerId, engineerBuild.engineerEmail, engineerBuild.engineerGithub);
				teamMembersArray.push(engineer);
				teamSizeInfo();
			});
		} else if (teamrole.teamMemberRoleType === 'Intern') {
			log.magenta('Please Submit Intern Profile Information');
			inquirer.prompt(internQuestions).then((internBuild) => {
				let intern = new Intern(internBuild.internName, internBuild.internId, internBuild.internEmail, internBuild.internSchool);
				teamMembersArray.push(intern);
				teamSizeInfo();
			});

		} else if (teamrole.teamMemberRoleType === 'Manager') {
			log.cyan('Please Submit Manager Profile Information');
			inquirer.prompt(managerQuestions).then((managerBuild) => {
				let manager = new Manager(managerBuild.managerName, managerBuild.managerId, managerBuild.managerEmail, managerBuild.managerSchool);
				teamMembersArray.push(manager);
				teamSizeInfo();
			});
		}
	});
}

//* Function to write array information to HTML templates when no more team members are added to the application. Uses Async Await function formatting to ensure that the write file is done after the rendering of the HTML from the array is completed.

async function renderHTML(file) {
	const htmlProfilePage = render(file);
	await writeFileAsync(outputPath, htmlProfilePage).then(function () {
		log.green(`done deal`);
	});
}

//* Calls cliIntro function to start the CLI Application.
cliIntro();
