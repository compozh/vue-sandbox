<template>
  <main>
    <div class="toolbar"></div>
    <div class="sidebar"></div>
    <div class="viewer">
      <pdf></pdf>
    </div>
  </main>
</template>

<script>
  import pdf from "@/pdf/pdf"
  export default {
    name: "frame",
    components: {
      pdf
    }
  }
</script>

<style scoped lang="scss">
  main {
    display: flex;
  }

    .toolbar {
      background: #9d9d9d;
      height: 60px;
      width: 100%;
    }

    .sidebar {
      background: #6a6a6a;
      height: 100%;
      width: 300px;
    }

</style>
