import { projectStorage } from "../firebase/config";
import { ref } from "vue";
import getUser from "./getUser";

const { user } = getUser();

const useStorage = () => {
  const error = ref(null);
  const url = ref(null);
  const filePath = ref(null);
  const filePathSong = ref(null);
  const filePathAudio = ref(null);
  const urlSong = ref(null);
  const urlAudio = ref(null);

  const uploadImage = async (file) => {
    filePath.value = `covers/${user.value.uid}/${file.name}`;
    const storageRef = projectStorage.ref(filePath.value);

    try {
      const res = await storageRef.put(file);
      url.value = await res.ref.getDownloadURL();
    } catch (err) {
      console.log(err.message);
      console.log(err.code);
      error.value = err;
    }
  };

  const uploadSongImage = async (file, id) => {
    if (file) {
      filePathSong.value = `songs/${id}/${file.name}`;
      const storageRef = projectStorage.ref(filePathSong.value);

      try {
        const res = await storageRef.put(file);
        urlSong.value = await res.ref.getDownloadURL();
      } catch (err) {
        console.log(err.message);
        error.value = err;
      }
    }
  };

  const uploadSong = async (file, id) => {
    filePathAudio.value = `audios/${id}/${file.name}`;
    const storageRef = projectStorage.ref(filePathAudio.value);

    try {
      const res = await storageRef.put(file);
      urlAudio.value = await res.ref.getDownloadURL();
    } catch (err) {
      console.log(err.message);
      error.value = err;
    }
  };

  const deleteImage = async (path) => {

    const storageRef = projectStorage.ref(path);

    // Check file exists ? Then Delete
    if (storageRef.fullPath) {
      try {
        await storageRef.delete();
      } catch (err) {
        console.log(err.message);
        error.value = err;
      }
    } else {
      console.log('Image file does not exist in storage ...');
    }
  };

  const deleteAllFiles = async (path) => {
    const storageRef = projectStorage.ref(path);
  
    try {
      const list = await storageRef.listAll();
  
      // Delete each file in the folder
      const deletePromises = list.items.map(async (item) => {
        await item.delete();
        console.log('File deleted:', item.name);
      });
  
      // Wait for all delete operations to complete
      await Promise.all(deletePromises);
  
      console.log('All files in the folder deleted.');
    } catch (error) {
      console.error('Error deleting files in folder:', error.message);
    }
  };

  return {
    uploadImage,
    uploadSongImage,
    uploadSong,
    deleteImage,
    deleteAllFiles,
    url,
    urlSong,
    urlAudio,
    filePath,
    filePathSong,
    filePathAudio,
    error,
  };
};

export default useStorage;
