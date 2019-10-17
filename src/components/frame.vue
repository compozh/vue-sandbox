<template>
  <main>
    <div class="toolbar"></div>
    <div class="sidebar"></div>
    <div class="viewer">
      <viewer></viewer>
    </div>
  </main>
</template>

<script>
  import Viewer from "@/components/pdf-viewer/Viewer"
  export default {
    name: "frame",
    components: {
      Viewer
    }
  }
</script>

<style scoped lang="scss">
  main {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
  }

    .toolbar {
      background: #9d9d9d;
      height: 60px;
      flex: 0 0 100%;
    }

    .sidebar, .viewer {
      height: calc(100% - 60px);
    }

    .sidebar {
      background: #6a6a6a;
      flex: 0 0 300px;
    }

    .viewer {
      background: #ddd;
      flex: 1 0 auto;
      overflow: hidden;
    }

</style>
