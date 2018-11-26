import store from "@/store/index.store"
export default {
  get(playload) {
    return store.getters.getCache(playload)
  },
  set(playload) {
    store.commit("setCache", playload)
  },
  clear() {
    store.commit("clearCache")
  },
}
