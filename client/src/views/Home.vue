<template>
  <div id="app" class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Smirkyisms"/>
    {{ info }}
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    HelloWorld
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
