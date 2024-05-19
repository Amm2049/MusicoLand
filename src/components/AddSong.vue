<template>
  <div class="add-song">
    <button v-if="!showForm" :style="{ 'faded': showForm }" @click="showForm = true"
      style="position: absolute; top: -4rem; left: 28.2rem;">Add Songs</button>
    <form v-if="showForm" @submit.prevent="handleSubmit" style="position: absolute; top: 0; left: 20rem; width: 50%;">
      <div style="display: flex; justify-content: space-between">
        <h4>Add a New Song</h4>
        <small @click="showForm = false">Back</small>
      </div>
      <input type="text" placeholder="Song title" required v-model="title" />
      <input type="text" placeholder="Artist" required v-model="artist" />
      <p>Choose Image file : </p><input type="file" @change="handleChangeImage">
      <p class="error">{{ fileErrorImage }}</p>
      <p>Choose Audio file : </p><input type="file" @change="handleChangeAudio">
      <p class="error">{{ fileErrorAudio }}</p>
      <p class="error">{{ error }}</p>
      <button v-if="!isPending">Add</button>
      <button v-else disabled>Loading</button>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import useDocument from "../composables/useDocument";
import useStorage from '@/composables/useStorage'

export default {
  props: ["playlist"],
  setup(props) {
    const title = ref("");
    const artist = ref("");
    const fileImage = ref(null)
    const fileAudio = ref(null)
    const fileErrorImage = ref(null)
    const fileErrorAudio = ref(null)
    const isPending = ref(false)
    const showForm = ref(false);

    const { updateDoc } = useDocument("playlists", props.playlist.id);
    const { uploadImage, uploadSongImage, uploadSong, deleteImage, urlSong, urlAudio, filePathSong, filePathAudio, error } = useStorage()

    const handleSubmit = async () => {
      if (fileAudio.value && fileImage.value) {
        error.value = null
        isPending.value = true
        await uploadSongImage(fileImage.value, props.playlist.id)
        await uploadSong(fileAudio.value, props.playlist.id)
        const newSong = {
          title: title.value,
          artist: artist.value,
          songUrl: urlSong.value,
          audioUrl: urlAudio.value,
          filePathSong: filePathSong.value,
          filePathAudio: filePathAudio.value,
          id: Math.floor(Math.random() * 1000000),
        };
        title.value = "";
        artist.value = "";
        showForm.value = false
        const res = await updateDoc({
          songs: [...props.playlist.songs, newSong],
        });
        isPending.value = false;
      } else {
        error.value = 'Please insert the files.'
        isPending.value = false
      }
    };

    // Allowed File Types
    const typesOfImage = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']
    const handleChangeImage = (e) => {
      let selected = e.target.files[0]

      if (selected && typesOfImage.includes(selected.type)) {
        fileImage.value = selected
        fileErrorImage.value = null
      } else {
        fileErrorImage.value = 'Please select an image file (png, jog, jpeg or webp)'
        fileImage.value = null
      }
    }

    const typesOfAudio = ['audio/mp3', 'audio/mp4', 'audio/mpeg']
    const handleChangeAudio = (e) => {
      let selected = e.target.files[0]

      if (selected && typesOfAudio.includes(selected.type)) {
        fileAudio.value = selected
        fileErrorAudio.value = null
      } else {
        fileErrorAudio.value = 'Please select an audio file (mp3 or mp4)'
        fileAudio.value = null
      }
    }

    return { title, error, artist, showForm, fileImage, fileAudio, fileErrorImage, fileErrorAudio, isPending, handleSubmit, handleChangeAudio, handleChangeImage };
  },
};
</script>

<style scoped>
.add-song {
  text-align: center;
  margin-top: 40px;
}


form {
  max-width: 100%;
  text-align: left;
}

small {
  background-color: rgb(240, 240, 240);
  padding: 5px 10px;
  border-radius: 20px;
}

small:hover {
  background-color: black;
  color: white;
}
</style>
