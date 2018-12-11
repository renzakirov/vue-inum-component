<template lang="pug">
  div#App.container
    Task
</template>

<script>
import Task from './components/task.vue';
export default {
  name: 'app',
  components: {
    Task,
  },
};
</script>

<style lang="scss">
*,
:after,
:before,
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  width: 100%;
  height: 100%;
  background-color: white;
  color: #666;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  box-sizing: border-box;
}
#App {
  width: 100%;
  height: 100%;
}
</style>
