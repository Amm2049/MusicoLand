<template>
  <div class="error" v-if="error">{{ error }}</div>
  <div v-if="playlist" class="playlist-details" style="position: relative;">

    <!-- playlist information -->
    <div class="playlist-info">
      <div class="cover">
        <img :src="playlist.coverUrl">
      </div>
      <h2>{{ playlist.title }}</h2>
      <p class="username">Created by {{ playlist.userName }}</p>
      <p class="description">{{ playlist.description }}</p>
      <button v-if="ownership" @click="handleDelete">Delete Playlist</button>
    </div>

    <!-- song list -->
    <div class="song-lis">
      <div v-if="!playlist.songs.length">No songs have been added to this playlist yet.</div>
      <div class="runPlaylistSongs" v-if="playlist.songs.length" style="position: absolute; top: -3.5rem; right: 10rem;">
        <div v-if="!isPlaying" @click="playThisPlaylist" class="album"><i class="fa-solid fa-circle-play"
            style="font-size: 3rem; color: rgb(25, 255, 25);"></i></div>
        <div v-else @click="pauseThisPlaylist" class="album"><i class="fa-solid fa-circle-pause"
            style="font-size: 3rem; color: rgb(25, 255, 25);"></i></div>
      </div>
      <div v-for="song in playlist.songs" :key="song.id" class="single-song" @click="getTrackId(song.id)">
        <div style="display: flex; width: 50%;">
          <img v-if="song.songUrl" style="margin-right: 20px; border-radius: 8px; height: 80px; width: 100px;" :src="song.songUrl">
          <div class="details">
            <h3>{{ song.title }}</h3>
            <p>{{ song.artist }}</p>
          </div>
        </div>
        <div style="display: flex; justify-content: space-around; align-items: center; width: 50%;">
          <div ref="wave" style="width: 40%; margin-right: 40px;">
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
          </div>
          <div style="width: 40%;">
            <div class="but" style="display: block;" ref="playing" @click="playThisSong(song, $event)"><i
                style="font-size: 2rem; color: black;" class="fa-regular fa-circle-play"></i></div>
            <div class="but" style="display: none;" ref="pausing" @click="pauseThisSong(song, $event)"><i
                style="font-size: 2rem; color: black;" class="fa-regular fa-circle-pause"></i></div>
          </div>
          <div style="padding-bottom: 20px; width: 20%;">
            <button v-if="ownership"
              @click="handleClick(song.id, song.filePathAudio, song.filePathSong, $event)">delete</button>
          </div>
        </div>
      </div>
      <AddSong :playlist="playlist" />
    </div>
  </div>

  <Recommend />
</template>

<script>
import Recommend from '@/components/Recommend.vue'

import AddSong from '@/components/AddSong.vue'
import useStorage from '@/composables/useStorage'
import useDocument from '@/composables/useDocument'
import getDocument from '@/composables/getDocument'
import getUser from '@/composables/getUser'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import MusicControls from '@/components/MusicControl.vue'
import { useStore } from 'vuex'
import { onMounted, watchEffect, watch, onUnmounted } from 'vue'

