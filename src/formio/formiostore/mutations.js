export default {
  setLinearLoader(state, linearLoader) {
    state.linearLoader = linearLoader
  },
  closeDialogLinearLoader(state) {
    state.dialogLinearLoader.visible = false
  },
  closeSnackbar(state) {
    state.snackbar.visible = false
  },
  setDialogLinearLoaderMessage(state, message) {
    state.dialogLinearLoader.message = message
    state.dialogLinearLoader.visible = true
  },
  setSnackbarErrorMessage(state, message) {
    state.snackbar.message = message
    state.snackbar.type = 'error'
    state.snackbar.visible = true
  },
  setSnackbarSuccessMessage(state, message) {
    state.snackbar.message = message
    state.snackbar.type = 'success'
    state.snackbar.visible = true
  },
  setTicket(state, ticket) {
    state.ticket = ticket
  }
}
