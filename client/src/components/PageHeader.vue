<template>
  <div class="page-header">
    <h1>{{ header }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Quote',
  props: {
    header: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

h1 {
  margin-bottom: 25px;
}

</style>
