import Knex, { Config } from "knex";

export class PhotoService {

    private knex: Knex;

    constructor(config: Config<any>) {
        this.knex = Knex(config);
    }
}
