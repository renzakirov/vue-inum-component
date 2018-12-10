<template lang="pug">
  div.inum-container(@wheel="wheelHandler")
    span.inum-plus(@click="plusHandler") +
    input.inum-input(type="text" inputmode ="numeric" :maxlength="maxlength" :value="value" @input="inputHandler" @keyup.13="submit" @focus="focusHandler" @blur="blurHandler" :class="{'short-error': shortError || error }")
    span.inum-minus(@click="minusHandler") -
</template>

<script>
export default {
  name: 'INum',
  model: {
    prop: 'value',
    event: 'submit',
  },
  props: {
    value: {
      type: Number,
      default: 0.05,
    },
    min: {
      type: Number,
      default: 0.005,
    },
    max: {
      type: Number,
      default: 0.1,
    },
    interval: {
      type: Number,
      default: 0.001,
    },
    afterComma: {
      type: Number,
      default: 3,
    },
    maxlength: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      errorTimout: null,
      shortError: false,
      error: false,
    };
  },
  methods: {
    plusHandler() {
      this.increaseByStep();
    },
    increaseByStep() {
      if (Number(this.value || 0) < this.max) {
        let val = Number(this.value || 0);
        val += this.interval;
        if (val > this.max) val = this.max;
        // val = fromExponential(val || 0);
        this.$emit('submit', this.makeNumber(val));
      } else {
        this.makeShortError();
      }
    },
    minusHandler() {
      this.reduceByStep();
    },
    reduceByStep() {
      let val = Number(this.value || 0);
      if (val > this.min) {
        val -= this.interval;
        if (val < this.min) val = this.min;
      } else {
        this.makeShortError();
      }
      // val = fromExponential(val || 0);
      this.$emit('submit', this.makeNumber(val));
    },
    wheelHandler(evt) {
      if (evt && evt.deltaY < 0) {
        this.increaseByStep();
      } else if (evt && evt.deltaY > 0) {
        this.reduceByStep();
      }
    },
    inputHandler() {
      this.setError(false);
    },
    submit(evt) {
      evt.stopPropagation();
      if (this.testStringValue(evt.target.value)) {
        const val = this.makeNumber(evt.target.value);
        if (!this.checkError(val)) {
          this.setError(false);
          this.$emit('submit', val);
          return;
        }
      }
      this.setError(true);
      this.errText = `Параметр должен быть числом больше ${this.min} и меньше ${
        this.max
      }`;
    },
    focusHandler() {
      console.warn('focuse');
      this.$emit('focus');
      this.checkError(this.value);
    },
    blurHandler(evt) {
      if (this.testStringValue(evt.target.value)) {
        const val = this.makeNumber(evt.target.value);
        if (!this.checkError(val)) {
          this.setError(false);
          this.$emit('submit', val);
        } else {
          this.makeShortError();
          if (val < this.min) {
            this.$emit('submit', this.min);
            evt.target.value = this.min;
          } else if (val > this.max) {
            this.$emit('submit', this.max);
            evt.target.value = this.max;
          }
        }
      } else {
        this.makeShortError();
        evt.target.value = this.value;
      }
      this.$emit('blur');
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
    setError(val = true) {
      this.error = val;
    },

    testStringValue(str) {
      return this.regexp.test(str);
    },
    makeNumber(str) {
      return Math.round(str * this.power) / this.power;
    },
    checkError(val) {
      if (val >= this.min && val <= this.max) {
        return false;
      } else {
        return true;
      }
    },
  },
  computed: {
    regexp() {
      if (this.afterComma === 0) {
        return /^(0|[1-9]\d*)?$/;
      }
      if (this.afterComma > 0) {
        const reg = new RegExp(
          `^([0-9]\\d*)(\\.[0-9]{0,${this.afterComma}})?$`
        );
        return reg;
      }
      return /^(0|[1-9]\d*)(\.\d*)?$/;
    },
    power() {
      return Math.pow(10, this.afterComma);
    },
  },
};
</script>

<style lang="scss" scoped>
.inum-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  height: 1.6rem;
  .inum-plus,
  .inum-minus {
    height: 100%;
    width: 1.5rem;
    border: 1px solid #e2ecff;
    text-align: center;
    vertical-align: middle;
    font-size: 1.5rem;
    line-height: 1;
    &:hover {
      cursor: pointer;
    }
  }
  .inum-input {
    width: 3rem;
    padding-left: 0.5rem;

    height: 100%;
    margin-left: 0.2rem;
    margin-right: 0.2rem;
    &.short-error {
      background-color: rgba(255, 201, 201, 0.9);
    }
    &:focus {
      outline-color: #3f4758;
    }
  }
}
</style>
