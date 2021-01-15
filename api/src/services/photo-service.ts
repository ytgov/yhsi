import Knex, { Config } from "knex";
import { Photo, PHOTO_FIELDS } from "../data";

export class PhotoService {

    private knex: Knex;

    constructor(config: Config<any>) {
        this.knex = Knex(config);
    }

    async getAll(skip: number, take: number): Promise<Array<Photo>> {
        return this.knex("photo").select<Photo[]>(PHOTO_FIELDS).orderBy("id").offset(skip).limit(take);
    }

    async getById(id: string): Promise<Photo | undefined> {
        return this.knex("photo").select<Photo>(PHOTO_FIELDS).where({ rowId: id }).first()
            .catch(err => { console.log("BOMBED", err); return undefined; })
    }

    async getFileById(id: string): Promise<Photo | undefined> {
        return this.knex("photo").select<Photo>("file").where({ rowId: id }).first()
            .catch(err => { console.log("BOMBED", err); return undefined; })
    }

    async getPhotoCount(): Promise<number> {
        return new Promise(async (resolve, reject) => {
            let results = await this.knex<number>("photo").count("*", { as: 'count' })

            if (results) {
                let val = results[0].count as number;
                resolve(val)
            }

            resolve(0);
        })
    }

    async addPhoto(item: Photo): Promise<Photo | undefined> {
        return this.knex("photo").insert(item).returning<Photo>(PHOTO_FIELDS);
    }

    async updatePhoto(id: number, item: Photo): Promise<Photo | undefined> {
        return this.knex("photo").where({ id }).update(item).returning<Photo>(PHOTO_FIELDS);
    }
}
