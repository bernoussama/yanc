setInterval(() => {
  debugger;
}, 100);

const redirectToHomeIfNetworkTabOpen = () => {
  const before = performance.getEntries().length;
  setTimeout(() => {
    const after = performance.getEntries().length;
    if (after > before) {
      performance.clearMarks();
      performance.clearMeasures();
      performance.clearResourceTimings();
      performance.clearTypes();
      window.location.href = "/";
    }
  }, 100);
};

setInterval(redirectToHomeIfNetworkTabOpen, 1000);
