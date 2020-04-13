<template>
  <div>
    <div class="text-left">
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-sm-4">
              <img class="img rounded" :src="user.picture">
            </div>
            <div class="col-sm-8">
              <span class="align-middle">
                <h5><strong>{{ user.username }}</strong></h5>
                <p>{{ user.email }} <small><span v-if="!user.email_verified">Not Verified</span><span v-else>Verified</span></small></p>
              </span>
              <button class="btn btn-primary btn-sm disabled">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>
      <hr>
      <h5>Quotes</h5>
      <p>Nothing to see here...</p>
      <hr>
      <h5>Images</h5>
      <p>Nothing to see here...</p>
    </div>

  </div>


</template>

<script>
// @ is an alias to /src

export default {
  name: 'Profile',
  components: {
    
  },
  data () {
    return {
      quote: null,
      errors: [],
      user: this.$auth.user
    }
  },
  created () {
  
  }
}
</script>
