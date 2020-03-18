<template>
  <div class="home">
    <img width="20%" alt="Vue logo" src="../assets/smirkyisms.jpg">
    <PageHeader header="Welcome to Smirkyisms"/>
    <ul>
			<li v-for="quote in quotes" :key="quote.text">
				{{ quote.text }}
			</li>
    </ul>
    {{ errors }}
  </div>
</template>

<script>
// @ is an alias to /src
import PageHeader from '@/components/PageHeader.vue'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    PageHeader
  },
  data () {
    return {
      quotes: null,
      errors: [],
    }
  },
  created () {
    axios
      .get('http://localhost:1337/quote/random')
      .then(response => (this.quotes = response.data))
      .catch(e => {
				this.errors.push(e)
			})
  }
}
</script>
