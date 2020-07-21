<template>
  <div class="home">
    <PageHeader header="Smirkyisms"/>
    <Quote 
      v-if="quote"
      v-bind:key="quote.id"
      v-bind:type="quote.type"
      v-bind:quote="quote.text"
      v-bind:discord_server_name="quote.discord_server_name"
      v-bind:discord_channel_name="quote.discord_channel_name"
      v-bind:quote_by="quote.quote_by"
      v-bind:submitted_by="quote.submitted_by"
      v-bind:id="quote.id"
      v-bind:user_id="quote.user_id"
      v-bind:hyperlink="true"
    />
    <Img 
      v-if="image"
      v-bind:key="image.id"
      v-bind:type="image.type"
      v-bind:submitted_by="image.submitted_by"
      v-bind:id="image.id"
      v-bind:hyperlink="true"
    />
    <Video 
      v-if="video"
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
import PageHeader from '@/components/PageHeader.vue'
import Quote from '@/components/Quote.vue'
import Img from '@/components/Image.vue'
import Video from '@/components/Video.vue'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    PageHeader,
    Quote,
    Img,
    Video,
  },
  data () {
    return {
      quote: null,
      image: null,
      video: null,
      errors: [],
    }
  },
  created () {
    var randInt = Math.floor(Math.random() * 3);
    if (randInt == 1) {
      axios
        .get(window.appConfig.API_ADDR + '/image/random')
        .then(response => (this.image = response.data))
        .catch(e => {
          this.errors.push(e)
        })
    } else if (randInt == 2) {
      axios
        .get(window.appConfig.API_ADDR + '/quote/random')
        .then(response => (this.quote = response.data))
        .catch(e => {
          this.errors.push(e)
        })
    } else {
      axios
        .get(window.appConfig.API_ADDR + '/video/random')
        .then(response => (this.video = response.data))
        .catch(e => {
          this.errors.push(e)
        })
    }
  }
}
</script>
