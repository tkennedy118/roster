const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const team = [];
const questions = [
    {
        type: "input",
        name: "name",
        message: "Name: "
    },
    {
        type: "input",
        name: "id",
        message: "ID: "
    },
    {
        type: "input",
        name: "email",
        message: "Email: "
    },
    {
        type: "list",
        name: "jobClass",
        message: "Job Class: ",
        choices: ["Manager", "Engineer", "Intern"]
    }];

/*************************************** FUNCTIONS ***************************************/

// FUNCTION: run main logic
const init = async function() {

    await createTeam();
    
    const html = render(team);
    fs.writeFileSync(outputPath, html);
}

// FUNCTION: calls menu() and returns menu choice, calls addEmployee() and returns employee object,
//           adds employee object to 'team' array.
const createTeam = async function() {

    const choices = ["1. Enter Employee Information", "2. Exit"];
    let choice;
    let employee;

    console.log("\nLet's get your team together!\n");

    while (choice !== choices[1]) {

        choice = await menu(choices);

        if (choice === choices[0]) {
            employee = await addEmployee();
            team.push(employee);
        } 
    }
}

// FUNCTION: takes in an array of choices, prompts user, then returns selected choice.
const menu = async function(choicesArr) {
    
    const { choice } = await inquirer
        .prompt(
            {
                type: "list",
                name: "choice",
                message: "Here are your options:",
                choices: choicesArr
            }
        );

    return choice;
}

// FUNCTION: prompts user for employee information and returns employee object.
const addEmployee = async function() {

    let employee;

    await inquirer
        .prompt(questions)
        .then( async ({ name, id, email, jobClass }) => {
            
            if (jobClass === "Manager") {
                const { officeNumber } = await inquirer  
                    .prompt(
                        {
                            type: "number",
                            name: "officeNumber",
                            message: "Office Number: "
                        }
                    );
                employee = new Manager(name, id, email, officeNumber);
            }

            if (jobClass === "Engineer") {
                const { github } = await inquirer
                    .prompt(
                        {
                            type: "input",
                            name: "github",
                            message: "GitHub Username: "
                        }
                    );
                employee = new Engineer(name, id, email, github);
            }

            if (jobClass === "Intern") {
                const { school } = await inquirer
                    .prompt(
                        {
                            type: "input",
                            name: "school",
                            message: "School: "
                        }
                    );
                employee = new Intern(name, id, email, school);
            }
        });
    
    return employee;
}

/************************************* FUNCTION CALLS *************************************/
init();