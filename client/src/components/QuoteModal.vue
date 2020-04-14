<template>
  <div class="modal fade" id="modalAddQuote" tabindex="-1" role="dialog" aria-labelledby="addQuoteModalTitlte" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <form @submit="formSubmit">
          <div class="modal-header">
            <h5 class="modal-title" id="addQuoteModalTitlte">Add Quote</h5>
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
              <label for="quoteByLabel">Who said it?</label>
              <input class="form-control" type="text" v-model="quote_by" placeholder="Who said it?">
            </div>
            <div class="form-group">
              <label for="exampleInputEmail1">Quote</label>
              <textarea class="form-control" v-model="quote" placeholder="Some Funny Quote"></textarea>
              <input type="hidden" name="url" value="">
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-success">Save changes</button>
          </div>
        </form>
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
      quote: null,
      output: null,
      loading: false
    }
  },
  methods: {
    formSubmit: function (e) {
      this.errors = [];

      if (!this.quote) {
        this.errors.push('A Quote required.');
      }
      if (!this.quote_by) {
        this.errors.push('A Name required.');
      }
      if (!this.$auth.isAuthenticated) {
        this.errors.push('You must Login first!');
      }
      e.preventDefault();
      this.$auth.getTokenSilently().then(accessToken => {
        let currentObj = this;
        this.loading = true;
        axios
          .post(
            window.appConfig.API_ADDR + '/quote', 
            {
              text: this.quote,
              type: 'site',
              quote_by: this.quote_by,
              submitted_by: this.$auth.user.sub
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            }
          )
          .then(response => {
            // console.log(response);
            currentObj.output = response.data;
            if (response.status == 200) {
              this.$router.push({ path : '/quotes/' + response.data.id });
              // console.log(response.data.id);
              window.location.href = '/quotes/' + response.data.id;
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
    }
  }
}
</script>