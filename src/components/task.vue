<template lang="pug">
  div.container
    div.single-control
      div.control-title Control-0:
      div.control-number
        INum(v-model="num0.value" :helper="num0.helper")

    div.multiple-controls
      div.single-control
        div.control-title Control-1:
        div.control-number
          INum(v-model="num1" :helper="helper1")
      div.single-control
        div.control-title Control-2:
        div.control-number
          INum(v-model="num2" :helper="helper2")
      div.single-control
        div.control-title Control-3:
        div.control-number
          INum(v-model="num3")

</template>

<script>
import { mapGetters } from 'vuex';
import INum from './inum.vue';
export default {
  name: 'Task',
  components: {
    INum,
  },
  data() {
    return {
      num0: {
        value: 10,
        helper: {
          title: 'Миллион',
          cb: () => this.million(),
        },
      },
      helper1: {
        title: 'Сумма',
        cb: () => this.summ(),
      },
      helper2: {
        title: 'Константа',
        cb: () => 1000,
      },
    };
  },
  methods: {
    million() {
      return 1000000;
    },
    summ() {
      return this.num2 + this.num3;
    },
  },
  computed: {
    ...mapGetters(['controls']),
    num1: {
      get() {
        return this.controls[0];
      },
      set(value) {
        this.$store.commit('SET_CONTROLS', { id: 0, value });
      },
    },
    num2: {
      get() {
        return this.controls[1];
      },
      set(value) {
        this.$store.commit('SET_CONTROLS', { id: 1, value });
        this.$store.commit('SET_CONTROLS', { id: 2, value });
      },
    },
    num3: {
      get() {
        return this.controls[2];
      },
      set(value) {
        this.$store.commit('SET_CONTROLS', { id: 1, value });
        this.$store.commit('SET_CONTROLS', { id: 2, value });
      },
    },
    nums() {
      return [this.num1, this.num2, this.num3];
    },
  },
};
</script>

<style lang="sass" scoped>
  .container
    width: 80%
    min-width: 200px
    height: 100%
    margin: 4rem auto;

    .single-control
      width: 100%
      height: 4rem
      display: flex
      flex-flow: row nowrap
      justify-content: flex-start
      align-items: flex-start

      .control-title
        margin-right: 2rem
        font-size: 1.2rem;
        min-width: 7rem
      .control-number

    .multiple-controls
      margin-top: 3rem
      display: flex
      flex-flow: column nowrap
      justify-content: flex-start
      align-items: center

</style>
