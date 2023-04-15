import { Injectable } from '@angular/core';
import { Hub } from '../lego-hub';
import { ConsoleLoggingService } from '../logging';

@Injectable()
export class HubStorageService {
    private hubsMap: Map<string, Hub> = new Map();

    constructor(
        private logger: ConsoleLoggingService
    ) {
    }

    public store(hub: Hub): void {
        if (this.hubsMap.has(hub.id)) {
            throw new Error(`Hub with id=${hub.id} is already registered`);
        }
        this.logger.debug(`[HubStorage] Storing hub`, hub.id);
        this.hubsMap.set(hub.id, hub);
    }

    public get(id: string): Hub {
        const hub = this.hubsMap.get(id);
        if (!hub) {
            throw new Error(`Hub with id=${id} is not registered`);
        }
        return hub;
    }

    public removeHub(id: string): void {
        this.logger.debug('[HubStorage] Removing hub from storage', id);
        this.hubsMap.delete(id);
    }
}
