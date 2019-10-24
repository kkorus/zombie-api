import { Injectable } from "@nestjs/common";

@Injectable()
export class ClockService {
    getCurrentTime() {
        return Date.now()
    }
}