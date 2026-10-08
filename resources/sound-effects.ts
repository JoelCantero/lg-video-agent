import vintageFlash from './sound-effects/vintage-camera-flash.mp3?inline';
import cameraWindUp from './sound-effects/disposable-camera-wind-up.mp3?inline';
import nikonShutter from './sound-effects/nikon-d5100-shutter.mp3?inline';
import analogShutter from './sound-effects/analog-camera-shutter.mp3?inline';
import shutterClick04 from './sound-effects/shutter-click-04.mp3?inline';
import shutterClick03 from './sound-effects/shutter-click-03.mp3?inline';
import shutterClick02 from './sound-effects/shutter-click-02.mp3?inline';

export const soundEffects = [
  { id: 'vintage-camera-flash', name: 'Vintage Camera Flash', description: "Flaix de pols i obturador d'una càmera antiga. Per a fotografies retro, records i transicions amb aire vintage.", src: vintageFlash, creator: 'freesound_community', tags: ['camera', 'vintage', 'flash'], sourceId: '6243' },
  { id: 'disposable-camera-wind-up', name: 'Disposable Camera Wind-Up', description: "Mecanisme de càrrega d'una càmera d'un sol ús. Per a seqüències fotogràfiques i moments de preparació abans del dispar.", src: cameraWindUp, creator: 'freesound_community', tags: ['camera', 'wind-up', 'mechanical'], sourceId: '26175' },
  { id: 'nikon-d5100-shutter', name: 'Nikon D5100 Shutter', description: "Dispar de l'obturador d'una Nikon D5100 DSLR. Per marcar una captura de fotografia o un canvi d'imatge.", src: nikonShutter, creator: 'freesound_community', tags: ['camera', 'DSLR', 'shutter'], sourceId: '44542' },
  { id: 'analog-camera-shutter', name: 'Analog Camera Shutter', description: "Obturador d'una càmera analògica. Un accent fotogràfic per a àlbums, records i muntatges d'imatges.", src: analogShutter, creator: 'freesound_community', tags: ['camera', 'analog', 'shutter'], sourceId: '96604' },
  { id: 'shutter-click-02', name: 'Shutter Click 02', description: "Clic d'obturador, variant 02. Una alternativa per accentuar l'aparició d'una fotografia o un tall visual.", src: shutterClick02, creator: 'kauasilbershlachparodes', tags: ['camera', 'click', 'shutter'], sourceId: '494026' },
  { id: 'shutter-click-03', name: 'Shutter Click 03', description: "Clic d'obturador, variant 03. Per posar un accent sonor a captures, retrats i seqüències de fotografies.", src: shutterClick03, creator: 'kauasilbershlachparodes', tags: ['camera', 'click', 'shutter'], sourceId: '494029' },
  { id: 'shutter-click-04', name: 'Shutter Click 04', description: "Clic d'obturador, variant 04. Una altra presa per alternar els sons de dispar en un muntatge fotogràfic.", src: shutterClick04, creator: 'kauasilbershlachparodes', tags: ['camera', 'click', 'shutter'], sourceId: '494030' },
];