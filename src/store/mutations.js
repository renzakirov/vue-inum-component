import Vue from 'vue';

const mutations = {
  SET_CONTROLS(state, { id, value }) {
    Vue.set(state.controls, id, value);
  },
};

export default mutations;
