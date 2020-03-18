<template>
  <div id="app" class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Quote msg="Welcome to Smirkyisms"/>
    {{ info }}
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
	el: '#app',
  data () {
    return {
      info: null
    }
  },
  created () {
    axios
      .get('http://localhost:1337/quote')
      .then(response => (this.info = response.data))
      .catch(e => {
				this.errors.push(e)
			})
  }
}
</script>
