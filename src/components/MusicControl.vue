<template>
    <div class="controls">
        <h4>{{ songs[index].title }}</h4>
        <h5>{{ currentTimeText }} / {{ durationText }}</h5>
        <button @click="previous">Pre</button>
        <button v-if="!$store.state.isPlaying" @click="play">Play</button>
        <button v-else @click="pause">Pause</button>
        <button @click="next">Next</button>
        <audio ref="music"
            :src="playlist.songs[$store.state.currentSongIndex].audioUrl"
            @loadeddata="loadedData" @timeupdate="timeUpdate">
        </audio>
    </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";

export default {
    props: ["playlist"],
    setup(props) {
        const music = ref(null)
        const store = useStore()

        // Invoking actions and Mutating state datas
        store.dispatch('setAudioTag', music)
        store.dispatch('setSongs', props.playlist.songs)

        // Music Section
        const play = () => {
            store.state.audioTag.play()
            store.dispatch('changeIsPlaying', true)
        }
        const pause = () => {
            store.state.audioTag.pause()
            store.dispatch('changeIsPlaying', false)
        }
        const next = () => {
            if (store.state.songs.length - 1 > store.state.currentSongIndex) {
                store.dispatch('nextCurrentSongIndex', 1)
                store.state.isPlaying = false;
            } else {
                store.dispatch('nextCurrentSongIndex', -(store.state.songs.length - 1))
                store.state.isPlaying = false;
            }
        }
        const previous = () => {
            if (store.state.currentSongIndex != 0) {
                store.dispatch('previousCurrentSongIndex', 1)
                store.state.isPlaying = false;
            } else {
                store.dispatch('previousCurrentSongIndex', -(store.state.songs.length-1))
                store.state.isPlaying = false;
            }
        }

        return {
            music,
            play, pause, next, previous
        }
    }
}
</script>

