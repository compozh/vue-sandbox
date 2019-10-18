import { FormioApi } from '../api/formioApi'
// import Vue from 'vue'
// import  { routerDependencies } from '../../router'

const api = new FormioApi()
/* eslint-disable */
export default {
  async initializeTicket({commit}) {
        const result = await api.getTicketFromGql()
        commit('setTicket', result)
  },
  async getForm({ commit }, { formCode, properties }) {

    return this.dispatch('formio/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.getFormGql(formCode, properties)
      }
    })
  },
  async callFormCustomEvent({ commit }, { formCode, params }) {
    return await this.dispatch('formio/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.callFormCustomEventGql(formCode, params)
      }
    })
  },
  async callItemAutocomplete({ commit }, { formCode, params, fetchPolicy }) {
    return await this.dispatch('formio/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.callItemAutocompleteGql(formCode, params, fetchPolicy)
      }
    })
  },
  async createForm({ commit }, formDefinition) {
    return await this.dispatch('formio/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.createFormGql(formDefinition)
      }
    })
  },
  async saveForm({ commit }, formDefinition) {
    return await this.dispatch('formio/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.saveFormGql(formDefinition)
      }
    })
  },
  async submitForm({ commit }, { formCode, submission, properties }) {
    return await this.dispatch('formio/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.submitFormGql(formCode, submission, properties)
      }
    })
  },
  async graphqlQueryWithRequestResultWraper({ commit }, { queryAction }) {
    commit('closeSnackbar')
    try {
      let result = await queryAction()
      if (result.success == true) {
        if (result.successMessage) {
          commit('setSnackbarSuccessMessage', result.successMessage)
        }
      } else {
        commit('setSnackbarErrorMessage', result.errorMessage)
      }
      return result
    } catch (e) {
      if (e.networkError && e.networkError.statusCode == 401) {
        // Vue.prototype.$authentication.resetCurentUser()
        // routerDependencies.router.push({name: 'LOGIN'})
      }
      else {
        commit('setSnackbarErrorMessage', e.message)
      }
    }
    return false
  }
}
