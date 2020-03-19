<template>
  <div class="quotes">
    <img width="20%" alt="Vue logo" src="../assets/smirkyisms.jpg">
		<PageHeader header="Quotes"/>
		<Quote v-for="quote in quotes" v-bind:key="quote.id" v-bind:quote="quote.text" />
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
    Quote,
    PageHeader
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