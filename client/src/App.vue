<template>
  <div id="app">
    <main role="main">
      <img width="10%" alt="Vue logo" src="./assets/smirkyisms.jpg" class="mt-3 img rounded">
      <div id="nav">
        <router-link to="/">Random</router-link> |
        <router-link to="/quotes">Quotes</router-link> |
        <router-link to="/images">Images</router-link> |
        <router-link to="/videos">Videos</router-link> |
        <a v-if="$auth.isAuthenticated" href="#" class="router-link-active" data-toggle="modal" data-target="#modalAddQuote">Add Quote</a><span v-if="$auth.isAuthenticated"> | </span> 
        <a v-if="$auth.isAuthenticated" href="#" class="router-link-active" data-toggle="modal" data-target="#modalAddImage">Add Image</a><span v-if="$auth.isAuthenticated"> | </span> 
        <a v-if="$auth.isAuthenticated" href="#" class="router-link-active" data-toggle="modal" data-target="#modalAddVideo">Add Video</a><span v-if="$auth.isAuthenticated"> | </span> 
        <!-- Check that the SDK client is not currently loading before accessing is methods -->
        <router-link v-if="$auth.isAuthenticated" to="/profile">Profile</router-link><span v-if="$auth.isAuthenticated"> | </span> 
        <a v-if="$auth.isAuthenticated" @click="logout" class="button is-dark">Log out</a>
        <a v-if="!$auth.isAuthenticated" @click="login" class="button is-dark">Sign in</a>
      </div>
      <div id="main-body" class="container">
        <router-view/>
      </div>
    </main>
    <QuoteModal />
    <ImageModal />
    <VideoModal />
  </div>
</template>

<script>

import QuoteModal from '@/components/QuoteModal.vue'
import ImageModal from '@/components/ImageModal.vue'
import VideoModal from '@/components/VideoModal.vue'

export default {
  components: {
    QuoteModal,
    ImageModal,
    VideoModal
  },
  data() {
    return {
      quote: null,
    }
  },
  created () {

  },
  methods: {
    // Log the user in
    login() {
      this.$auth.loginWithRedirect();
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
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
  max-width: 800px;
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
