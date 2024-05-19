import { createStore } from "vuex";

const store = createStore({
  state: {
    playlist: null,
    songs: [],
    currentSong: null,
    currentSongIndex: 0,
    preSongIndex: 0,
    isPlaying: false,
    enteredPlaylistSongs: null,

    audioTag: null,
    audioSrc: null,
    playButtonTag: null,
    pauseButtonTag: null,
    waveButtonTag: null,
  },
  actions: {
    addPlaylist: ({ state }, value) => (state.playlist = value),
    addSongs: ({ state }, value) => (state.songs = value),
    addAudioTag: ({ state }, value) => (state.audioTag = value),
    addAudioSrc: ({ state }, value) => (state.audioSrc = value),
    addPlayButtonTag: ({ state }, value) => (state.playButtonTag = value),
    addPauseButtonTag: ({ state }, value) => (state.pauseButtonTag = value),
    addWaveButtonTag: ({ state }, value) => (state.waveButtonTag = value),
    addEnteredPlaylistSongs: ({ state }, value) =>
      (state.enteredPlaylistSongs = value),
    nextCurrentSongIndex: ({ state }, value) =>
      (state.currentSongIndex += value),
    previousCurrentSongIndex: ({ state }, value) =>
      (state.currentSongIndex -= value),
    changeCurrentSongIndex: ({ state }, value) =>
      (state.currentSongIndex = value),

    showWaveAndPlayPause: ({ state }) => {
      if (
        state.playButtonTag[state.currentSongIndex] &&
        state.pauseButtonTag[state.currentSongIndex] &&
        state.waveButtonTag[state.currentSongIndex]
      ) {
        state.playButtonTag[state.currentSongIndex].style.display = "none";
        state.pauseButtonTag[state.currentSongIndex].style.display = "block";
        state.waveButtonTag[state.currentSongIndex].classList.add("loader");
      }
    },
    hideWaveAndPlayPause: ({ state }) => {
      if (
        state.playButtonTag[state.preSongIndex] &&
        state.pauseButtonTag[state.preSongIndex] &&
        state.waveButtonTag[state.preSongIndex]
      ) {
        state.playButtonTag[state.preSongIndex].style.display = "block";
        state.pauseButtonTag[state.preSongIndex].style.display = "none";
        state.waveButtonTag[state.preSongIndex].classList.remove("loader");
      }
    },

    // Play , Pause , Next , Pre

    play: ({ state, dispatch }, value) => {
      // For removing play , pause and wave
      dispatch("hideWaveAndPlayPause");
      // For playing an album from start
      if (value == "playlist") {
        if (state.currentSong != state.songs[state.currentSongIndex]) {
          state.currentSongIndex = 0;
          state.audioSrc = state.songs[state.currentSongIndex].audioUrl;
          state.currentSong = state.songs[state.currentSongIndex];
          state.preSongIndex = state.currentSongIndex;
          state.isPlaying = true;
          const checkReadyState = setInterval(() => {
            if (state.audioTag.readyState >= 2) {
              state.audioTag.play();
              clearInterval(checkReadyState); // Stop checking once the audio is ready and played
            }
          }, 100);
          // For showing wave , play and pause
          dispatch("showWaveAndPlayPause");
        } else {
          state.preSongIndex = state.currentSongIndex;
          state.audioSrc = state.songs[state.currentSongIndex].audioUrl;
          state.currentSong = state.songs[state.currentSongIndex];
          state.isPlaying = true;
          const checkReadyState = setInterval(() => {
            if (state.audioTag.readyState >= 2) {
              state.audioTag.play();
              clearInterval(checkReadyState);
            }
          }, 100);
          dispatch("showWaveAndPlayPause");
        }
      } else {
        state.preSongIndex = state.currentSongIndex;
        state.audioSrc = state.songs[state.currentSongIndex].audioUrl;
        state.currentSong = state.songs[state.currentSongIndex];
        state.isPlaying = true;
        const checkReadyState = setInterval(() => {
          if (state.audioTag.readyState >= 2) {
            state.audioTag.play();
            clearInterval(checkReadyState);
          }
        }, 100);
        dispatch("showWaveAndPlayPause");
      }
    },

    pause: ({ state, dispatch }) => {
      dispatch("hideWaveAndPlayPause");
      state.isPlaying = false;
      state.audioTag.pause();
    },

    next: ({ state, dispatch }) => {
      // Increase Index
      if (state.songs.length - 1 > state.currentSongIndex) {
        dispatch("nextCurrentSongIndex", 1);
      } else {
        dispatch("nextCurrentSongIndex", -(state.songs.length - 1));
      }
      dispatch("play", state.currentSongIndex);
    },

    previous: ({ state, dispatch }) => {
      // Decrease Index
      if (state.currentSongIndex != 0) {
        dispatch("previousCurrentSongIndex", 1);
      } else {
        dispatch("previousCurrentSongIndex", -(state.songs.length - 1));
      }
      dispatch("play", state.currentSongIndex);
    },
  },
});

export default store;
