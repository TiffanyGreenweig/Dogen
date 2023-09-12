import { loadBasic } from "tsparticles-basic";
import { loadExternalTrailInteraction } from "tsparticles-interaction-external-trail";
import { ISourceOptions } from "tsparticles-engine";
import { useCallback } from "react";

/**
 * 粒子特效
 * @returns
 */

const useTrail = () => {
  const options: ISourceOptions = {
    fullScreen: {
      enable: true,
      zIndex: -1,
    },
    fpsLimit: 120,
    particles: {
      number: {
        value: 0,
      },
      color: {
        value: "#fff",
      },
      life: {
        duration: {
          value: 5,
          sync: false,
        },
        count: 1,
      },
      opacity: {
        value: { min: 0.1, max: 1 },
        animation: {
          enable: true,
          speed: 3,
        },
      },
      size: {
        value: {
          min: 1,
          max: 3,
        },
      },
      move: {
        enable: true,
        speed: 3,
        random: false,
        size: true,
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'trail',
        },
        resize: true,
      },
      modes: {
        trail: {
          delay: 0.5,
          pauseOnStop: true,
          quantity: 4,
        },
      },
    },
    background: {
      color: "#000",
    },
  }

  const particlesInit = useCallback(async (engine: any, refresh = true) => {
    await loadBasic(engine, false);
    await loadExternalTrailInteraction(engine, false);

    await engine.addPreset("firefly", options, refresh);
  }, []);

  return {
    particlesInit,
    options
  }
}

export default useTrail
