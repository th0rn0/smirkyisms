<template>
	<div class="card mb-3">
    <div class="card-body" style="transform: rotate(0);">
			<!-- <img :src="'data:image/jpg;base64,' + image" class="img-fluid"> -->
      <div class="embed-responsive embed-responsive-16by9">
        <video class="embed-responsive-item" controls="controls" preload="none" :poster="'data:image/jpg;base64,' + thumbnail" :src="'data:video/mp4;base64,' + video">
          Your browser does not support the HTML5 Video element.
        </video>
      </div>
      <!-- <embed type="video/mp4" :src="'data:video/mp4;base64,' + video"> -->
      <blockquote class="blockquote text-right mb-0">
        <footer class="blockquote-footer">
          posted by {{ submitted_by }}
          <span v-if="type === 'discord'">
            via Discord 
            <span v-if="discord_server_name">
              - <cite :title="discord_server_name">#{{ discord_channel_name }} on {{ discord_server_name }}</cite>
            </span>
          </span>
        </footer>
        <a v-if="id && hyperlink" class="stretched-link" :href="'/videos/' + id"></a>
      </blockquote>
    </div>
    <div v-if="id" class="card-footer text-right text-muted">
       <social-sharing :url="'https://smirkyisms.com/videos/' + id"
                            title="Check Out this Dumb Shit Video!"
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
import axios from 'axios'

export default {
  name: 'showVideo',
  props: {
    type: String,
		discord_server_name: String,
		discord_channel_name: String,
		submitted_by: String,
		id: String,
    hyperlink: Boolean
  },
  methods: {
   
  },
	data () {
    return {
      video: null,
      thumbnail: null,
    }
  },
  created () {
    axios
      .get(window.appConfig.API_ADDR + '/video/' + this.id + '/file')
      .then(response => {
        this.video = response.data
      })
      .catch(e => {
				this.errors.push(e)
			})
    axios
      .get(window.appConfig.API_ADDR + '/video/' + this.id + '/thumbnail')
      .then(response => {
        this.thumbnail = response.data
      })
      .catch(e => {
        this.errors.push(e)
      })
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
