<template>
  <div class="hidden sm:block w-80 border-r border-gray-600">
    <div id="container">
      <div class="wave-01"></div>
      <div class="wave-02"></div>
      <div class="wave-03"></div>
      <div class="moon-container">
        <div class="moon"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#container {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(#010b7e, #0011fd, white);
  overflow: hidden;
}

.moon-container {
  position: absolute;
  top: 5%;
  right: 5%;
  transform: translate(-50%, -50%);
}

.moon {
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
  box-shadow: 1rem 1rem 0 0 #fff77e;
}

.wave-01 {
  position: absolute;
  width: 300%;
  height: 100%;
  left: -100%;
  top: 50%;
  background-color: rgba(0, 190, 255, 0.4);
  border-radius: 45%;
  animation: rotate 20s linear infinite;
}

.wave-02 {
  position: absolute;
  width: 300%;
  height: 100%;
  left: -100%;
  top: 57%;
  background-color: rgba(0, 70, 110, 0.4);
  border-radius: 43%;
  animation: rotate 14s linear infinite;
}

.wave-03 {
  position: absolute;
  width: 300%;
  height: 100%;
  left: -100%;
  top: 60%;
  background-color: rgba(0, 90, 110, 0.4);
  border-radius: 40%;
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>
