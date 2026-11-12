async function initParticles() {
  if (typeof tsParticles === 'undefined') return;

  const sparkleConfig = {
    particles: {
      number: { value: 12, density: { enable: true, area: 1200 } },
      color: { value: ['#C5A55A', '#E8D5A3', '#F5DFD0', '#D4A0A0'] },
      shape: { type: 'circle' },
      opacity: {
        value: { min: 0.1, max: 0.35 },
        animation: { enable: true, speed: 0.3, minimumValue: 0.05, sync: false }
      },
      size: {
        value: { min: 1.5, max: 4 },
        animation: { enable: true, speed: 0.8, minimumValue: 1, sync: false }
      },
      move: {
        enable: true,
        speed: 0.3,
        direction: 'none',
        random: true,
        straight: false,
        outModes: { default: 'out' }
      }
    },
    interactivity: {
      events: {
        onHover: { enable: false },
        resize: true
      }
    },
    detectRetina: true
  };

  try {
    await tsParticles.load('particles-sparkle', sparkleConfig);
  } catch (e) {
    // particles are decorative
  }
}
