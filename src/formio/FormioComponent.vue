<template>
  <div>
    <formio id="formio" class="formio-container-class"
            :form=formioComponents
            :submission=formioSubmission
            :options=options
            @submit=onSubmit
            @change=onChange
            ref="formioComponent"
    />
    <formio-qr-scaner
      v-if="qrScanerVisible"
      @changeQrScanerVisible=changeQrScanerVisible
      @submitQrCode=submitQrCode
    />
  </div>
</template>

<script>
  import {Form} from './lib/components/Form'
  import VueApexCharts from 'vue-apexcharts'
  /* eslint-disable */
  export default {
    name: 'formio-component',
    components: {formio: Form, apexchart: VueApexCharts},
    data() {
      return {
        changedData: {},
        options: {noAlerts: true},
        qrScanerVisible: false,
        qrScanerCallback: () => {
        }
      }
    },
    created() {
      var me = this
      window.requestToServer = (eventCode, callback) => {
        me.requestToServerAction(eventCode, callback)
      }
      window.qrScaner = callback => {
        me.qrScaner(callback)
      }
      window.connectSignalR = (application, callback) => {
        me.connectSignalR(application, callback)
      }
      window.itemAutocomplete = (field, searchValue, callback) => {
        me.itemAutocomplete(field, searchValue, callback)
      }
    },
    props: {
      formDefinition: Object,
      formCode: String
    },
    watch: {
      formDefinition: function (newData, oldData) {
        this.changedData = {}
      }
    },
    computed: {
      formioComponents() {
        return {
          display: this.changedData.display || this.formDefinition.display || 'form',
          components: this.changedData.components || (this.formDefinition.components ? JSON.parse(this.formDefinition.components) : []),
          settings: this.changedData.settings || (this.formDefinition.settings ? JSON.parse(this.formDefinition.settings) : {})
        }
      },
      formioSubmission() {
        return this.changedData.submission || {data: this.formDefinition.submission ? JSON.parse(this.formDefinition.submission) : []}
      },
      ticket() {
        return this.$store.getters['formio/ticket']
      }
    },
    methods: {
      onSubmit(params) {
        this.$emit('formSubmit', JSON.stringify(params.data))
      },
      onChange(params) {

      },
      getFormSubmission() {
        var form = this.$refs.formioComponent
        return JSON.stringify(form.submission, null, 4)
      },
      requestToServerAction(eventCode, callback) {
        var me = this,
          form = this.$refs.formioComponent,
          display = form.form.display,
          components = JSON.stringify(form.form.components, null, 4),
          settings = JSON.stringify(form.form.settings, null, 4),
          submission = JSON.stringify(form.submission, null, 4)

        me.$store.dispatch('formio/callFormCustomEvent', {
          formCode: this.formCode,
          params: {eventCode, components, submission, display, settings}
        }).then(result => {
          if (!result) {
            return
          }
          if (callback) {
            callback(result);
          }

          var dataChanged = false;
          if (result.components && result.components != components) {
            components = result.components
            dataChanged = true
          }
          if (result.settings && result.settings != settings) {
            settings = result.settings
            dataChanged = true
          }
          if (result.display && result.display != display) {
            display = result.display
            dataChanged = true
          }

          if (dataChanged) {
            me.changedData = {
              display,
              components: JSON.parse(components),
              settings: JSON.parse(settings)
            }
          }

          if (result.submission && result.submission !== submission) {
            me.changedData.submission = JSON.parse(result.submission)
          }
        })
      },
      qrScaner(callback) {
        this.qrScanerVisible = true;
        this.qrScanerCallback = callback;
      },
      submitQrCode(qrCodeValue) {
        if (qrCodeValue.currentTarget) {
          qrCodeValue = qrCodeValue.currentTarget.value
        }
        if (this.qrScanerCallback) {
          this.qrScanerCallback(qrCodeValue)
        }
      },
      changeQrScanerVisible(state) {
        this.qrScanerVisible = state
      },
      connectSignalR(application, callback) {
        if (!application || !callback) {
          this.$store.commit('formio/setSnackbarErrorMessage', 'Ошибка инициализации SignalR')
          return
        }
        this.$signalR.connect(application, window.myConfig.SignalRUrl, callback, this.ticket)
      },
      itemAutocomplete(field, searchValue, callback) {
        var form = this.$refs.formioComponent,
          submission = JSON.stringify(form.submission, null, 4),
          fieldComponent = field.component,
          params = {
            fieldId: fieldComponent.key,
            tableName: fieldComponent.dataTable,
            fieldName: fieldComponent.dataTableFieldName,
            fieldCode: fieldComponent.dataTableFieldCode,
            searchValue,
            submission
          }

        this.$store.dispatch('formio/callItemAutocomplete',
          {
            formCode: this.formCode,
            params,
            fetchPolicy: fieldComponent.cachingData ? '' : 'network-only'
          }).then(result => {
          if (result && callback) {
            callback(result);
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .formio-container-class::v-deep {
    @import url('https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css');
    @import "~formiojs/dist/formio.full.min.css";
    @import "~bootstrap/dist/css/bootstrap";
    @import "~choices.js/public/assets/styles/choices.css";
    @import "~flatpickr/dist/flatpickr.min.css";

    font-size: 14px;
    font-weight: 500;

    label {
      margin-top: .5rem !important;
      font-size: 16px;
    }

    .row.formio-component.formio-component-columns {
      padding: 0 5px;
    }

    .form-group.has-feedback.formio-component-submit {
      margin-top: 1rem;
    }

    .editgrid-add {
      margin: 1rem;
    }

    .btn.btn-default.btn-sm.editRow {
      width: 50px;
      border: 1px solid #326DA8;
      color: #326DA8;
      height: 50px;
    }

    .btn.btn-default.btn-sm.editRow:hover {
      background-color: rgba(50, 109, 168, .12);
    }

    .btn.btn-danger {
      background: white;
      border: 1px solid rgba(179, 2, 2, 0.81);
      color: rgba(179, 2, 2, 0.81);
      height: 50px;
    }

    .btn.btn-danger:active, .btn.btn-danger:focus {
      outline: none !important;
      box-shadow: none;
    }

    .btn.btn-danger::-moz-focus-inner {
      border: 0;
    }

    .btn.btn-danger:hover {
      background-color: rgba(179, 2, 2, 0.12);
      height: 50px;
    }

    .table.datagrid-table.table-bordered thead {
      font-size: 16px;
    }

    .list-group-item.list-group-header.formio-edit-grid-header {
      font-size: 16px;
    }

    .form-group.has-feedback.formio-component.formio-component-radio {
      display: flex;
      flex-direction: column;
      align-items: start;
    }

    .form-group.has-feedback.formio-component.formio-component-radio .form-group {
      align-items: start;
      display: flex;
      flex-direction: column;
    }

    .form-group.has-feedback.formio-component.formio-component-select {
      display: flex;
      flex-direction: column;
      align-items: start;
    }

    .form-group.has-feedback.formio-component.formio-component-select .choices.form-group.formio-choices {
      min-width: 350px;
    }

    .list-group-item .btn-group.pull-right {
      width: 300px;
    }

    .nav-link {
      display: flex;
      color: #495057;
      height: 50px;
      font-size: 16px;
      justify-content: center;
      align-items: center;
    }

    .nav-link.active {
      color: #326DA8 !important;
    }

    .nav-item.active {
      color: #326DA8;
    }

    .btn.btn-primary.btn-md {
      background-color: white;
      border-color: #326DA8;
      color: #326DA8;
      height: 50px;
      padding-top: 8px;
    }

    .btn.btn-primary {
      background-color: white;
      border-color: #326DA8;
      color: #326DA8;
      height: 50px;
    }

    .btn.btn-primary:active, .btn.btn-primary:focus {
      outline: none !important;
      box-shadow: none;
    }

    .btn.btn-primary:hover {
      background-color: rgba(50, 109, 168, .12);
      color: #326DA8;
    }

    .btn {
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      padding-top: 6px;
      outline: none !important;
    }

    .btn.btn-primary.btn-md:hover {
      background-color: rgba(50, 109, 168, .12)
    }

    .btn.btn-success.btn-lg {
      background-color: white;
      border-color: rgba(40, 165, 69, 1);
      color: rgba(40, 165, 69, 1);
      height: 50px;
      width: 55px;
      padding: 0;
    }

    .btn.btn-success:active, .btn.btn-success:focus {
      outline: none !important;
      box-shadow: none;
    }

    .btn.btn-success.btn-lg:hover {
      background-color: rgba(40, 165, 69, .12);
      color: rgba(40, 165, 69, 1);
    }

    .form-group.has-feedback.formio-component {
      text-align: start;
    }

    .form-group.has-feedback.formio-component.formio-component-button.formio-component-submit.form-group {
      text-align: center;
    }

    .editgrid-add {
      text-align: center;
    }

    .editgrid-actions {
      text-align: center;
    }

    .row.formio-component.formio-component-columns.formio-component-columns {
      display: flex;
      justify-content: space-around;
    }

    /*input MD*/
    .form-control {
      border: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.42);
      border-radius: 0;
      outline: none;
      transition: 0.5s ease all;
      -moz-transition: 0.5s ease all;
      -webkit-transition: 0.5s ease all;
    }

    .form-control:focus {
      outline: none;
      box-shadow: none;
      border-bottom: 2px solid #326da8;
      transition: 0.5s ease all;
      -moz-transition: 0.5s ease all;
      -webkit-transition: 0.5s ease all;
    }

    .form-control[disabled="disabled"] {
      border: none;
    }

    /*checkbox MD*/
    .control-label.form-check-label {
      margin: 16px 0;
      display: block;
      cursor: pointer;

      input {
        display: none;

        & + span {
          line-height: 20px;
          height: 20px;
          padding-left: 20px;
          display: block;
          position: relative;

          &:not(:empty) {
            padding-left: 20px + 8;
          }

          &:before,
          &:after {
            content: '';
            width: 20px;
            height: 20px;
            display: block;
            border-radius: 50%;
            left: 0;
            top: 0;
            position: absolute;
          }

          &:before {
            background: #D1D7E3;
            transition: background .2s ease, transform .4s cubic-bezier(.175, .885, .32, 2);
          }

          &:after {
            background: #fff;
            transform: scale(.78);
            transition: transform .6s cubic-bezier(.175, .885, .32, 1.4);
          }
        }

        &:checked + span {
          &:before {
            transform: scale(1.04);
            background: #326da8;
          }

          &:after {
            transform: scale(.4);
            transition: transform .3s ease;
          }
        }
      }

      &:hover {
        input {
          & + span {
            &:before {
              transform: scale(.92);
            }

            &:after {
              transform: scale(.74);
            }
          }

          &:checked + span {
            &:after {
              transform: scale(.4);
            }
          }
        }
      }
    }
  }

  .downtimes-block .formio-container /deep/ {
    width: 100%;
    display: flex;
    justify-content: center;

    .form-group.has-feedback.formio-component {
      align-items: center;
      text-align: center !important;
    }

    .input-group-addon.input-group-append {
      display: none;
    }
  }

  .downtime-layout {
    .formio-container /deep/ {
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 10px 20px;
      background-color: #fff;

      div {
        width: 100%;

        .form-group.has-feedback.formio-component {
          width: 100%;
          align-items: center;
          text-align: center !important;
        }

        .input-group-addon.input-group-append {
          display: none;
        }
      }
    }
  }
</style>
