<template lang="pug">
  svg(xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :viewBox="viewBox"
    :aria-labelledby="iconName"
    role="presentation")
  
    title(:id="iconName" lang="en") {{ iconName }} icon
    g(:fill="iconColor")
      slot
</template>

<script>
export default {
  name: 'IconBase',
  props: {
    iconName: {
      type: String,
      default: 'box',
    },
    width: {
      type: [Number, String],
      default: 16,
    },
    height: {
      type: [Number, String],
      default: 16,
    },
    iconColor: {
      type: String,
      default: 'currentColor',
    },
  },
  computed: {
    viewBox() {
      return `0 0 ${this.width} ${this.height}`;
    },
  },
};
</script>

<style scoped>
svg {
  display: inline-block;
  vertical-align: baseline;
  margin-bottom: -2px; /* yes, I'm that particular about formatting */
}
</style>
