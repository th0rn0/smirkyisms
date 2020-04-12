<template>
  <div class="home">
    <PageHeader header="Profile"/>
		{{ user }}<br>
		Nickname: {{ user.nickname }}<br>
		Name: {{ user.name }}<br>
		Email: {{ user.email }}<br>
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
      quote: null,
      errors: [],
      user: this.$auth.user
    }
  },
  created () {
    axios
      .get(window.appConfig.API_ADDR + '/quote/random')
      .then(response => (this.quote = response.data))
      .catch(e => {
				this.errors.push(e)
			})
  }
}
</script>
