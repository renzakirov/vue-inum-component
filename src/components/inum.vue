<template lang="pug">
  div.inum-container
    div.inum-label(@click="clickLabelHandler")
      span(v-show="!editMode") {{ value }}
        IconBase(icon-name="down")
          IconSDown

    div.inum-input-container(v-show="editMode" @click.stop)
      div.inum-input-wrapp
        input.inum-input(ref="input" type="text" inputmode ="numeric" :value="value" @input="inputHandler" @focus="focusHandler"  @blur="blurHandler" @keyup.enter="enterHandler" @keyup.esc="escHandler" :class="{'short-error': shortError }")
      
      div.inum-input-icons-wrap(@dblclick.stop)
        span.icon-up-wrap(@click="increment")
          IconBase.icon-up(icon-name="up" width="18" height="9")
            IconUp
        span.icon-down-wrap(@click="decrement")
          IconBase.icon-down(icon-name="down" width="18" height="9")
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
    blurHandler() {},
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

    increment(val) {
      console.log('incr ', val);
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

    display: inline-block
    font-size: 1em
    background-color: #fff
    background-image: none
    position: relative
    cursor: text
    transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out
    margin: 0
    padding: 0
    width: 120px
    height: 32px
    line-height: 32px
    vertical-align: middle
    border: 1px solid #dcdee2
    border-radius: 4px
    overflow: hidden

    &:hover
      border-color: #57a3f3
      .inum-input-icons-wrap
        opacity: 1

    &:focuse
      border-color: #57a3f3
      outline: 0
      box-shadow: 0 0 0 2px rgba(45,140,240,.2)

    .inum-input-wrapp
      overflow: hidden
      height: 32px
      .inum-input
        width: 100%
        height: 32px
        line-height: 32px
        padding: 0 7px
        text-align: left
        outline: 0
        color: #666
        border: 0
        border-radius: 4px
        transition: all .2s linear

        &.short-error
          background-color: rgba(255, 201, 201, 0.9)

    .inum-input-icons-wrap
      position: absolute
      top: 0
      bottom: 0
      right: 0
      width: 10%
      color: #666
      // width: 22px;
      height: 100%
      background: #fff
      opacity: 0
      transition: opacity .4s ease-in-out

      .icon-up-wrap
        position: absolute
        top: 0px
        right: 0px
        height: 50%
        width: 20px
        .icon-up
          position: absolute
          top: 4px
          right: 3px
        &:hover
          color: #57a3f3
          cursor: pointer
      .icon-down-wrap
        position: absolute
        bottom: 0px
        right: 0px
        height: 50%
        width: 20px
        .icon-down
          position: absolute
          bottom: 4px
          right: 3px
        &:hover
          color: #57a3f3
          cursor: pointer

  .inum-helper
    color: red
    font-size: 0.7em
    &:hover
      cursor: pointer
</style>
