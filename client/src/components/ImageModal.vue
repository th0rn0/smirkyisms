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
      this.$auth.getTokenSilently().then(accessToken => {
        let currentObj = this;
        this.loading = true;
        let formData = new FormData();
        formData.append('type', 'site');
        formData.append('submitted_by', this.$auth.user.sub);
        formData.append('image', this.image);
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
            currentObj.output = response.data;
            if (response.status == 200) {
              this.$router.push({ path : '/images/' + response.data.id });
              window.location.href = '/images/' + response.data.id;
            }
          })
          .catch(e => {
            this.loading = false;
            this.errors.push(e)
            // console.error(e);
          });
      }).catch(e => {
        this.loading = false;
        this.errors.push(e)
      });
    },
    onFileSelected: function(e) {
      this.image = e.target.files[0];

    }
  }
}
</script>