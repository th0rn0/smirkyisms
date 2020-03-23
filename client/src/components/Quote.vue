<template>
	<div class="alert alert-success" role="alert">
    <h1>{{ quote }}</h1>
    <p>By {{ quote_by }}. Submitted by {{ submitted_by }}</p>
  </div>
</template>

<script>

export default {
  name: 'Quote',
  props: {
    quote: String,
    quote_by: String,
    submitted_by: String,
  },
  methods: {
   
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
