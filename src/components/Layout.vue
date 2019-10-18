<template>
  <main>
    <div class="toolbar">TOOLBAR</div>
    <div class="sidebar">SIDEBAR</div>
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

    .toolbar, .sidebar {
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 30px;
    }

    .sidebar, .viewer {
      height: calc(100% - 60px);
    }

    .toolbar {
      background: #9d9d9d;
      height: 60px;
      flex: 0 0 100%;
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
