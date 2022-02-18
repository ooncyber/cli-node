const glob = require('glob')
const capitalize = require('../helper/capitalize')
module.exports = class RouteBuilder {

    static handle(controllerNome) {
        return `import { ${capitalize(controllerNome)}Controller } from "../controller/${controllerNome}.controller";
import { allRoutes } from "./routes";


allRoutes.get("/${controllerNome}", ${capitalize(controllerNome)}Controller.findAll);
allRoutes.get("/${controllerNome}/id/:id", ${capitalize(controllerNome)}Controller.findOne);
allRoutes.post("/${controllerNome}", ${capitalize(controllerNome)}Controller.create);
allRoutes.put("/${controllerNome}/id/:id", ${capitalize(controllerNome)}Controller.update);
allRoutes.delete("/${controllerNome}/id/:id", ${capitalize(controllerNome)}Controller.delete);
        `
    };

    static index(){
        return `import { Router } from 'express';

export const allRoutes = Router();
        `
    }
}