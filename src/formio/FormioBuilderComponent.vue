<template>
    <div class="toolbar-builder-container">
        <v-layout row wrap
            class="toolbar"
        >
            <v-btn
                outlined
                @click="onAction"
                class="toolbar-item"
                :loading=buttonLoading
            >
                {{actionText}}
            </v-btn>
            <v-btn
                outlined
                class="toolbar-item"
                @click="onCancel"
                :disabled=buttonLoading
            >
                Отменить
            </v-btn>
            <v-text-field
                class="toolbar-item form-code-text-field"
                :disabled="Boolean(Object.keys(formDefinition).length)"
                v-model=formCodeProperty
                :full-width=false
                counter
                :maxlength="10"
                label="Код формы"
                required
            />
            <v-text-field
                class="toolbar-item form-name-text-field"
                v-model=formNameProperty
                label="Наименование формы"
                required
            />
        </v-layout>
        <formbuilder
            class="formio-builder-component-class"
            :form=formioComponents
            :options=options
            ref="formio"
        />
    </div>
</template>

<script>
import { FormBuilder } from './lib/components/FormBuilder'
import VueApexCharts from 'vue-apexcharts'
/* eslint-disable */
export default {
  name: 'formio-builder-component',
  components: { formbuilder: FormBuilder, apexchart: VueApexCharts },
  data() {
    return {
        formCodeProperty: this.formDefinition.formCode,
        formNameProperty: this.formDefinition.name,
        options: { noAlerts: true }
    }
  },
  props: {
    formDefinition: Object,
    buttonLoading: Boolean
  },
  computed: {
    formioComponents() {
      return {
        display: this.formDefinition.display || 'form',
        components: this.formDefinition.components ? JSON.parse(this.formDefinition.components) : [],
        settings: this.formDefinition.settings ? JSON.parse(this.formDefinition.settings) : {}
      }
    },
    formioSubmission() {
      return { data: this.formDefinition.submission ? JSON.parse(this.formDefinition.submission) : [] }
    },
    actionText() {
        return Object.keys(this.formDefinition).length ? 'Сохранить' : 'Создать';     
    }
  },
  methods: {
    onChange(params) {
        this.$emit('change', this.getFormParams());
    },
    onAction() {
        this.$emit('action', this.getFormParams());
    },
    onCancel() {
        this.$emit('cancel', this.getFormParams());
    },
    getFormParams() {
        var me = this,
            form = this.$refs.formio

        return {
            formCode: this.formCodeProperty,
            name: this.formNameProperty,
            display: form.form.display,
            components: JSON.stringify(form.form.components, null, 4),
            settings: JSON.stringify(form.form.settings, null, 4)
        }
    }
  }
}
</script>

<style lang="scss">
    .formio-builder-component-class /deep/ {
        @import url('https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css');
        @import "~formiojs/dist/formio.full.min.css";
        @import "~bootstrap/dist/css/bootstrap";            
        padding: 0 10px;
        .component-settings-button > i {
            position: relative;
            top: -7px;
            left: -5px;
        }
    }
    .toolbar {
        margin: 9px 0 0 0;
    }
    .toolbar-item {
        padding: 0 5px;
    }
    .form-code-text-field {
        max-width: 200px;
    }
    .form-name-text-field {
      max-width: 500px;  
    }
</style>
