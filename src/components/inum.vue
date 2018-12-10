<template lang="pug">
  div.inum-container
    div.inum-label(@click="clickLabelHandler")
      span(v-show="!editMode") {{ value }}
        IconBase(icon-name="down")
          IconSDown

    div.inum-input-container(v-show="editMode" @click.stop)
      div.inum-input-wrapp
        input.inum-input(ref="input" type="text" inputmode ="numeric" :value="value" @input="inputHandler" @focus="focusHandler"  @blur="blurHandler" @keyup.enter="enterHandler" @keyup.esc="escHandler" :class="{'short-error': shortError }")
      
      div.inum-input-icons-wrap
        IconBase.icon-up(icon-name="up" @click="increment")
          IconUp
        IconBase.icon-down(icon-name="down" @click="decrement")
          IconDown

    span.inum-helper(v-if="showHelper" @click.stop="clickHelperHandler") {{ helper.title }}
       
</template>

<script>
import IconBase from './icons/icon-base.vue';
import IconUp from './icons/icon-up.vue';
import IconDown from './icons/icon-down.vue';
import IconSDown from './icons/icon-sdown.vue';

const REGEXP = /^([0-9]\d*)?$/;

export default {
  name: 'INum',
  components: {
    IconBase,
    IconUp,
    IconSDown,
    IconDown,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Number,
      default: 0,
      validator(val) {
        return val >= 0;
      },
    },
    helper: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      shortError: false,
      errorTimout: null,
      editMode: false,
      oldValue: 0,
      timer: null,
    };
  },
  watch: {
    editMode(newV) {
      if (newV) {
        document.addEventListener(
          'click',
          () => {
            console.log('handler ----');
            this.editMode = false;
          },
          { once: true }
        );
      }
    },
  },
  methods: {
    clickLabelHandler() {
      this.editMode = true;
      this.oldValue = this.value;
      this.selectText();
    },
    inputHandler(evt) {
      let val = evt.target.value;

      if (REGEXP.test(val)) {
        this.$emit('change', Number(val));
      } else {
        evt.target.value = this.value;
        this.makeShortError();
      }
    },
    focusHandler() {},
    blurHandler() {
      // this.timer = setTimeout(() => {
      //   this.editMode = false;
      //   this.timer = null;
      // }, 100);
    },
    enterHandler() {
      this.editMode = false;
    },
    escHandler() {
      this.$emit('change', this.oldValue);
      this.editMode = false;
    },

    makeShortError() {
      this.shortError = true;
      if (this.errorTimout) {
        clearTimeout(this.errorTimout);
      }
      this.errorTimout = setTimeout(() => {
        this.shortError = false;
      }, 400);
    },

    selectText() {
      this.$nextTick(() => {
        const input = this.$refs.input;
        if (input) {
          input.focus();
          input.setSelectionRange(0, input.value.length);
        }
      });
    },

    clickHelperHandler() {
      if (this.helper.cb) {
        const val = String(this.helper.cb());
        if (REGEXP.test(val)) {
          this.$emit('change', Number(val));
          this.$refs.input.focus();
        }
      }
    },

    increment() {
      console.log('incr');
      this.$emit('change', this.value + 1);
    },
    decrement() {
      if (this.value > 0) this.$emit('change', this.value - 1);
    },
  },
  computed: {
    showHelper() {
      return (
        this.helper &&
        this.helper.title &&
        typeof this.helper.cb === 'function' &&
        this.editMode
      );
    },
  },
};
</script>

<style lang="sass">
.inum-container
  display: flex
  flex-flow: column nowrap
  font-size: 1.2rem
  box-sizing: border-box
  padding: 0.3em

  .inum-label
    span
      &:hover
        color: blue

  .inum-input-container
    position: relative
    width: 100%
    height: 100%


    .inum-input-wrapp
      width: 100%
      height: 100%
      .inum-input
        &.short-error
          background-color: rgba(255, 201, 201, 0.9)

    .inum-input-icons-wrap
      position: absolute
      top: 0
      bottom: 0
      right: 0
      width: 10%;
      
      .icon-up
        position: absolute
        top: 0
        right: 0
        height: 50%
        z-index: 500
        &:hover
          color: red

      .icon-down
        position: absolute
        bottom: 0
        right: 0
        height: 50%
        z-index: 500
        &:hover
          color: red

  .inum-helper
    color: red
    font-size: 0.7em
    &:hover
      cursor: pointer
</style>
