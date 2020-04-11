<template>
  <div class="modal fade" id="modalAddQuote" tabindex="-1" role="dialog" aria-labelledby="addQuoteModalTitlte" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addQuoteModalTitlte">Add Quote</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit="formSubmit">
            <p v-if="errors.length">
              <b>Please correct the following error(s):</b>
              <ul>
                <li v-for="error in errors" v-bind:key="error.id">{{ error }}</li>
              </ul>
            </p>
            <input v-model="quote" placeholder="edit me">
            <button type="submit" class="btn btn-success">Submit</button>
          </form>
          {{ quote }}
          <strong>Output:</strong>
          <pre>
            {{output}}
          </pre>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
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
      quote: null,
      output: null
    }
  },
  methods: {
    formSubmit: function (e) {
      this.errors = [];

      if (!this.quote) {
        this.errors.push('A Quote required.');
      }
      e.preventDefault();
      this.$auth.getTokenSilently().then(accessToken => {
        console.log(accessToken);
        let currentObj = this;
        axios
          .post(
            window.appConfig.API_ADDR + '/quote', 
            {
              text: this.quote,
              type: 'site',
              quote_by: 'asd',
              submitted_by: 'thisguy'
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
          })
          .catch(e => {
            this.errors.push(e)
            // console.error(e);
          });
      }).catch(e => {
        this.errors.push(e)
        console.error('here');
      });
    }
  }
}
</script>