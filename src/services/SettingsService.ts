import { SettingsRepository } from "../repositories/SettingsRepository";

import { AppSettings } from "../types";

export class SettingsService {
    constructor(private settingsRepo: SettingsRepository) { }

    async getSetting(key: string): Promise<string | null> {
        return await this.settingsRepo.getValue(key);
    }

    async setSetting(key: string, value: string): Promise<void> {
        await this.settingsRepo.setValue(key, value);
    }

    async getAppSettings(): Promise<AppSettings> {
        const all = await this.settingsRepo.findAll();
        const settings: AppSettings = {
            businessName: '',
            ownerName: '',
            subscriptionStatus: 'free',
        };

        for (const s of all) {
            if (s.key === 'businessName') settings.businessName = s.value;
            if (s.key === 'ownerName') settings.ownerName = s.value;
            if (s.key === 'subscriptionStatus') settings.subscriptionStatus = s.value as any;
        }
        return settings;
    }
}

export const settingsService = new SettingsService(new SettingsRepository());
