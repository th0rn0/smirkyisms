<template>
  <div>
    <div class="text-left">
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-sm-4">
              <img class="img rounded" :src="user.picture">
            </div>
            <div class="col-sm-8">
              <span class="align-middle">
                <h5><strong>{{ user.username }}</strong></h5>
                <p>{{ user.email }} <small><span v-if="!user.email_verified">Not Verified</span><span v-else>Verified</span></small></p>
              </span>
              <button class="btn btn-primary btn-sm disabled">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>
      <hr>
      <h5>Quotes</h5>
      <circle-spin v-if="isLoadingQuotes"></circle-spin>
      <p v-if="quotes == null">Nothing to see here...</p>
      <Quote 
        v-for="quote in quotes" 
        v-bind:key="quote.id"
        v-bind:type="quote.type"
        v-bind:quote="quote.text"
        v-bind:discord_server_name="quote.discord_server_name"
        v-bind:discord_channel_name="quote.discord_channel_name"
        v-bind:quote_by="quote.quote_by"
        v-bind:submitted_by="quote.submitted_by"
        v-bind:id="quote.id"
        v-bind:hyperlink="true"
      />
      <hr>
      <h5>Images</h5>
      <circle-spin v-if="isLoadingImages"></circle-spin>
      <p v-if="images == null">Nothing to see here...</p>
      <Img 
        v-for="image in images" 
        v-bind:key="image.id"
        v-bind:type="image.type"
        v-bind:submitted_by="image.submitted_by"
        v-bind:id="image.id"
        v-bind:hyperlink="true"
      />
      <hr>
      <h5>Videos</h5>
      <circle-spin v-if="isLoadingImages"></circle-spin>
      <p v-if="videos == null">Nothing to see here...</p>
      <Video 
        v-for="video in videos" 
        v-bind:key="video.id"
        v-bind:type="video.type"
        v-bind:submitted_by="video.submitted_by"
        v-bind:id="video.id"
        v-bind:hyperlink="true"
      />
    </div>

  </div>


</template>

<script>
// @ is an alias to /src
import Quote from '@/components/Quote.vue'
import Img from '@/components/Image.vue'
import Video from '@/components/Video.vue'
import axios from 'axios'

export default {
  name: 'Profile',
  components: {
    Quote,
    Img,
    Video
  },
  data () {
    return {
      quotes: null,
      images: null,
      videos: null,
      errors: [],
      user: this.$auth.user,
      isLoadingQuotes: false,
      isLoadingImages: false,
      isLoadingVideos: false
    }
  },
  created () {
    this.isLoadingQuotes = true;
    this.isLoadingImages = true;
    this.isLoadingVideos = true;
    // Quotes
    axios
      .get(window.appConfig.API_ADDR + '/quote/user/' + this.$auth.user.sub + '?sort=createdAt%20DESC')
      .then(response => {
        this.quotes = response.data;
        this.isLoadingQuotes = false;
      })
      .catch(e => {
        this.errors.push(e)
      })
    // Images
    axios
      .get(window.appConfig.API_ADDR + '/image/user/' + this.$auth.user.sub + '?sort=createdAt%20DESC')
      .then(response => {
        this.images = response.data;
        this.isLoadingImages = false;
      })
      .catch(e => {
        this.errors.push(e)
      })
    // Quotes
    axios
      .get(window.appConfig.API_ADDR + '/video/user/' + this.$auth.user.sub + '?sort=createdAt%20DESC')
      .then(response => {
        this.videos = response.data;
        this.isLoadingVideos = false;
      })
      .catch(e => {
        this.errors.push(e)
      })
  }
}
</script>
