<template>
  <div class="home">
    <img width="20%" alt="Vue logo" src="../assets/smirkyisms.jpg">
    <PageHeader header="Welcome to Smirkyisms"/>
		<!-- <QuoteItem v-for="quote in quotes" v-bind:key="quote.id" v-bind:quote="quote.text" /> -->
		<QuoteItem v-bind:quote="quote.text" />
  </div>
</template>

<script>
// @ is an alias to /src
import PageHeader from '@/components/PageHeader.vue'
import QuoteItem from '@/components/Quote.vue'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    PageHeader,
    QuoteItem
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
