<template>
  <div class="quotes">
    <circle-spin v-if="isLoading"></circle-spin>
    <Img 
      v-for="image in images" 
      v-bind:key="image.id"
      v-bind:type="image.type"
      v-bind:submitted_by="image.submitted_by"
      v-bind:id="image.id"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import Img from '@/components/Image.vue'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    Img
  },
  methods: {
    hideLoading() {
      this.isLoading = false;
    }
  },
  data () {
    return {
      images: null,
      isLoading: false
    }
  },
  created () {
    this.isLoading = true;
    axios
      .get(window.appConfig.API_ADDR + '/image?sort=createdAt%20DESC')
      .then(response => {
        this.images = response.data;
        this.isLoading = false;
      })
      .catch(e => {
				this.errors.push(e)
			})
  }
}
</script>