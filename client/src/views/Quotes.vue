<template>
  <div class="quotes">
    <img alt="Vue logo" src="../assets/logo.png">
    <PageHeader header="Quotes"/>
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