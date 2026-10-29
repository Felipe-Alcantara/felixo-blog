import { AbsoluteFill, Composition, Img, staticFile, useCurrentFrame } from 'remotion';

const QUADROS = 49;
// O gatinho aparece da cintura para cima, atrás da borda de baixo do quadro: as
// patas do chão ficam escondidas e a levantada não vira a quinta pata.
const LARGURA = 704;
const ALTURA = 470;
const MARGEM_ESQUERDA = 24;
const ROSA = '#d14e74';
const CREME = '#f8f1eb';
const CONTORNO = 15;
// O cotovelo fica apoiado na borda; o braço gira em torno dele e a pata balança
// ao lado da cabeça, sem cobrir o olho.
const COTOVELO = { x: 485, y: 455 };
const COMPRIMENTO_DO_BRACO = 190;
const INCLINACAO = 34;
const AMPLITUDE_DO_TCHAU = 8;

const GatinhoDandoTchau: React.FC = () => {
  const quadro = useCurrentFrame();
  const fase = (quadro / (QUADROS - 1)) * Math.PI * 4;
  const giro = INCLINACAO + Math.sin(fase) * AMPLITUDE_DO_TCHAU;
  const pata = -COMPRIMENTO_DO_BRACO;

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <Img
        src={staticFile('gatinho-base-sentado.png')}
        style={{
          position: 'absolute',
          top: 0,
          left: MARGEM_ESQUERDA,
          width: 602,
          height: 640,
        }}
      />

      <svg
        aria-hidden="true"
        viewBox={`${-MARGEM_ESQUERDA} 0 ${LARGURA} ${ALTURA}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <g transform={`translate(${COTOVELO.x} ${COTOVELO.y}) rotate(${giro})`}>
          {/* Contorno do braço e da pata juntos, para não ficar risco na emenda. O
              braço desce até abaixo da borda em qualquer ângulo. */}
          <line
            x1={0}
            y1={60}
            x2={0}
            y2={pata}
            stroke={ROSA}
            strokeWidth={64 + CONTORNO * 2}
          />
          <ellipse cx={0} cy={pata} rx={44 + CONTORNO} ry={50 + CONTORNO} fill={ROSA} />
          <line x1={0} y1={60} x2={0} y2={pata} stroke={CREME} strokeWidth={64} />
          <ellipse cx={0} cy={pata} rx={44} ry={50} fill={CREME} />
          {/* Dedinhos como os das patas da arte-base. */}
          {[-17, 17].map((x) => (
            <line
              key={x}
              x1={x}
              y1={pata - 49}
              x2={x * 0.8}
              y2={pata - 28}
              stroke={ROSA}
              strokeWidth={8}
              strokeLinecap="round"
            />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const ComposicaoGatinhoTchau: React.FC = () => (
  <Composition
    id="GatinhoTchau"
    component={GatinhoDandoTchau}
    durationInFrames={QUADROS}
    fps={24}
    width={LARGURA}
    height={ALTURA}
  />
);
