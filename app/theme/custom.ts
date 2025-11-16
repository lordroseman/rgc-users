
import Aura from '@primeuix/themes/aura'; 
import { definePreset } from '@primeuix/themes';
 
const customPreset = definePreset(Aura, {
  semantic: {
    colorScheme: {
      primary: {
        light: Aura.semantic?.colorScheme?.light?.primary,
      },
      surface : Aura.primitive?.slate,
    },
  },
  extend: {
    variables: {
      scrollbarWidth: '0px',
    }
  } 
});

export default customPreset;