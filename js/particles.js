async function initParticles() {
  if (typeof tsParticles === 'undefined') return;

  const goldStarsConfig = {
    particles: {
      number: { value: 60, density: { enable: true, area: 800 } },
      color: { value: ["#D4AF37", "#FFD700", "#F5E6C8"] },
      shape: { type: "circle" },
      opacity: {
        value: { min: 0.1, max: 0.7 },
        animation: { enable: true, speed: 0.8, minimumValue: 0.1, sync: false }
      },
      size: {
        value: { min: 1, max: 3 },
        animation: { enable: true, speed: 2, minimumValue: 0.5, sync: false }
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: "none",
        random: true,
        straight: false,
        outModes: "out"
      }
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "bubble" },
        resize: true
      },
      modes: {
        bubble: { distance: 100, size: 4, duration: 2, opacity: 0.8 }
      }
    },
    detectRetina: true
  };

  const fallingGoldConfig = {
    particles: {
      number: { value: 40, density: { enable: true, area: 800 } },
      color: { value: ["#D4AF37", "#FFD700", "#B8860B"] },
      shape: { type: "circle" },
      opacity: {
        value: { min: 0.2, max: 0.8 },
        animation: { enable: true, speed: 1, minimumValue: 0.1 }
      },
      size: { value: { min: 1, max: 4 } },
      move: {
        enable: true,
        speed: 1.5,
        direction: "bottom",
        random: true,
        straight: false,
        outModes: { default: "out", top: "none" }
      }
    },
    detectRetina: true
  };

  const sparkleConfig = {
    particles: {
      number: { value: 30 },
      color: { value: ["#FFD700", "#FFFFFF", "#D4AF37"] },
      shape: { type: "star" },
      opacity: {
        value: { min: 0, max: 1 },
        animation: { enable: true, speed: 2, minimumValue: 0, sync: false }
      },
      size: {
        value: { min: 1, max: 4 },
        animation: { enable: true, speed: 3, minimumValue: 0.5 }
      },
      move: {
        enable: true,
        speed: 0.8,
        direction: "none",
        random: true,
        outModes: "out"
      }
    },
    detectRetina: true
  };

  try {
    await tsParticles.load("particles-opening", fallingGoldConfig);
    await tsParticles.load("particles-title", goldStarsConfig);
    await tsParticles.load("particles-date", sparkleConfig);
    await tsParticles.load("particles-closing", goldStarsConfig);
  } catch (e) {
    // particles are decorative, continue without them
  }
}
