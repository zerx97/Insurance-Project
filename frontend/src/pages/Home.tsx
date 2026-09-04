import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import HeroIllustration from '../components/icons/HeroIllustration';
import Starfield from '../components/Starfield';
import { AutoIcon, HomeIcon, LifeIcon, HealthIcon } from '../components/icons/PolicyIcons';

// Real NASA photography (public domain, via NASA's Image & Video Library / APOD APIs) -
// stable CDN URLs, no licensing risk. Each category's thumbnail is tinted with its own
// accent color in CSS (color-mix over the photo) so the palette stays cohesive regardless
// of the source image's original hue.
const categories = [
  {
    key: 'AUTO', title: 'Auto', color: 'var(--cat-auto)', icon: <AutoIcon size={30} />,
    copy: 'Cover your vehicle in minutes — coverage amount and start date, nothing else.',
    image: 'https://images-assets.nasa.gov/image/PIA26461/PIA26461~large.jpg',
  },
  {
    key: 'HOME', title: 'Home', color: 'var(--cat-home)', icon: <HomeIcon size={30} />,
    copy: 'Protect where you live, with a premium calculated the moment you apply.',
    image: 'https://images-assets.nasa.gov/image/PIA26434/PIA26434~large.jpg',
  },
  {
    key: 'LIFE', title: 'Life', color: 'var(--cat-life)', icon: <LifeIcon size={30} />,
    copy: 'Long-term coverage, issued instantly, no paperwork mailed back and forth.',
    image: 'https://images-assets.nasa.gov/image/PIA26436/PIA26436~large.jpg',
  },
  {
    key: 'HEALTH', title: 'Health', color: 'var(--cat-health)', icon: <HealthIcon size={30} />,
    copy: 'Health coverage that files, tracks, and scores claims automatically.',
    image: 'https://images-assets.nasa.gov/image/PIA26105/PIA26105~small.jpg',
  },
];

const steps = [
  { title: 'Create your policy', body: 'Pick a type, set your coverage amount — your monthly premium is calculated instantly.' },
  { title: 'We generate your first invoice', body: 'The moment your policy is issued, billing kicks in automatically. No manual step.' },
  { title: 'File a claim in seconds', body: 'Submit a claim and our fraud-detection engine scores it in real time.' },
  { title: 'Track everything in one place', body: 'Policies, invoices, and claim status — all in your dashboard, always current.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <section className="hero-section">
        <div className="hero-bg-photo" style={{ backgroundImage: `url(https://apod.nasa.gov/apod/image/2609/noirlab2621a_1024.jpg)` }} />
        <div className="hero-bg-scrim" />
        <Starfield density={70} />

        <div className="hero-grid">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <div className="hero-eyebrow">INSURENEXT · CLAIMS, BILLING & POLICIES</div>
            <h1 className="hero-title">
              Insurance that moves <em>as fast as you do</em>
            </h1>
            <p className="hero-sub">
              Issue a policy, get billed automatically, and file a claim that scores itself for
              fraud risk in real time — built on the same event-driven backbone real insurers run on.
            </p>
            {!user && (
              <div className="hero-actions">
                <Link to="/register" className="btn btn-brass">Create an account</Link>
                <Link to="/login" className="btn btn-outline">Sign in</Link>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <HeroIllustration />
          </motion.div>
        </div>
      </section>

      <div className="category-strip">
        {categories.map((c, i) => (
          <motion.div
            key={c.key}
            className="category-card"
            style={{ '--cat-color': c.color } as CSSProperties}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            whileHover={{ y: -5 }}
          >
            <div className="category-media" style={{ backgroundImage: `url(${c.image})` }}>
              <div className="icon-badge">{c.icon}</div>
            </div>
            <div className="category-body">
              <h3 style={{ marginTop: '0.4rem' }}>{c.title}</h3>
              <p>{c.copy}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="steps-section">
        <h2>How it actually works</h2>
        {steps.map((s, i) => (
          <motion.div
            className="step-row"
            key={s.title}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <div className="step-number">{i + 1}</div>
            <div>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
