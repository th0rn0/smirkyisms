<template>
	<div class="card mb-3">
    <div class="card-body" style="transform: rotate(0);">
      <blockquote class="blockquote text-right mb-0">
        <p class="mb-0">{{ quote }}</p>
        <footer class="blockquote-footer">
          {{ quote_by }} posted by {{ submitted_by }}
          <span v-if="type === 'discord'">
            via Discord 
            <span v-if="discord_server_name">
              - <cite :title="discord_server_name">#{{ discord_channel_name }} on {{ discord_server_name }}</cite>
            </span>
          </span>
        </footer>
        <a v-if="id && hyperlink" class="stretched-link" :href="'/quotes/' + id"></a>
      </blockquote>
    </div>
    <div v-if="id" class="card-footer text-right text-muted">
       <social-sharing :url="'https://smirkyisms.com/quotes/' + id"
                            title="Check Out this Dumb Shit Quote!"
                            hashtags="smirkyisms,wot,why"
                            inline-template>
        <div>
          Share:
          <network network="facebook">
            <i class="fa fa-facebook"></i>
          </network>&nbsp;&nbsp;&nbsp;
          <network network="twitter">
            <i class="fa fa-twitter"></i>
          </network>
        </div>
      </social-sharing>
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
    hyperlink: Boolean
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
