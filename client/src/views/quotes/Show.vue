<template>
  <div class="quotes">
    <Quote 
      v-bind:key="quote.id"
      v-bind:type="quote.type"
      v-bind:quote="quote.text"
      v-bind:discord_server_name="quote.discord_server_name"
      v-bind:discord_channel_name="quote.discord_channel_name"
      v-bind:quote_by="quote.quote_by"
      v-bind:submitted_by="quote.submitted_by"
      v-bind:id="quote.id"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import Quote from '@/components/Quote.vue'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    Quote
  },
  data () {
    return {
      quote: null
    }
  },
  created () {
    axios
      .get(window.appConfig.API_ADDR + '/quote/' + this.$route.params.id)
      .then(response => (this.quote = response.data))
      .catch(e => {
				this.errors.push(e)
			})
  }
}
</script>