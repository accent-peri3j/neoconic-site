import { motion, useReducedMotion } from 'motion/react';
import { CuracaoArrow } from './CuracaoArrow';
import { CURACAO_HEADLINE, CURACAO_HEADLINE_EXTENSION } from '../data/curacao';
import './curacao-hero.css';

/** The regional hero is isolated from the original global homepage. */
export function CuracaoHero() {
  const reducedMotion = useReducedMotion();
  const words = CURACAO_HEADLINE.split('.').map(word => word.trim()).filter(Boolean);

  // One cadence, with overlapping ease-out tails between word and dot.
  const beat = .24;
  const entranceStart = .12;
  const ease = [.22, 1, .36, 1] as const;

  return (
    <section className="cw-hero" aria-labelledby="cw-headline">
      <div className="cw-hero-inner">
        <h1 id="cw-headline" className="cw-headline" aria-label={CURACAO_HEADLINE}>
          {words.map((word, index) => (
            <span className="cw-word" key={word} aria-hidden="true">
              <motion.span
                className="cw-word-text"
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reducedMotion
                  ? { duration: 0 }
                  : { duration: .68, delay: entranceStart + index * 2 * beat, ease }}
              >{word}</motion.span><motion.span
                className="cw-period"
                initial={reducedMotion ? false : { opacity: 0, scale: .45 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={reducedMotion
                  ? { duration: 0 }
                  : { duration: .52, delay: entranceStart + (index * 2 + 1) * beat, ease }}
              >.</motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          className="cw-hero-support"
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reducedMotion
            ? { duration: 0 }
            : { duration: .68, delay: entranceStart + words.length * 2 * beat, ease }}
        >
          <p className="cw-subline">{CURACAO_HEADLINE_EXTENSION}</p>
          <a href="#selected-work" className="cw-work-link cw-arrow-control">
            <span>See the work</span>
            <CuracaoArrow />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
