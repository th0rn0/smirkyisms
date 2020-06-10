<template>
  <div class="modal fade" id="modalAddImage" tabindex="-1" role="dialog" aria-labelledby="addImageModalTitlte" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addImageModalTitlte">Add Image</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <circle-spin v-if="loading"></circle-spin>
          <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors" v-bind:key="error.id">{{ error }}</li>
            </ul>
          </p>
          <div class="form-group">
            <!-- <textarea class="form-control" v-model="quote" placeholder="Some Funny Image"></textarea> -->
            <input name="image" class="form-control" type="file" @change="onFileSelected">
            <input type="hidden" name="url" value="">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" @click="upload" class="btn btn-success">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      errors: [],
      image: null,
      output: null,
      loading: false
    }
  },
  methods: {
    upload() {
      console.log(this.image);
      this.$auth.getTokenSilently().then(accessToken => {
        let currentObj = this;
        this.loading = true;
        let formData = new FormData();
        formData.append('image', this.image);
        formData.append('type', 'site');
        axios
          .post(
            window.appConfig.API_ADDR + '/image', 
            formData,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          )
          .then(response => {
            // console.log(response);
            currentObj.output = response.data;
            if (response.status == 200) {
              this.$router.push({ path : '/images/' + response.data.id });
              // console.log(response.data.id);
              window.location.href = '/images/' + response.data.id;
            }
          })
          .catch(e => {
            this.loading = false;
            this.errors.push(e)
            console.error(e);
          });
      }).catch(e => {
        this.loading = false;
        this.errors.push(e)
      });
    },
    onFileSelected: function(e) {
      console.log(e);
      this.image = e.target.files[0];
      console.log(this.image);

    }
    // formSubmit: function (e) {
    //   this.errors = [];

    //   if (!this.quote) {
    //     this.errors.push('A Quote required.');
    //   }
    //   if (!this.quote_by) {
    //     this.errors.push('A Name required.');
    //   }
    //   if (!this.$auth.isAuthenticated) {
    //     this.errors.push('You must Login first!');
    //   }
    //   e.preventDefault();
    //   this.$auth.getTokenSilently().then(accessToken => {
    //     let currentObj = this;
    //     this.loading = true;
    //     axios
    //       .post(
    //         window.appConfig.API_ADDR + '/image', 
    //         {
    //           image: this.quote,
    //           type: 'site'
    //         },
    //         {
    //           headers: {
    //             Authorization: `Bearer ${accessToken}`
    //           }
    //         }
    //       )
    //       .then(response => {
    //         // console.log(response);
    //         currentObj.output = response.data;
    //         if (response.status == 200) {
    //           this.$router.push({ path : '/images/' + response.data.id });
    //           // console.log(response.data.id);
    //           window.location.href = '/images/' + response.data.id;
    //         }
    //       })
    //       .catch(e => {
    //         this.loading = false;
    //         this.errors.push(e)
    //         // console.error(e);
    //       });
    //   }).catch(e => {
    //     this.loading = false;
    //     this.errors.push(e)
    //   });
    // }
  }
}
</script>