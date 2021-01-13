import Knex, { Config } from "knex";
import { max } from "moment";
import { Place, PLACE_FIELDS } from "../data";

export class PlaceService {

    private knex: Knex;

    constructor(config: Config<any>) {
        this.knex = Knex(config);
    }

    async getAll(skip: number, take: number): Promise<Array<Place>> {
        return this.knex("place").select<Place[]>(PLACE_FIELDS).orderBy("id").offset(skip).limit(take);
    }

    async getById(id: number): Promise<Place | undefined> {
        return this.knex("place").select<Place>(PLACE_FIELDS).where({ id: id }).first()
            .catch(err => { console.log("BOMBED", err); return undefined; })
    }

    async getPlaceCount(): Promise<number> {
        return new Promise(async (resolve, reject) => {
            let results = await this.knex<number>("place").count("*", { as: 'count' })

            if (results) {
                let val = results[0].count as number;
                resolve(val)
            }

            resolve(0);
        })
    }

    async addPlace(item: Place): Promise<Place | undefined> {
        return this.knex("place").insert(item).returning<Place>(PLACE_FIELDS);
    }

    async updatePlace(id: number, item: Place): Promise<Place | undefined> {
        return this.knex("place").where({ id }).update(item).returning<Place>(PLACE_FIELDS);
    }

    async generateIdFor(nTSMapSheet: string): Promise<string> {
        let maxPlace = await this.knex("place").where({ nTSMapSheet }).max("yhsiId", { as: "maxVal" });

        if (maxPlace && maxPlace.length == 1 && maxPlace[0].maxVal) {
            let val = maxPlace[0].maxVal;
            let parts = val.split("/");
            let lastPart = parseInt(parts[2]);

            lastPart++;

            let strVal = lastPart.toString().padStart(3, "0");
            return `${nTSMapSheet}/${strVal}`;
        }

        return `${nTSMapSheet}/001`;
    }
}
