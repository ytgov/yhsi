import Knex, { Config } from "knex";
import { Community, FirstNation, FunctionalType, OriginalMedia, PhotoOwner, PhotoProject, PlaceTheme } from "../data";

export class StaticService {

    private knex: Knex;

    constructor(config: Config<any>) {
        this.knex = Knex(config);
    }

    async getCommunities(): Promise<Array<Community>> {
        return this.knex<Community>("Community").select("id", "name")
    }

    async getFirstNations(): Promise<Array<FirstNation>> {
        return this.knex<FirstNation>("FirstNation").select("id", "description")
    }

    async getFunctionalTypes(): Promise<Array<FunctionalType>> {
        return this.knex<FunctionalType>("FunctionalType").select("id", "description")
    }

    async getOriginalMedias(): Promise<Array<OriginalMedia>> {
        return this.knex<OriginalMedia>("OriginalMedia").select("id", "type")
    }

    async getPhotoOwners(): Promise<Array<PhotoOwner>> {
        return this.knex<PhotoOwner>("PhotoOwner").select("id", "name", "email", "address", "telephone", "contactPerson")
    }

    async getPhotoOwner(id: number): Promise<PhotoOwner | undefined> {
        return this.knex<PhotoOwner>("PhotoOwner").where({ id }).select("id", "name", "email", "address", "telephone", "contactPerson").first();
    }

    async addPhotoOwner(owner: PhotoOwner): Promise<PhotoOwner | undefined> {
        return this.knex("PhotoOwner").insert(owner).returning<PhotoOwner>(["id", "name", "email", "address", "telephone", "contactPerson"]);
    }

    async updatePhotoOwner(id: number, item: PhotoOwner): Promise<PhotoOwner | undefined> {
        return this.knex("PhotoOwner").where({ id: id }).update(item).returning<PhotoOwner>(["id", "name", "email", "address", "telephone", "contactPerson"]);
    }

    async deletePhotoOwner(id: number): Promise<any> {
        return this.knex("PhotoOwner").where({ id }).delete();
    }

    async getPhotoProjects(): Promise<Array<PhotoProject>> {
        return this.knex<PhotoProject>("PhotoProject").select("id", "name", "permit", "year", "section")
    }

    async getPhotoProject(id: number): Promise<PhotoProject | undefined> {
        return this.knex<PhotoProject>("PhotoProject").where({ id }).select("id", "name", "permit", "year", "section").first();
    }

    async addPhotoProject(item: PhotoProject): Promise<PhotoProject | undefined> {
        return this.knex("PhotoProject").insert(item).returning<PhotoProject>(["id", "name", "permit", "year", "section"]);
    }

    async updatePhotoProject(id: number, item: PhotoProject): Promise<PhotoProject | undefined> {
        return this.knex("PhotoProject").where({ id: id }).update(item).returning<PhotoProject>(["id", "name", "permit", "year", "section"]);
    }

    async deletePhotoProject(id: number): Promise<any> {
        return this.knex("PhotoProject").where({ id }).delete();
    }

    async getPlaceThemes(): Promise<Array<PlaceTheme>> {
        return this.knex<PlaceTheme>("PlaceTheme").select("id", "category", "type");
    }

    async getStatutes(): Promise<Array<PlaceTheme>> {
        return this.knex<PlaceTheme>("Statute").select("id", "recognitionAuthority", "recognitionType", "description", "allStatute");
    }
}
