<template>
  <div class="quotes">
    <Quote 
      v-for="quote in quotes" 
      v-bind:key="quote.id"
      v-bind:type="quote.type"
      v-bind:quote="quote.text"
      v-bind:discord_server_name="quote.discord_server_name"
      v-bind:discord_channel_name="quote.discord_channel_name"
      v-bind:quote_by="quote.quote_by"
      v-bind:submitted_by="quote.submitted_by"
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
      quotes: null
    }
  },
  created () {
    axios
      .get('http://localhost:1337/quote')
      .then(response => (this.quotes = response.data))
      .catch(e => {
				this.errors.push(e)
			})
  }
}
</script>