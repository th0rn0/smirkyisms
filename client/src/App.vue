<template>
  <div id="app">
    <main role="main">
      <img width="10%" alt="Vue logo" src="./assets/smirkyisms.jpg" class="mt-3">
      <div id="nav">
        <router-link to="/">Random</router-link> |
        <router-link to="/quotes">Quotes</router-link> |
        <a href="#" class="router-link-active" data-toggle="modal" data-target="#modalAddQuote">Add Quote</a>
      </div>
      <div id="main-body" class="container">
        <router-view/>
      </div>
    </main>
    <QuoteModal />
  </div>
</template>

<script>

import QuoteModal from '@/components/QuoteModal.vue'

export default {
  components: {
    QuoteModal
  },
  data() {
    return {
      quote: null
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#main-body {
  max-width: 500px;
}

#nav {
  padding: 15px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
