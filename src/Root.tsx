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
import { sceneDuration as unaVeritatScene } from './una-veritat/data/timeline';
import { ContradictionScene } from './una-veritat/scenes/ContradictionScene';
import { DescentScene } from './una-veritat/scenes/DescentScene';
import { DistrustScene } from './una-veritat/scenes/DistrustScene';
import { GospelScene } from './una-veritat/scenes/GospelScene';
import { HandsScene } from './una-veritat/scenes/HandsScene';
import { LightScene } from './una-veritat/scenes/LightScene';
import { LogoScene as UnaVeritatLogoScene } from './una-veritat/scenes/LogoScene';
import { NameScene } from './una-veritat/scenes/NameScene';
import { NeedScene } from './una-veritat/scenes/NeedScene';
import { OpeningScene as UnaVeritatOpeningScene } from './una-veritat/scenes/OpeningScene';
import { OppressorScene } from './una-veritat/scenes/OppressorScene';
import { PhilippiansScene } from './una-veritat/scenes/PhilippiansScene';
import { ProblemScene } from './una-veritat/scenes/ProblemScene';
import { QuestionScene as UnaVeritatQuestionScene } from './una-veritat/scenes/QuestionScene';
import { RelativismScene } from './una-veritat/scenes/RelativismScene';
import { UNA_VERITAT_DURATION, UnaVeritat } from './una-veritat/UnaVeritat';

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
    <Folder name="UnaVeritat">
      <Composition
        id="UnaVeritat"
        component={UnaVeritat}
        durationInFrames={UNA_VERITAT_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Folder name="UnaVeritat-Escenes">
        <Composition id="UnaVeritat-01-Obertura" component={UnaVeritatOpeningScene} durationInFrames={unaVeritatScene('opening')} fps={30} width={1080} height={1920} />
        <Composition id="UnaVeritat-02-Opressor" component={OppressorScene} durationInFrames={unaVeritatScene('oppressor')} fps={30} width={1080} height={1920} />
        <Composition id="UnaVeritat-03-Desconfianca" component={DistrustScene} durationInFrames={unaVeritatScene('distrust')} fps={30} width={1080} height={1920} />
        <Composition id="UnaVeritat-04-Relativisme" component={RelativismScene} durationInFrames={unaVeritatScene('relativism')} fps={30} width={1080} height={1920} />
        <Composition id="UnaVeritat-05-Problema" component={ProblemScene} durationInFrames={unaVeritatScene('problem')} fps={30} width={1080} height={1920} />
        <Composition id="UnaVeritat-06-Contradiccio" component={ContradictionScene} durationInFrames={unaVeritatScene('contradiction')} fps={30} width={1080} height={1920} />
        <Composition id="UnaVeritat-07-Necessitem" component={NeedScene} durationInFrames={unaVeritatScene('need')} fps={30} width={1080} height={1920} />
        <Composition id="UnaVeritat-08-Pregunta" component={UnaVeritatQuestionScene} durationInFrames={unaVeritatScene('question')} fps={30} width={1080} height={1920} />
        <Composition id="UnaVeritat-09-Filipencs" component={PhilippiansScene} durationInFrames={unaVeritatScene('philippians')} fps={30} width={1080} height={1920} />
        <Composition id="UnaVeritat-10-Descens" component={DescentScene} durationInFrames={unaVeritatScene('descent')} fps={30} width={1080} height={1920} />
        <Composition id="UnaVeritat-11-Mans" component={HandsScene} durationInFrames={unaVeritatScene('hands')} fps={30} width={1080} height={1920} />
        <Composition id="UnaVeritat-12-Nom" component={NameScene} durationInFrames={unaVeritatScene('name')} fps={30} width={1080} height={1920} />
        <Composition id="UnaVeritat-13-Llum" component={LightScene} durationInFrames={unaVeritatScene('light')} fps={30} width={1080} height={1920} />
        <Composition id="UnaVeritat-14-Evangeli" component={GospelScene} durationInFrames={unaVeritatScene('gospel')} fps={30} width={1080} height={1920} />
        <Composition id="UnaVeritat-15-Logo" component={UnaVeritatLogoScene} durationInFrames={unaVeritatScene('logo')} fps={30} width={1080} height={1920} />
      </Folder>
    </Folder>
    </>
  );
};
