
const program = require('commander');
const inquirer = require('inquirer');

const fs = require("fs");
const ControllerBuilder = require('./template/controller');
const EntityBuilder = require('./template/entity');
const commander = require('commander');
const { default: chalk } = require('chalk');
const RouteBuilder = require('./template/route');
const glob = require('glob');
const { type } = require('os');

function criarController(nomeController, nomeEntidade) {
    fs.mkdir('./dist/controller', { recursive: true }, (err) => {
        if (err) {
            console.log(`Variavel err:,`, err);
        }
        fs.writeFile(`./dist/controller/${nomeController}.controller.ts`,
            ControllerBuilder.handle(nomeController, nomeEntidade), (err) => {
                if (err)
                    console.log(`Variavel err:,`, err);
            })
    });
}

function criarEntidade(nomeEntidade, props) {
    fs.mkdir('./dist/entity', { recursive: true }, (err) => {
        if (err) {
            console.log(`Variavel err:,`, err);
        }
        fs.writeFile(`./dist/entity/${nomeEntidade}.entity.ts`,
            EntityBuilder.handle(nomeEntidade, props), (err) => {
                if (err)
                    console.log(`Variavel err:,`, err);
            })
    });
}

function criarRota(nomeRota) {
    fs.mkdir("./dist/routes", { recursive: true }, err => {
        if (err)
            console.log(`Variavel err:,`, err);
        fs.writeFile(`./dist/routes/${nomeRota}.route.ts`,
            RouteBuilder.handle(nomeRota), err => {
                if (err)
                    console.log(`Variavel err:,`, err);
                if (!fs.existsSync('./routes/index.ts')) {
                    fs.writeFile(`./dist/routes/index.ts`, RouteBuilder.index(), err => {
                        if (err) console.log(`Variavel err:,`, err);
                    });
                }
            })
    })
}

async function perguntarNomeController() {
    return await inquirer.prompt([
        {
            type: "input",
            name: "nomeController",
            message: "Qual o nome do seu controller?",
            validate: value => value ? true : "Não é permitido vazio"
        },
    ]);
}

async function perguntarPropsEntidade() {
    let { adicionarProps } = await inquirer.prompt([
        {
            type: "confirm",
            name: "adicionarProps",
            message: "Adicionar propriedades por aqui?"

        }
    ]);
    if (adicionarProps) {
        var props = [];
        let i = 1;
        while (i != 0) {
            var { prop } = await inquirer.prompt([
                {
                    type: 'input',
                    message: "Qual o nome da prop?",
                    name: 'prop.nome'
                },
                {
                    type: "confirm",
                    message: "ID?",
                    name: 'prop.id',
                },

            ]);
            // Se não for ID, pergunta as opções
            if (!prop.id) {
                var { prop2 } = await inquirer.prompt([
                    {
                        type: "list",
                        message: "Qual o tipo dela?",
                        name: 'prop2.tipo',
                        choices: [
                            {
                                name: "string",
                                value: "string"
                            },
                            {
                                name: "int",
                                value: "int"
                            },
                            {
                                name: "boolean",
                                value: "boolean"
                            },
                            {
                                name: "date",
                                value: "date"
                            },
                        ]
                    },
                    {
                        name: 'prop2.null',
                        message: "Pode ser nula?",
                        type: 'confirm'
                    }
                ]);
            }
            props.push({
                ...prop,
                ...prop2
            })
            let { continuar } = await inquirer.prompt([
                {
                    type: "confirm",
                    message: "Adicionar mais uma prop?",
                    name: "continuar"
                }
            ]);
            i++;
            i = continuar ? 1 : 0;
        }
        return props;
    }
}

async function perguntarNomeEntidade() {
    return await inquirer.prompt([
        {
            type: "input",
            name: "nomeEntidade",
            message: "Qual o nome da entidade?",
            validate: value => value ? true : "Não é permitido vazio"
        }
    ]);
}


console.log(chalk.blue('Bem vindo a CLI de geração de código da TGT NodeJS!'));

criarEntidade('o', [
    { nome: 'gab1', id: false, tipo: 'string', null: false },
    { nome: 'gab2', id: true, tipo: 'string', null: false },
    { nome: 'gab3', id: false, tipo: 'int', null: true }
])

return;
inquirer.prompt([
    {
        name: "tipo",
        message: 'Escolha o que deseja gerar',
        choices: [

            {
                name: 'Controller',
                value: 1
            }, {
                name: 'Entidade',
                value: 2
            }, {
                name: 'Controller + Entidade + Rotas',
                value: 3
            }
        ],
        type: 'list'
    }
]).then(async e => {


    if (e.tipo == 1) {
        let { nomeController } = await perguntarNomeController();
        criarController(nomeController);
    }
    if (e.tipo == 2) {
        let { nomeEntidade } = await perguntarNomeEntidade();
        let props = await perguntarPropsEntidade();
        console.log(`Variavel props:,`, props);
        criarEntidade(nomeEntidade, props);

    }
    if (e.tipo == 3) {
        let { nomeController } = await perguntarNomeController();
        let { nomeEntidade } = await perguntarNomeEntidade();
        criarEntidade(nomeEntidade);
        criarController(nomeController, nomeEntidade);
        criarRota(nomeController);
    }


})