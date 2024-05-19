<template>
    <div class="music-controls" style="position: fixed; bottom: 0;" v-if="$store.state.songs">
        <div class="cover" v-if="$store.state.songs[$store.state.currentSongIndex]">
            <div class="song">
                <div style="">
                    <img style="width: 100px; height: 80px; border-radius: 5px;"
                        :src="$store.state.songs[$store.state.currentSongIndex].songUrl">
                </div>
                <div style="margin-left: 20px;">
                    <h2 style="color: rgb(255, 255, 255);">{{
                        $store.state.songs[$store.state.currentSongIndex].title }}</h2>
                    <h5 style="font-weight: bold; color: rgb(255, 255, 255);">{{
                        $store.state.songs[$store.state.currentSongIndex].artist }}</h5>
                </div>
            </div>
            <div class="controls">
                <div style="">
                    <audio ref="music" :src="$store.state.audioSrc" @ended="autoPlayNext" @loadeddata="readDuration"
                        @timeupdate="readCurrentTime"></audio>
                    <div style="display: flex; justify-content: center; align-items: center;">
                        <div style="margin: 0 40px;" :disabled="!$store.state.songs.length > 0" @click="previous"><i
                                class="fa-solid fa-backward-step" style="color: rgb(255, 255, 255); font-size: 1.5rem;"></i>
                        </div>
                        <div style="margin: 0 40px;" v-if="!$store.state.isPlaying"
                            :disabled="!$store.state.songs.length > 0" @click="play"><i class="fa-regular fa-circle-play"
                                style="color: rgb(255, 255, 255); font-size: 2.5rem;"></i></div>
                        <div style="margin: 0 40px;" v-else :disabled="!$store.state.songs.length > 0" @click="pause"><i
                                class="fa-solid fa-pause" style="color: rgb(255, 255, 255); font-size: 2.5rem;"></i></div>
                        <div style="margin: 0 40px;" :disabled="!$store.state.songs.length > 0" @click="next"><i
                                class="fa-solid fa-forward-step" style="color: rgb(255, 255, 255); font-size: 1.5rem;"></i>
                        </div>
                    </div>
                </div>
                <div style="display: flex; align-items: center;">
                    <p
                        style="width: 20%; color: rgb(255, 255, 255); font-family: sans-serif; font-weight: 500; font-size: 12px;">
                        {{ currentTimeText }}</p>
                    <input style="background-color: green;" :disabled="!$store.state.songs.length > 0" class="range"
                        type="range" ref="range" max="99" min="0" value="0" @input="controlProgress">
                    <p
                        style="width: 20%; color: rgb(255, 255, 255); font-family: sans-serif; font-weight: 500; font-size: 12px;">
                        {{ durationText }}</p>
                </div>
            </div>
            <div class="volume">
                <div v-if="volumeIcon > 50" style="margin-right: 30px;"><i class="fa-solid fa-volume-high"
                        style="color: rgb(255, 255, 255); font-size: 1.3rem;"></i></div>
                <div v-if="volumeIcon <= 50 && volumeIcon > 0" style="margin-right: 30px;"><i class="fa-solid fa-volume-low"
                        style="color: rgb(255, 255, 255); font-size: 1.3rem;"></i></div>
                <div v-if="volumeIcon == 0" style="margin-right: 30px;"><i class="fa-solid fa-volume-xmark"
                        style="color: rgb(255, 255, 255); font-size: 1.3rem;"></i></div>
                <div style="margin-right: 30px;">
                    <input :disabled="!$store.state.songs.length > 0" type="range" ref="vol" class="range"
                        style="width: 10rem;" max="99" min="0" value="99" @input="controlVol">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { ref, onMounted, watchEffect } from 'vue';

