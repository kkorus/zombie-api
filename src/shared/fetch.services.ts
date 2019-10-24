import { Injectable } from "@nestjs/common";

declare var require: any;
const fetch = require("node-fetch");

@Injectable()
export class FetchService {
    async fetch(url: string) {
        const response = await fetch(url);
        return await response.json();
    }
}