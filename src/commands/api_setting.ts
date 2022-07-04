import dayjs from "dayjs";
import shortid from "shortid";

import { isWebMode } from "../helpers/util";
import {
  run,
  cmdAddAPISetting,
  cmdListAPISetting,
  cmdUpdateAPISetting,
} from "./invoke";
import { fakeList, fakeAdd, fakeUpdate } from "./fake";

const store = "apiSettings";

export interface APISetting {
  [key: string]: unknown;
  id: string;
  // 名称
  name: string;
  // 类型(http, graphQL)
  category: string;
  // 配置信息
  setting: string;
  // 创建时间
  createdAt: string;
  // 更新时间
  updatedAt: string;
}

export function newDefaultAPISetting(): APISetting {
  const id = shortid();
  return {
    id,
    name: "",
    category: "",
    setting: "",
    createdAt: dayjs().format(),
    updatedAt: dayjs().format(),
  };
}

export async function createAPISetting(setting: APISetting): Promise<void> {
  if (isWebMode()) {
    await fakeAdd<APISetting>(store, setting);
    return;
  }
  await run(cmdAddAPISetting, {
    setting,
  });
}

export async function listAPISetting(): Promise<APISetting[]> {
  if (isWebMode()) {
    return await fakeList<APISetting>(store);
  }
  return await run<APISetting[]>(cmdListAPISetting);
}

export async function updateAPISetting(setting: APISetting) {
  if (isWebMode()) {
    return await fakeUpdate(store, setting);
  }
  await run(cmdUpdateAPISetting, {
    setting,
  });
}