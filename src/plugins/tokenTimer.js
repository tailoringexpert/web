import { computed, onUnmounted, ref, toRef, watch } from 'vue';

export function useTokenTimer(decodedTokenSource) {
  const timeLeft = ref(0);
  let intervalId = null;

  const tokenRef = toRef(decodedTokenSource);

  const calculateTimeLeft = () => {
    if (!tokenRef.value) {
      timeLeft.value = 0;
      return;
    }

    const currentTime = Math.round(Date.now() / 1000);
    const expirationTime = tokenRef.value.exp;

    // if (!expirationTime) {
    //   timeLeft.value = 0;
    //   return;
    // }

    const remaining = expirationTime - currentTime;
    timeLeft.value = remaining; // > 0 ? remaining : 0;
  };

  const startTimer = () => {
    stopTimer();
    calculateTimeLeft();

    intervalId = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        stopTimer();
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  watch(
    tokenRef,
    (newToken) => {
      if (newToken) {
        startTimer();
      } else {
        stopTimer();
        timeLeft.value = 0;
      }
    },
    { deep: true, immediate: true }
  );

  onUnmounted(() => {
    stopTimer();
  });

  return {
    timeLeft,
    isExpired: computed(() => timeLeft.value <= 0),
    formattedTime: computed(() => {
      const minutes = Math.floor(timeLeft.value / 60);
      const seconds = timeLeft.value % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    })
  };
}