export default {
  props: ['id'],
  components: { AddSong, MusicControls, Recommend },
  setup(props) {
    const { error, document: playlist } = getDocument('playlists', props.id)
    const { user } = getUser()
    const { deleteDoc, updateDoc } = useDocument('playlists', props.id)
    const { deleteImage, deleteAllFiles } = useStorage()
    const router = useRouter()
    const store = useStore()

    const playing = ref(null)
    const wave = ref(null)
    const pausing = ref(null)
    const isPlaying = ref(false)

    const ownership = computed(() => {
      return playlist.value
        && user.value
        && user.value.uid == playlist.value.userId
    })
    const handleDelete = async () => {
      router.push({ name: 'Home' })

      // // Delete playlist doc
      await deleteDoc()
      await deleteImage(playlist.value.filePath)

      // // Deleting all images and audios in storage
      await deleteAllFiles(`audios/${playlist.value.id}`)
      await deleteAllFiles(`songs/${playlist.value.id}`)

      if (playlist.value.id == store.state.playlist.id) {
        // Resetting controls
        await store.dispatch('addSongs', null)
        await store.dispatch('addPlaylist', null)
      }
    }
    const handleClick = async (id, audioPath, imagePath, event) => {

      event.preventDefault(); // To not fire getTrack() function when delete is clicked

      const songs = playlist.value.songs.filter((song) => song.id != id)
      await updateDoc({ songs })
      await deleteImage(audioPath) // Delete audio from storage
      await deleteImage(imagePath) // Delete song image from storage

      await store.dispatch('addSongs', playlist.value.songs)
      await store.dispatch('addPlaylist', playlist.value)
      await store.dispatch('play', 'playlist')
    }

    // --------------------------------------------------------------------------------

    // Sending datas
    watchEffect(() => {
      if (playing.value && pausing.value && wave.value) {
        store.dispatch('addPlayButtonTag', playing.value)
        store.dispatch('addPauseButtonTag', pausing.value)
        store.dispatch('addWaveButtonTag', wave.value)
      }
      if (playlist.value) {
        store.dispatch('addEnteredPlaylistSongs', playlist.value.songs)
      }
      // To show wave when enter if song is the same
      if (playlist.value && store.state.currentSong && playlist.value.songs.length > 0) {
        if (playlist.value.songs[store.state.currentSongIndex] && store.state.currentSong) {
          if (playlist.value.songs[store.state.currentSongIndex].id == store.state.currentSong.id && store.state.isPlaying) {
            store.dispatch('showWaveAndPlayPause')
          }
        }
      }
      // For playAll button not showing when playlists are not the same
      if (store.state.playlist && playlist.value) {
        if (store.state.playlist.title == playlist.value.title && store.state.isPlaying) {
          isPlaying.value = true
        } else {
          isPlaying.value = false
        }
      }
    })

    // Play all songs from playlist

    const playThisPlaylist = async (event) => {
      event.preventDefault()
      await store.dispatch('addSongs', playlist.value.songs)
      await store.dispatch('addPlaylist', playlist.value)
      await store.dispatch('play', 'playlist')
    }
    // Pause playing song from playlist
    const pauseThisPlaylist = async (event) => {
      event.preventDefault()
      await store.dispatch('pause')
    }

    // Single Play Section
    const playThisSong = async (song, event) => {
      event.preventDefault()
      let songIndex = await playlist.value.songs.indexOf(song)
      await store.dispatch('changeCurrentSongIndex', songIndex)
      await store.dispatch('addSongs', playlist.value.songs)
      await store.dispatch('addPlaylist', playlist.value)
      await store.dispatch('play')
    }

    const pauseThisSong = (song, event) => {
      event.preventDefault()
      store.dispatch('pause')
    }

    const getTrackId = () => {

    }

    return {
      error, wave, isPlaying, playlist, pausing, playing, playThisPlaylist, pauseThisPlaylist, playThisSong, pauseThisSong, ownership, handleDelete, handleClick, getTrackId
    }
  }
}
</script>

<style scoped>
.playlist-details {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 80px;
}

img {
  width: 80px;
  height: 60px;
}

.cover {
  overflow: hidden;
  border-radius: 20px;
  position: relative;
  padding: 160px;
}

.cover img {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  min-height: 100%;
  max-width: 200%;
  max-height: 200%;
}

.playlist-info {
  text-align: center;
}

.playlist-info h2 {
  text-transform: capitalize;
  font-size: 28px;
  margin-top: 20px;
}

.playlist-info p {
  margin-bottom: 20px;
}

.username {
  color: #999;
}

.description {
  text-align: left;
}

.single-song {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed var(--secondary);
  margin-bottom: 20px;
}

.loader {
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader .stroke {
  background: rgb(119, 255, 0);
  height: 150%;
  width: 3px;
  border-radius: 50px;
  margin: 0 3px;
  animation: animate 1.4s linear infinite;
}

@keyframes animate {
  50% {
    height: 20%;
    background: #00ff51;
  }

  100% {
    background: rgb(127, 255, 221);
    height: 100%;
  }
}

.stroke:nth-child(1) {
  animation-delay: 0s;
}

.stroke:nth-child(2) {
  animation-delay: 0.3s;
}

.stroke:nth-child(3) {
  animation-delay: 0.6s;
}

.stroke:nth-child(4) {
  animation-delay: 0.9s;
}

.stroke:nth-child(5) {
  animation-delay: 0.6s;
}

.stroke:nth-child(6) {
  animation-delay: 0.3s;
}

.stroke:nth-child(7) {
  animation-delay: 0s;
}
</style>