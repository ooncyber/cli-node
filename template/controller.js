const capitalize = require('../helper/capitalize');
module.exports = class ControllerBuilder {

    static handle(nome, entidade) {
        var nomeController = `${capitalize(nome)}Controller`;

        if (!entidade) {
            return `import {Request, Response, NextFunction} from 'express';
import {Get, Post, Put, Delete, Route} from 'tsoa';

@Route('${capitalize(nome)}')
export class ${nomeController}{
}
`;
        } else {
            console.log(`Variavel entidade:,`, entidade);
            var nomeEntidade = `${capitalize(entidade)}Model`;

            return `import {Request, Response, NextFunction} from 'express';
import {Get, Post, Put, Delete, Route} from 'tsoa';
import { ${nomeEntidade}Model } from './../model/${entidade}.model';


@Route('${capitalize(nome)}')
export class ${nomeController}{

    @Get("/")
    static async _findAll(): Promise<Object[]>{
        return await ${nomeEntidade}.findAll();
    }

    static async findAll(req: Request, res: Response){
        res.send(await ${nomeController}._findAll());
    }

    @Get("/id/:id")
    static async _findOne(id): Promise<Object[]>{
        return await ${nomeEntidade}.findOne(id);
    }
    static async findOne(req: Request, res: Response) {
        res.send(await ${nomeController}_findOne(req.params.id));
    }
    @Post("/")
    static async _create(body) {
        return await ${nomeEntidade}.save({ ...body });
    }
    static async create(req: Request, res: Response) {
        res.send(await ${nomeController}_create(req.body))
    }

    @Put("/id/:id")
    static async _update(body, id): Promise<Object[]> {
        await ${nomeEntidade}.update(id, { ...body, });
        return await ${nomeEntidade}.findOne(id);

    }
    static async update(req: Request, res: Response) {
        res.send(await ${nomeController}_update);
    }

    @Delete("/id/:id")
    static async _delete(id): Promise<boolean> {
        await ${nomeEntidade}.delete(id);
        return true;
    }
    static async delete(req: Request, res: Response) {
        res.send(${nomeController}_delete(req.params.id));
    }
}
    }    `
        }
    }
}