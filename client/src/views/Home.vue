<template>
  <div class="home">
    <PageHeader header="Smirkyisms"/>
    <Quote 
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
import PageHeader from '@/components/PageHeader.vue'
import Quote from '@/components/Quote.vue'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    PageHeader,
    Quote
  },
  data () {
    return {
      quote: null,
      errors: [],
    }
  },
  created () {
    axios
      .get('http://localhost:1337/quote/random')
      .then(response => (this.quote = response.data))
      .catch(e => {
				this.errors.push(e)
			})
  }
}
</script>
