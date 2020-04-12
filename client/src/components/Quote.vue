<template>
	<div class="card mb-3">
    <div class="card-body">
      <blockquote class="blockquote text-right">
        <p class="mb-0">{{ quote }}</p>
        <footer class="blockquote-footer">
          {{ quote_by }} posted by {{ name }}
          <span v-if="type === 'discord'">
            via Discord 
            <span v-if="discord_server_name">
              - <cite :title="discord_server_name">#{{ discord_channel_name }} on {{ discord_server_name }}</cite>
            </span>
          </span>
          <div v-if="id">
            <a :href="'/quotes/' + id">permalink</a>
          </div>
        </footer>
      </blockquote>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Quote',
  props: {
    quote: String,
    quote_by: String,
    submitted_by: String,
    type: String,
    discord_server_name: String,
    discord_channel_name: String,
    id: String,
    user_id: String,
    name: String,
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
