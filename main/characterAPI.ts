import { BaseAPI } from './BaseAPI';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';


export class CharacterAPI extends BaseAPI {

    private characterEndpoint = '/character';

    async init() { 
        await super.init();
    }

    async getAllCharacters(callIteration: string = '') {
        return await this.requestContext.get(`${this.baseURL}${this.characterEndpoint}${callIteration}`);
    }

    async getCharacterById(id: number) {
        return await this.requestContext.get(`${this.baseURL}${this.characterEndpoint}/${id}`);
    }

    async getMultipleCharacters(ids: string) {
        return await this.requestContext.get(`${this.baseURL}${this.characterEndpoint}/${ids}`);
    }

    async filterByQueryParams(param: string, value: string) {
        return await this.requestContext.get(`${this.baseURL}${this.characterEndpoint}`, {
            params: { [param]: value },
        });
    }

    async readCSVtoJSON(): Promise<any> {
        const fileContent = fs.readFileSync('./test_data/username.csv', 'utf-8');
        console.log(fileContent);

        const csvContent = parse(fileContent, {
            columns: true,
            cast: (value, context) => {
                if (context.column === "id") return Number(value)
                return value
            }
        });
        console.log(csvContent);
        return csvContent
    }
    
}
