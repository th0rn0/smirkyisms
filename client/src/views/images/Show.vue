<template>
  <div class="images">
    <Img 
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
  name: 'Images',
  components: {
    Img
  },
  data () {
    return {
      image: null,
    }
  },
  created () {
    axios
      .get(window.appConfig.API_ADDR + '/image/' + this.$route.params.id)
      .then(response => {
        console.log(response);
        this.image = response.data
      })
      .catch(e => {
				this.errors.push(e)
			})
  }
}
</script>