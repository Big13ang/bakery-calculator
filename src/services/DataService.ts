import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { DataRepository } from "../repositories/DataRepository";

export class DataService {
    private dataRepo = new DataRepository();

    async exportData() {
        try {
            const payload = await this.dataRepo.exportAll();
            const jsonString = JSON.stringify(payload, null, 2);
            const fileName = `bakery_backup_${new Date().toISOString().split('T')[0]}.json`;
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;

            // Using writeAsStringAsync from legacy
            await FileSystem.writeAsStringAsync(fileUri, jsonString);

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'application/json',
                    dialogTitle: 'ذخیره تنظیمات و اطلاعات',
                    UTI: 'public.json'
                });
            } else {
                throw new Error("قابلیت اشتراک‌گذاری در این دستگاه در دسترس نیست.");
            }
        } catch (error: any) {
            console.error("Export failed:", error);
            throw error;
        }
    }

    async importData() {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
                copyToCacheDirectory: true
            });

            if (result.canceled || !result.assets || result.assets.length === 0) return false;

            const fileUri = result.assets[0].uri;
            // Using readAsStringAsync from legacy
            const content = await FileSystem.readAsStringAsync(fileUri);
            const payload = JSON.parse(content);

            if (!payload.data || !payload.version) {
                throw new Error("فایل انتخاب شده معتبر نیست یا فرمت آن صحیح نمی‌باشد.");
            }

            await this.dataRepo.importAll(payload);
            return true;
        } catch (error: any) {
            console.error("Import failed:", error);
            throw error;
        }
    }

    async resetAllData() {
        try {
            await this.dataRepo.clearAll();
            return true;
        } catch (error: any) {
            console.error("Reset failed:", error);
            throw error;
        }
    }
}

export const dataService = new DataService();
