<template>
  <div class="quotes">
    <circle-spin v-if="isLoading"></circle-spin>
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
  methods: {
    hideLoading() {
      this.isLoading = false;
    }
  },
  data () {
    return {
      quotes: null,
      isLoading: false
    }
  },
  created () {
    this.isLoading = true;
    axios
      .get(window.appConfig.API_ADDR + '/quote?sort=createdAt%20DESC')
      .then(response => {
        this.quotes = response.data;
        this.isLoading = false;
      })
      .catch(e => {
				this.errors.push(e)
			})
  }
}
</script>