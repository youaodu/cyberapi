import dayjs from "dayjs";
import { defineStore } from "pinia";
import {
  createEnvironment,
  deleteEnvironment,
  Environment,
  listEnvironment,
  updateEnvironment,
} from "../commands/environment";

export const useEnvironmentStore = defineStore("environments", {
  state: () => {
    return {
      environments: [] as Environment[],
      fetching: false,
      adding: false,
      updating: false,
      removing: false,
    };
  },
  actions: {
    async add(env: Environment) {
      if (this.adding) {
        return;
      }
      this.adding = true;
      try {
        await createEnvironment(env);
        this.environments.push(env);
      } finally {
        this.adding = false;
      }
    },
    async fetch(collection: string) {
      if (this.fetching) {
        return;
      }
      this.fetching = true;
      try {
        this.environments = await listEnvironment(collection);
      } finally {
        this.fetching = false;
      }
    },
    async update(env: Environment) {
      if (this.updating) {
        return;
      }
      this.updating = true;
      try {
        env.updatedAt = dayjs().format();
        await updateEnvironment(env);
        const arr = this.environments.slice(0);
        let found = -1;
        arr.forEach((item, index) => {
          if (item.id === env.id) {
            found = index;
          }
        });
        if (found !== -1) {
          arr[found] = env;
        }
        this.environments = arr;
      } finally {
        this.updating = false;
      }
    },
    async remove(id: string) {
      if (this.removing) {
        return;
      }
      this.removing = true;
      try {
        await deleteEnvironment([id]);
        this.environments = this.environments.filter((item) => item.id !== id);
      } finally {
        this.removing = false;
      }
    },
  },
});
