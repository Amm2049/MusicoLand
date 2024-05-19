// import { ref, watchEffect, watch } from "vue";
// import { useStore } from 'vuex'
// import { mapGetters } from 'vuex'

// const useMusicControls = (playlist, audioTag) => {
//   const isPlaying = ref(false);
//   const songs = ref([]);
//   const index = ref(0);
//   let songIndex = 0;

//   // watchEffect(() => {
//   //   if (playlist) {
//   //     songs.value = playlist.songs;
//   //     let song = songs.value.filter((song) => song.id == props.songId);
//   //     songIndex = songs.value.indexOf(song[0]);
//   //     index.value = songIndex;
//   //   }
//   // });

//   songs.value = playlist;
//   songIndex = 0;
//   index.value = songIndex;
//   // Music Controls
//   const progress = ref(null);
//   // Play Button
//   const playMusic = () => {
//     isPlaying.value = true;
//     audioTag.value.play();
//   };
//   // Pause Button
//   const pauseMusic = () => {
//     isPlaying.value = false;
//     audioTag.value.pause();
//   };
//   // Next Button
//   const nextMusic = () => {
//     if (songs.value.length - 1 != songIndex) {
//       songIndex += 1;
//       index.value = songIndex;
//       isPlaying.value = false;
//       audioTag.value.addEventListener('loadeddata',()=>{
//         playMusic()
//       })
//     } else {
//       songIndex = 0;
//       index.value = songIndex;
//       isPlaying.value = false;
//       audioTag.value.addEventListener('loadeddata',()=>{
//         playMusic()
//       })
//     }
//   };
//   // Previous Button
//   const previousMusic = () => {
//     if (songIndex != 0) {
//       songIndex -= 1;
//       index.value = songIndex;
//       isPlaying.value = false;
//     } else {
//       songIndex = songs.value.length - 1;
//       index.value = songIndex;
//       isPlaying.value = false;
//     }
//   };
//   // Minutes and seconds section
//   let durationText = ref("00 : 00");
//   let currentTimeText = ref("00 : 00");
//   let duration = 0;
//   const readDuration = () => {
//     // total duration  (LoadedData)
//     duration = Math.floor(audioTag.value.duration);
//     durationText.value = createMinutesAndSeconds(duration);
//   };
//   const readCurrentTime = () => {
//     // Current time (Timeupdate)
//     // Check if music is not null before accessing its properties
//     if (audioTag.value) {
//       // Vue does not automatically remove event listeners when a component is unmounted which can lead to error of trying to access audioTag.value(null).currentTime
//       const currentTime = Math.floor(audioTag.value.currentTime);
//       currentTimeText.value = createMinutesAndSeconds(currentTime);
//     }
//   };
//   const createMinutesAndSeconds = (totalSecond) => {
//     const minutes = Math.floor(totalSecond / 60);
//     const seconds = totalSecond % 60;
//     const minutesText = minutes < 10 ? "0" + minutes.toString() : minutes;
//     const secondsText = seconds < 10 ? "0" + seconds.toString() : seconds;
//     return minutesText + " : " + secondsText;
//   };
//   // Loaded Data - Auto Play
//   // const handleLoadedData = () => {
//   //   readDuration();
//   //   const autoPlayMusic = () => {
//   //     playMusic();
//   //     isPlaying.value = true;
//   //   };
//   //   autoPlayMusic();
//   // };

//   return {
//     index,
//     songs,
//     isPlaying,
//     progress,
//     playMusic,
//     pauseMusic,
//     previousMusic,
//     nextMusic,
//     readCurrentTime,
//     readDuration,
//     durationText,
//     currentTimeText,
//   };
// };

// export default useMusicControls;
