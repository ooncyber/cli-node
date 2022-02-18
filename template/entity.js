const capitalize = require('../helper/capitalize')
module.exports = class EntityBuilder {

    /*
 [
  { nome: 'gab1', id: false, tipo: 'string', null: false },
  { nome: 'gab2', id: true, tipo: 'string', null: false },
  { nome: 'gab3', id: false, tipo: 'int', null: true }
]
    */

    static handle(entidade, props) {
        console.log(`Variavel props:,`, props);

        // se existe prop definida por ID, colocar ela primeiro
        // TODO só aceitar 1 prop com ID
        console.log(`Variavel props:,`, props);
        if (props.filter(e => e.id)) {
            var { nome } = props.filter(e => e.id)[0];
            props = props.filter(e => !e.id)
        }

        var add = '';
        props.forEach(prop => {
            add += `@Column({type: '${prop.tipo}', nullable: ${prop.null}})
    ${prop.nome}: ${prop.tipo}
    
    `;
        })

        console.log(`Variavel props:,`, props);
        return `import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ${capitalize(entidade)}Model extends BaseEntity {
    @PrimaryGeneratedColumn()
    ${nome ?? id}: number;

    ${add}
    
}`
    }
}