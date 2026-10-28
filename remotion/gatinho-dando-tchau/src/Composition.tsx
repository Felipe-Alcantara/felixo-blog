import { AbsoluteFill, Composition, Img, staticFile, useCurrentFrame } from 'remotion';

const QUADROS = 49;
const AMPLITUDE_DA_PATA = 20;

const GatinhoDandoTchau: React.FC = () => {
  const quadro = useCurrentFrame();
  const fase = (quadro / (QUADROS - 1)) * Math.PI * 4;
  const giro = Math.sin(fase) * AMPLITUDE_DA_PATA;

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <Img
        src={staticFile('gatinho-base-sentado.png')}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />

      <svg
        aria-hidden="true"
        viewBox="0 0 602 640"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <path
          d="M 418 466 C 451 442, 481 405, 512 357"
          fill="none"
          stroke="#d3426c"
          strokeLinecap="round"
          strokeWidth="66"
        />
        <path
          d="M 418 466 C 451 442, 481 405, 512 357"
          fill="none"
          stroke="#fff8f0"
          strokeLinecap="round"
          strokeWidth="50"
        />

        <g transform={`rotate(${giro} 512 357)`}>
          <path
            d="M 506 365 C 493 361, 485 352, 488 339 L 493 315 C 495 303, 509 303, 512 315 L 515 289 C 517 276, 532 278, 534 291 L 532 310 L 540 286 C 544 275, 558 281, 555 294 L 548 317 L 559 307 C 569 300, 579 311, 573 322 L 562 347 C 556 360, 543 367, 529 367 Z"
            fill="#fff8f0"
            stroke="#d3426c"
            strokeLinejoin="round"
            strokeWidth="9"
          />
          <circle cx="502" cy="323" r="4.5" fill="#d3426c" />
          <circle cx="525" cy="300" r="4.5" fill="#d3426c" />
          <circle cx="546" cy="298" r="4.5" fill="#d3426c" />
          <circle cx="563" cy="318" r="4.5" fill="#d3426c" />
          <path
            d="M 516 342 C 510 335, 515 327, 522 331 C 527 325, 536 330, 533 337 C 531 343, 524 348, 524 348 Z"
            fill="#d3426c"
          />
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
    width={602}
    height={640}
  />
);
