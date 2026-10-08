import { Composition, Folder } from 'remotion';
import { EsglesiaVideo } from './EsglesiaVideo';
import { FE_I_CIENCIA_DURATION, FeICiencia } from './fe-i-ciencia/FeICiencia';
import { FeICienciaPilotTetera } from './fe-i-ciencia/FeICienciaPilotTetera';
import { sceneDuration } from './fe-i-ciencia/data/timeline';
import { AnalogiesScene } from './fe-i-ciencia/scenes/AnalogiesScene';
import { ChristScene } from './fe-i-ciencia/scenes/ChristScene';
import { ColossiansScene } from './fe-i-ciencia/scenes/ColossiansScene';
import { CreationScene } from './fe-i-ciencia/scenes/CreationScene';
import { LogoScene } from './fe-i-ciencia/scenes/LogoScene';
import { NewtonScene } from './fe-i-ciencia/scenes/NewtonScene';
import { OpeningScene } from './fe-i-ciencia/scenes/OpeningScene';
import { PsalmScene } from './fe-i-ciencia/scenes/PsalmScene';
import { QuestionScene } from './fe-i-ciencia/scenes/QuestionScene';
import { TETERA_DURATION } from './fe-i-ciencia/scenes/tetera/motion';
import { TeteraScene } from './fe-i-ciencia/scenes/tetera/TeteraScene';
import { UniverseScene } from './fe-i-ciencia/scenes/UniverseScene';
import { VoicesScene } from './fe-i-ciencia/scenes/VoicesScene';

export const Root = () => {
  return (
    <>
    <Composition
      id="EsglesiaLaGarriga"
      component={EsglesiaVideo}
      durationInFrames={180}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: 'Església la Garriga',
        subtitle: 'La fe, la comunitat i la esperança',
      }}
    />
    <Folder name="FeICiencia">
      <Composition
        id="FeICiencia"
        component={FeICiencia}
        durationInFrames={FE_I_CIENCIA_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FeICienciaPilotTetera"
        component={FeICienciaPilotTetera}
        durationInFrames={TETERA_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Folder name="FeICiencia-Escenes">
        <Composition id="FeICiencia-01-Obertura" component={OpeningScene} durationInFrames={sceneDuration('opening')} fps={30} width={1080} height={1920} />
        <Composition id="FeICiencia-02-Veus" component={VoicesScene} durationInFrames={sceneDuration('voices')} fps={30} width={1080} height={1920} />
        <Composition id="FeICiencia-03-Pregunta" component={QuestionScene} durationInFrames={sceneDuration('question')} fps={30} width={1080} height={1920} />
        <Composition id="FeICiencia-Tetera" component={TeteraScene} durationInFrames={TETERA_DURATION} fps={30} width={1080} height={1920} />
        <Composition id="FeICiencia-05-Newton" component={NewtonScene} durationInFrames={sceneDuration('newton')} fps={30} width={1080} height={1920} />
        <Composition id="FeICiencia-06-Salm" component={PsalmScene} durationInFrames={sceneDuration('psalm')} fps={30} width={1080} height={1920} />
        <Composition id="FeICiencia-07-Creacio" component={CreationScene} durationInFrames={sceneDuration('creation')} fps={30} width={1080} height={1920} />
        <Composition id="FeICiencia-08-Analogies" component={AnalogiesScene} durationInFrames={sceneDuration('analogies')} fps={30} width={1080} height={1920} />
        <Composition id="FeICiencia-09-Univers" component={UniverseScene} durationInFrames={sceneDuration('universe')} fps={30} width={1080} height={1920} />
        <Composition id="FeICiencia-10-Crist" component={ChristScene} durationInFrames={sceneDuration('christ')} fps={30} width={1080} height={1920} />
        <Composition id="FeICiencia-11-Colossencs" component={ColossiansScene} durationInFrames={sceneDuration('colossians')} fps={30} width={1080} height={1920} />
        <Composition id="FeICiencia-12-Logo" component={LogoScene} durationInFrames={sceneDuration('logo')} fps={30} width={1080} height={1920} />
      </Folder>
    </Folder>
    </>
  );
};
