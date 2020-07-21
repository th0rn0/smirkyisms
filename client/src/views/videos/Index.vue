<template>
  <div class="quotes">
    <circle-spin v-if="isLoading"></circle-spin>
    <Video 
      v-for="video in videos" 
      v-bind:key="video.id"
      v-bind:type="video.type"
      v-bind:submitted_by="video.submitted_by"
      v-bind:id="video.id"
      v-bind:hyperlink="true"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import Video from '@/components/Video.vue'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    Video
  },
  methods: {
    hideLoading() {
      this.isLoading = false;
    }
  },
  data () {
    return {
      videos: null,
      isLoading: false
    }
  },
  created () {
    this.isLoading = true;
    axios
      .get(window.appConfig.API_ADDR + '/video?sort=createdAt%20DESC')
      .then(response => {
        this.videos = response.data;
        this.isLoading = false;
      })
      .catch(e => {
				this.errors.push(e)
			})
  }
}
</script>