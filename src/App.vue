<template>
    <Navbar />
    <div class="content">
      <router-view />
    </div>
    <Controls />
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Controls from './components/Controls.vue';

export default {
  components: { Navbar, Controls }
}
</script>

<style>
.content {
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 20px;
}
</style>