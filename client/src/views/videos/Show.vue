<template>
  <div class="videos">
    <Video 
      v-bind:key="video.id"
      v-bind:type="video.type"
      v-bind:submitted_by="video.submitted_by"
      v-bind:id="video.id"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import Video from '@/components/Video.vue'
import axios from 'axios'

export default {
  name: 'Videos',
  components: {
    Video
  },
  data () {
    return {
      video: null,
    }
  },
  created () {
    axios
      .get(window.appConfig.API_ADDR + '/video/' + this.$route.params.id)
      .then(response => {
        this.video = response.data
      })
      .catch(e => {
				this.errors.push(e)
			})
  }
}
</script>