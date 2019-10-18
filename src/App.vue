<template>
  <div>
    <formio-component
      ref="formioForm"
      :formCode="formioCode"
      :formDefinition="formioDefinition"
    ></formio-component>
    <button @click="getForm(formioCode)">GET FORM!</button>
  </div>
</template>

<script>
  import FormioComponent from '@/formio/FormioComponent';

  export default {
    components: {
      FormioComponent
    },
    data: () => ({
      formioCode: 'AUTOCOMPLETE',
      formioDefinition: {}
    }),
    methods: {
      async getForm(formCode) {
        try {
          const result = await this.$store.dispatch('formio/getForm', {formCode})
          if (result) {
            console.log('', result)
            this.formioDefinition = result
          }
        } catch (e) {
          console.log('', e)
        }
      },
      onFormioSubmit() {
        const form = this.$refs.formioForm;
        const submission = JSON.parse(form.getFormSubmission());
        const params = [];
        for (let param in submission.data) {
          params.push({name: param, type: typeof (submission.data[param]), value: submission.data[param]});
        }
        //this.formioCode = '';
        this.formioDefinition = {};
      }
    }
  }
</script>

<style>

</style>