export default {
    setup(props) {
        const store = useStore()
        const music = ref(null)

        // Minutes and seconds section
        let durationText = ref("00 : 00");
        let currentTimeText = ref("00 : 00");
        let duration = 0;
        const readDuration = () => {
            // total duration  (LoadedData)
            duration = Math.floor(music.value.duration);
            durationText.value = createMinutesAndSeconds(duration);
        };
        const readCurrentTime = () => {
            // Current time (Timeupdate)
            // Check if music is not null before accessing its properties
            if (music.value) {
                // Vue does not automatically remove event listeners when a component is unmounted which can lead to error of trying to access audioTag.value(null).currentTime
                const currentTime = Math.floor(music.value.currentTime);
                currentTimeText.value = createMinutesAndSeconds(currentTime);
                // Range
                const rangeWidth = (99 / duration) * currentTime;
                range.value.value = rangeWidth;
            }
        };
        const createMinutesAndSeconds = (totalSecond) => {
            const minutes = Math.floor(totalSecond / 60);
            const seconds = totalSecond % 60;
            const minutesText = minutes < 10 ? "0" + minutes.toString() : minutes;
            const secondsText = seconds < 10 ? "0" + seconds.toString() : seconds;
            return minutesText + " : " + secondsText;
        };

        let changedTime = 0
        const range = ref(null)
        const controlProgress = () => {
            if (music.value.duration) {
                changedTime = music.value.duration * (range.value.value / 100);
                music.value.currentTime = changedTime;
            }
        }

        const vol = ref(null)
        const volumeIcon = ref(100)
        const controlVol = () => {
            music.value.volume = vol.value.value / 100
            volumeIcon.value = vol.value.value
        }

        // Send datas
        watchEffect(() => {
            store.dispatch('addAudioTag', music.value)
        })

        // Control Section

        const play = async () => {
            await store.dispatch('play')

            if (store.state.songs[store.state.currentSongIndex] && store.state.enteredPlaylistSongs[store.state.currentSongIndex]) {
                if (store.state.songs[store.state.currentSongIndex].id == store.state.enteredPlaylistSongs[store.state.currentSongIndex].id) {
                    store.dispatch('showWaveAndPlayPause')
                } else {
                    store.dispatch('hideWaveAndPlayPause')
                }
            }

        };
        const pause = () => {
            store.dispatch('pause')
        };
        const next = () => {
            store.dispatch('next')
            if (store.state.songs[store.state.currentSongIndex] && store.state.enteredPlaylistSongs[store.state.currentSongIndex]) {
                if (store.state.songs[store.state.currentSongIndex].id == store.state.enteredPlaylistSongs[store.state.currentSongIndex].id) {
                    store.dispatch('showWaveAndPlayPause')
                } else {
                    store.dispatch('hideWaveAndPlayPause')
                }
            }

        };
        const previous = () => {
            store.dispatch('previous')
            if (store.state.songs[store.state.currentSongIndex] && store.state.enteredPlaylistSongs[store.state.currentSongIndex]) {
                if (store.state.songs[store.state.currentSongIndex].id == store.state.enteredPlaylistSongs[store.state.currentSongIndex].id) {
                    store.dispatch('showWaveAndPlayPause')
                } else {
                    store.dispatch('hideWaveAndPlayPause')
                }
            }
        };

        // Auto play next after one song ends
        const autoPlayNext = () => {
            next()
        }

        return { music, range, vol, volumeIcon, controlVol, controlProgress, play, pause, next, autoPlayNext, previous, durationText, currentTimeText, readCurrentTime, readDuration }
    }
}
</script>

<style>
.progressBar {
    border: 0.5px solid black;
    height: 3px;
    border-radius: 8px;
    width: 20em;
    margin: 20px auto;
}

.currentProgress {
    background-color: rgb(0, 0, 0);
    width: 0;
    height: 100%;
}

.range {
    padding: 0;
    height: 5px;
}

input[type="range"] {
    accent-color: rgb(26, 255, 0);
}

.music-controls {
    background-color: rgb(0, 0, 0);
    width: 100%;
}

.cover {
    display: flex;
    padding: 15px;
    align-items: center;
}

.song {
    width: 30%;
    display: flex;
    align-items: center;
}

.controls {
    width: 40%;
    text-align: center;
}

.volume {
    width: 30%;
    display: flex;
    justify-content: end;
    align-items: center;
}</style>