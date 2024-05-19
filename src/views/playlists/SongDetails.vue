<template>
    <div class="songContainer">
        <button onclick="history.back()">Back</button>
        <h2>Tiitle</h2>
        <h4>Artist</h4>
            <img src="" style="width: 300px; height: 400px;" />
            <button @click="play">Play this song</button>
            <button @click="pause">Pause</button>
    </div>
    <div><h3>There is no song in this page.</h3></div>
</template>

<script>
import { ref, watchEffect } from "vue";
import Controls from '@/components/Controls.vue'
import { useStore } from "vuex";

export default {
    components: { Controls },
    setup(props) {
        const store = useStore()
        const playing = ref(false)

        return {  }
    }
}
</script>

<style scoped>
.songContainer {
    text-align: center;
}
</style>
