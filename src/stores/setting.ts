import { defineStore } from "pinia";
import { appWindow } from "@tauri-apps/api/window";
import localforage from "localforage";

import { isWebMode } from "../helpers/util";

const settingStore = localforage.createInstance({
  name: "setting",
});

interface AppSetting {
  theme: string;
}

const appSettingKey = "app";

async function getAppSetting(): Promise<AppSetting> {
  const setting = await settingStore.getItem<AppSetting>(appSettingKey);
  if (setting) {
    return setting;
  }
  return {} as AppSetting;
}

function updateAppSetting(data: AppSetting): Promise<AppSetting> {
  return settingStore.setItem(appSettingKey, data);
}

function isDarkTheme(theme: string) {
  return theme === "dark";
}

export const useSettingStore = defineStore("common", {
  state: () => {
    return {
      fetching: false,
      theme: "",
      isDark: false,
      systemTheme: "",
    };
  },
  actions: {
    async fetch(): Promise<void> {
      if (this.fetching) {
        return;
      }
      this.fetching = true;
      try {
        // 优先使用用户设置
        const setting = await getAppSetting();
        let theme = setting.theme || "";
        if (!isWebMode()) {
          const result = await appWindow.theme();
          this.systemTheme = (result as string) || "";
          if (!theme) {
            theme = this.systemTheme;
          }
        }
        this.isDark = isDarkTheme(theme);
        this.theme = theme;
      } catch (err) {
        // 获取失败则忽略
      } finally {
        this.fetching = false;
      }
    },
    async updateTheme(theme: string) {
      const setting = await getAppSetting();
      setting.theme = theme;
      await updateAppSetting(setting);
      this.theme = theme;
      // 如果theme 为空表示使用系统主题
      this.isDark = isDarkTheme(theme || this.systemTheme);
    },
  },
});
