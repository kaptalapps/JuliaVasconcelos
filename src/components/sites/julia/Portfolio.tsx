"use client";

/* eslint-disable @next/next/no-img-element */

import { createContext, Fragment, useContext, useEffect, useState } from "react";
import Script from "next/script";
import "./portfolio.css";

type View =
  | "work"
  | "about"
  | "featured"
  | "boticario"
  | "berenice"
  | "cea"
  | "trackfield"
  | "villalobos"
  | "pantim";

type LightboxImage = {
  src: string;
  alt: string;
};

const cases: { id: Exclude<View, "work" | "about" | "featured">; title: string; image: string; position: string }[] = [
  { id: "boticario", title: "O Boticário", image: "/sites/julia/01-o-botic-rio.jpg", position: "center 30%" },
  { id: "berenice", title: "Quem Disse, Berenice?", image: "/sites/julia/02-quem-disse-berenice.jpg", position: "center 20%" },
  { id: "cea", title: "C&A", image: "/sites/julia/03-c-a.jpg", position: "center 35%" },
  { id: "trackfield", title: "Track&Field", image: "/sites/julia/04-track-field.jpg", position: "center 28%" },
  { id: "villalobos", title: "Shopping Villa Lobos", image: "/sites/julia/05-shopping-villa-lobos.webp", position: "center 30%" },
  { id: "pantim", title: "Deixe de Pantim", image: "/sites/julia/06-deixe-de-pantim.jpg", position: "center 38%" },
];

const ceaEmails = [
  { src: "/sites/julia/10-c-a-email-1.png", alt: "C&A email 1" },
  { src: "/sites/julia/12-c-a-email-2.gif", alt: "C&A email 2" },
  { src: "/sites/julia/14-c-a-email-3.png", alt: "C&A email 3" },
];

const trackfieldEmails = [
  { src: "/sites/julia/16-track-field-email-1.png", alt: "Track&Field email 1" },
  { src: "/sites/julia/18-track-field-email-2.png", alt: "Track&Field email 2" },
];

const gallery = Array.from({ length: 9 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return {
    src: `/sites/julia/wix/gallery-${number}.jpg`,
    alt: `Photograph ${index + 1} from Fundo de Pasto Caboclo, Juazeiro, Bahia. © Júlia Vasconcelos`,
  };
});

const navItems: { id: "work" | "featured" | "about"; label: string }[] = [
  { id: "work", label: "Work" },
  { id: "featured", label: "Featured Projects & Highlights" },
  { id: "about", label: "About" },
];

function processInstagram() {
  const instagram = (window as Window & { instgrm?: { Embeds: { process: () => void } } }).instgrm;
  instagram?.Embeds.process();
}

function EmailGrid({ items, columns }: { items: { src: string; alt: string }[]; columns: 2 | 3 }) {
  return (
    <div className={`email-grid cols-${columns}`}>
      {items.map((item) => (
        <CroppedImage key={item.src} src={item.src} alt={item.alt} />
      ))}
    </div>
  );
}

function CroppedImage({ src, alt, kind = "email" }: { src: string; alt: string; kind?: "email" | "photo" }) {
  return (
    <ImageButton src={src} alt={alt} className={kind === "photo" ? "photo-thumb" : "pair-email"} />
  );
}

function ImageButton({ src, alt, className }: { src: string; alt: string; className: string }) {
  const { openLightbox } = useLightbox();
  return (
    <button type="button" className={className} onClick={() => openLightbox({ src, alt })}>
      <img src={src} alt={alt} />
      <span className="zoom-hint">ver completo</span>
    </button>
  );
}

type LightboxContextValue = {
  openLightbox: (image: LightboxImage) => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

function useLightbox() {
  const context = useContext(LightboxContext);
  if (!context) {
    throw new Error("Lightbox controls are only available inside the portfolio.");
  }
  return context;
}

export function Portfolio() {
  const [view, setView] = useState<View>("work");
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const timer = window.setTimeout(processInstagram, 350);
    return () => window.clearTimeout(timer);
  }, [view]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  function openLightbox(image: LightboxImage) {
    setZoomed(false);
    setLightbox(image);
  }

  function closeLightbox() {
    setLightbox(null);
    setZoomed(false);
  }

  function show(next: View) {
    setView(next);
  }

  return (
    <LightboxContext.Provider value={{ openLightbox }}>
      <div className="portfolio">
        <div className={lightbox ? "lightbox open" : "lightbox"} onClick={closeLightbox}>
          <button type="button" className="lightbox-close" aria-label="Fechar" onClick={closeLightbox}>
            ×
          </button>
          <div className="lightbox-inner" onClick={(event) => event.stopPropagation()}>
            {lightbox ? (
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className={zoomed ? "zoomed" : undefined}
                onClick={() => setZoomed((current) => !current)}
              />
            ) : null}
          </div>
          <span className="lightbox-zoom-hint">clique na imagem para ampliar · clique fora para fechar</span>
        </div>

        <header>
          <div className="header-left">
            <button type="button" className="name" onClick={() => show("work")}>
              Júlia Vasconcelos
            </button>
            <span className="role">copywriter and journalist</span>
          </div>
          <nav>
            {navItems.map((item, index) => (
              <Fragment key={item.id}>
                {index > 0 ? <span className="sep">·</span> : null}
                <button
                  type="button"
                  className={view === item.id ? "nav-link active" : "nav-link"}
                  onClick={() => show(item.id)}
                >
                  {item.label}
                </button>
              </Fragment>
            ))}
          </nav>
        </header>

        <main>
          <section className={view === "work" ? "active" : undefined}>
            <p className="work-headline">
              copywriter based in pernambuco, brazil. currently working for <u>o boticário</u> and <u>quem disse, berenice?</u> at w3haus.
              <span className="star"> ✵</span>
            </p>
            <div className="work-grid">
              {cases.map((item) => (
                <button key={item.id} type="button" className="case-card" onClick={() => show(item.id)}>
                  <img src={item.image} alt={item.title} style={{ objectPosition: item.position }} />
                  <div className="case-overlay">
                    <span>{item.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className={view === "about" ? "active" : undefined}>
            <About />
          </section>

          <section className={view === "featured" ? "active" : undefined}>
            <Featured />
          </section>

          <section className={view === "boticario" ? "case-page active" : "case-page"}>
            <button type="button" className="case-back" onClick={() => show("work")}>
              ← work
            </button>
            <h1 className="case-title">O Boticário</h1>
            <div className="case-body">
              <p>
                at o boticário, i write copy for the brand&apos;s paid media campaigns, creating ads across digital channels. i&apos;ve contributed to major campaigns including beauty week, boti promo, and studio boti.
              </p>
              <p>
                i also create always-on social content for product launches and key brand moments such as carnival, and contribute to real-time marketing by turning trends and cultural conversations into opportunities for the brand.
              </p>
              <ul>
                <li>carnival influencer campaign</li>
                <li>scripts for creator-led social content</li>
              </ul>
            </div>
            <InstagramEmbed permalink="https://www.instagram.com/reel/DUt2ZQ6EWKH/?utm_source=ig_embed&utm_campaign=loading" />
            <InstagramEmbed permalink="https://www.instagram.com/reel/DUqtx1kEVmM/?utm_source=ig_embed&utm_campaign=loading" />
          </section>

          <section className={view === "berenice" ? "case-page active" : "case-page"}>
            <button type="button" className="case-back" onClick={() => show("work")}>
              ← work
            </button>
            <h1 className="case-title">Quem Disse, Berenice?</h1>
            <div className="case-body">
              <p>
                at quem disse, berenice?, i write copy for the brand&apos;s paid media campaigns, creating ads across digital channels. i&apos;ve contributed to campaigns including the christmas of 2025, the launch of the mochi blur makeup collection, the tô no glow makeup line, and other product launches.
              </p>
            </div>
            <video className="berenice-video" controls playsInline preload="metadata">
              <source src="/sites/julia/08-source.mp4" type="video/mp4" />
            </video>
          </section>

          <section className={view === "cea" ? "case-page active" : "case-page"}>
            <button type="button" className="case-back" onClick={() => show("work")}>
              ← work
            </button>
            <h1 className="case-title">C&A</h1>
            <div className="case-body">
              <p>
                in partnership with c&amp;a&apos;s marketing team, i contributed to the creative execution of the brand&apos;s crm communications, writing email marketing campaigns and push notifications, two of its most important conversion channels. i worked on campaigns for valentine&apos;s day, children&apos;s day, seasonal collection launches, and major cultural moments like rock in rio&apos;s 40th anniversary.
              </p>
            </div>
            <EmailGrid items={ceaEmails} columns={3} />
          </section>

          <section className={view === "trackfield" ? "case-page active" : "case-page"}>
            <button type="button" className="case-back" onClick={() => show("work")}>
              ← work
            </button>
            <h1 className="case-title">Track&amp;Field</h1>
            <div className="case-body">
              <p>
                at track&amp;field, i created crm communications, developed both online and offline catalogs, social media assets, and exclusive communication materials for franchisees across brazil, always ensuring consistency in the brand&apos;s tone of voice.
              </p>
              <p>i also produced content for the brand&apos;s sister businesses: tfsports, tfmall, and tfcoffee.</p>
            </div>
            <EmailGrid items={trackfieldEmails} columns={2} />
          </section>

          <section className={view === "villalobos" ? "case-page active" : "case-page"}>
            <button type="button" className="case-back" onClick={() => show("work")}>
              ← work
            </button>
            <h1 className="case-title">Shopping Villa Lobos</h1>
            <div className="case-body">
              <p>
                at shopping villa lobos, i contributed to the campaign for the sp open, an international tennis tournament sponsored by the shopping center as its title sponsor. i helped develop the campaign&apos;s content strategy and wrote copy for its social media rollout. i also created always-on content highlighting fashion, lifestyle, and retail trends while showcasing the brands and experiences that make up the shopping center&apos;s portfolio.
              </p>
            </div>
            <InstagramEmbed permalink="https://www.instagram.com/p/DNZEN_6sCdN/?utm_source=ig_embed&utm_campaign=loading" />
          </section>

          <section className={view === "pantim" ? "case-page active" : "case-page"}>
            <button type="button" className="case-back" onClick={() => show("work")}>
              ← work
            </button>
            <h1 className="case-title">Deixe de Pantim</h1>
            <div className="case-body">
              <p>
                in 2020, during the pandemic, three friends and i finally brought a long-time dream to life: launching a podcast. across three years, we explored conversations around territory, gender, and pop culture with a mix of humor and thoughtful discussion.
              </p>
              <p>the project also led us to speak at workshops and talks on podcast production across northeastern brazil, invited by sesc pernambuco.</p>
              <p>
                <button type="button" className="inline-link" onClick={() => show("featured")}>
                  to learn more about the project, click here ↗
                </button>
              </p>
              <Spotify src="https://open.spotify.com/embed/show/7juFBJ9FrBZwgbm1o95xiy?utm_source=generator" title="Deixe de Pantim on Spotify" />
            </div>
          </section>
        </main>

        <footer>tks for stopping by ☻</footer>
        <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" onLoad={processInstagram} />
      </div>
    </LightboxContext.Provider>
  );
}

function InstagramEmbed({ permalink }: { permalink: string }) {
  return (
    <div className="instagram-wrap">
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
      />
    </div>
  );
}

function Spotify({ src, title }: { src: string; title: string }) {
  return (
    <div className="spotify-wrap">
      <iframe
        src={src}
        height={232}
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title={title}
      />
    </div>
  );
}

function About() {
  return (
    <>
      <div className="about-top">
        <div>
          <img src="/sites/julia/07-j-lia-vasconcelos.jpg" alt="Júlia Vasconcelos" className="about-photo" />
        </div>
        <div className="about-bio">
          <span className="section-label">[ABOUT] ✵</span>
          <p>hey, you! ☻</p>
          <p>
            i&apos;m júlia, a creative copywriter currently working as a junior copywriter at w3, straight from my home in northeastern of brazil. it&apos;s kind of wild to think i ended up here, because 19 year old júlia was absolutely convinced she&apos;d be working at a newspaper by now. but life has interesting ways of surprising us. i found myself in this universe of writing for beauty and lifestyle brands, and here i am.
          </p>
          <p>
            i&apos;m obsessed with cats, asian and pop culture, and cooking exclusively based on tiktok videos. fun facts about me: i learned spanish by watching colombian novelas (thank you, la reina del flow!), not a big fan of cakes, and i&apos;m fully committed to expanding my portfolio of questionable reality shows.
          </p>
        </div>
        <div>
          <span className="section-label">[EXPERIENCE] ✵</span>
          <div className="exp-item">
            <span className="exp-company">W3HAUS</span>
            <span className="exp-role">copywriter jr.</span>
            <span className="exp-year">2025 — currently</span>
          </div>
          <div className="exp-item">
            <span className="exp-company">ROAD AG</span>
            <span className="exp-role">copywriter and social strategist</span>
            <span className="exp-year">2025</span>
          </div>
          <div className="exp-item">
            <span className="exp-company">POINT MEDIA</span>
            <span className="exp-role">copywriter jr.</span>
            <span className="exp-year">2024 — 2025</span>
          </div>
          <a href="https://www.linkedin.com/in/julia-vasconcelos1/" target="_blank" rel="noreferrer" className="inline-link">
            see more ↗
          </a>
        </div>
      </div>

      <div className="about-section">
        <span className="section-label">[SELECTED CLIENTS] ✵</span>
        <p className="clients-list">O Boticário · Quem Disse, Berenice? · C&amp;A · Track&amp;Field · Shopping Villa Lobos</p>
      </div>
      <div className="about-section">
        <span className="section-label">[EDUCATION]</span>
        <div className="edu-item">
          <span className="edu-inst">STATE UNIVERSITY OF BAHIA (UNEB)</span>
          <span className="edu-detail">b.a in journalism</span>
          <span className="edu-detail muted">2017 — 2023</span>
        </div>
      </div>
      <div className="about-section">
        <span className="section-label">[ADDITIONAL EDUCATION]</span>
        <div className="add-edu-grid">
          <div className="add-edu-row">
            <span className="add-edu-inst">ESCOLA CUCA</span>
            <span className="add-edu-detail">2025 · copywriting</span>
          </div>
          <div className="add-edu-row">
            <span className="add-edu-inst">CANAL FUTURA</span>
            <span className="add-edu-detail">2023 · audiovisual</span>
          </div>
          <div className="add-edu-row">
            <span className="add-edu-inst">SESC</span>
            <span className="add-edu-detail">2021 · photography</span>
          </div>
        </div>
      </div>
      <div className="about-section">
        <span className="section-label">[LANGUAGES]</span>
        <div className="lang-grid">
          <span className="lang-name">PORTUGUESE</span>
          <span className="lang-level">native</span>
          <span className="lang-name">ENGLISH</span>
          <span className="lang-level">advanced</span>
          <span className="lang-name">SPANISH</span>
          <span className="lang-level">advanced</span>
        </div>
      </div>
      <div className="about-section">
        <span className="section-label">[CONTACT]</span>
        <div className="contact-links">
          <a href="mailto:juliavasconcelos.rocha@gmail.com">juliavasconcelos.rocha@gmail.com</a>
          <a href="https://www.linkedin.com/in/julia-vasconcelos1/" target="_blank" rel="noreferrer">
            linkedin ↗
          </a>
          <a href="https://www.behance.net/juvrocha" target="_blank" rel="noreferrer">
            behance ↗
          </a>
        </div>
      </div>
    </>
  );
}

function Featured() {
  return (
    <>
      <h1 className="case-title">Featured Projects & Highlights</h1>

      <div className="case-body">
        <span className="section-label">[HIGHLIGHTS] ✵</span>
        <img src="/sites/julia/wix/futura.png" alt="Canal Futura" className="partner-logo" />
        <h2 className="subsection-title">Short films</h2>
        <p>
          In 2023, I was one of 36 students from Brazil selected for Canal Futura&apos;s two-week audiovisual training. During that program I made two short films, Iyá and Doulas em Ação, both screened on the channel&apos;s national schedule.
        </p>
        <p>On the first, I worked as screenwriter and recording assistant. On the second, as director and screenwriter.</p>
        <p className="note">*Both were screened, but they are not available online yet. There is a recording of the first film&apos;s screening.</p>
        <img src="/sites/julia/wix/short-film.jpg" alt="Still from the short film Iyá" className="feature-photo" />
      </div>

      <div className="video-pair">
        <div>
          <div className="video-frame">
            <iframe
              src="https://www.youtube.com/embed/j7o4rtaa7fM?start=49"
              title="Iyá — Canal Futura"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <p className="media-caption">Iyá — Canal Futura</p>
        </div>
        <div>
          <div className="video-frame">
            <iframe
              src="https://www.youtube.com/embed/FBJ-7sgtZTc"
              title="Doulas em Ação — Canal Futura"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <p className="media-caption">Doulas em Ação — Canal Futura</p>
        </div>
      </div>

      <hr className="case-divider" />

      <div className="case-body">
        <img src="/sites/julia/wix/distintas.png" alt="Distintas Latitudes" className="partner-logo" />
        <h2 className="subsection-title">Photo essay</h2>
        <p>
          In 2024, I was one of 4 Brazilian women selected for the{" "}
          <a className="inline-link" href="https://jovenesperiodistas.org/seleccion-8a-generacion/" target="_blank" rel="noreferrer">
            8th Generation of the LATAM Network of Young Journalists
          </a>
          , a 10-month online training program from Mexico.
        </p>
        <p>
          During that experience I published for the first time in Spanish: the photo essay “El Día Después: historias de migrantes dentro y fuera de Latinoamérica,” for which I also edited, curated, and treated the images.
        </p>
        <p>
          <a className="inline-link" href="https://distintaslatitudes.net/destacado/el-dia-despues" target="_blank" rel="noreferrer">
            read it here ↗
          </a>
        </p>
        <img
          src="/sites/julia/wix/photo-essay-web.jpg"
          alt="Portrait from the photo essay El Día Después"
          className="feature-photo"
        />
      </div>

      <hr className="case-divider" />

      <div className="case-body">
        <span className="section-label">[COLLABORATIONS] ✵</span>
        <img src="/sites/julia/wix/publica.png" alt="Agência Pública" className="partner-logo" />
        <h2 className="subsection-title">Photojournalism</h2>
        <p>
          In 2023, I contributed as a photojournalist to the report “Mining companies threaten traditional communities in the Bahian sertão,” alongside journalist Nathallia Fonseca.
        </p>
        <p>The photographs were made at Fundo de Pasto Caboclo, in the rural area of Juazeiro, Bahia.</p>
        <p>
          <a
            className="inline-link"
            href="https://apublica.org/2023/09/mineradoras-ameacam-comunidades-tradicionais-no-sertao-baiano/"
            target="_blank"
            rel="noreferrer"
          >
            read the report ↗
          </a>
        </p>
        <p>A few of them:</p>
      </div>
      <div className="photo-grid">
        {gallery.map((photo) => (
          <CroppedImage key={photo.src} src={photo.src} alt={photo.alt} kind="photo" />
        ))}
      </div>
      <p className="credit">© Júlia Vasconcelos</p>

      <hr className="case-divider" />

      <div className="case-body">
        <img src="/sites/julia/wix/cajueira.webp" alt="Cajueira" className="partner-logo" />
        <h2 className="subsection-title">Podcast production</h2>
        <p>
          With the Deixe de Pantim Podcast team, I produced and hosted Aldeia Podcast, an exclusive part of the program for the XVII Festival Aldeia do Velho Chico. It brought together the festival&apos;s filmmakers, artists, and producers to talk about the lineup of the largest arts festival in the São Francisco Valley.
        </p>
        <p>I took part in the scripting and the hosting. Listen to the first episode:</p>
        <img src="/sites/julia/wix/aldeia.jpg" alt="Aldeia Podcast playing on a tablet" className="feature-photo" />
        <img src="/sites/julia/wix/sesc.png" alt="Sesc Pernambuco" className="partner-logo" />
        <Spotify
          src="https://open.spotify.com/embed/episode/4S8KezAZuyZTGjIhobl798?utm_source=generator"
          title="Aldeia Podcast, episode 1, on Spotify"
        />
      </div>

      <hr className="case-divider" />

      <div className="case-body">
        <span className="section-label">[NETWORK OF YOUNG JOURNALISTS]</span>
        <h2 className="subsection-title">Correspondent reporter</h2>
        <p>
          I traveled more than 60 km to the community of Massaroca to visit the Professora Valdete Bispo Gama full-time municipal school, in Juazeiro, Bahia, and interview children and education professionals.
        </p>
        <p>I recorded the interviews and the ambient sound, and made the photos and videos shared on social media.</p>
        <p>Listen to the episode:</p>
        <img
          src="/sites/julia/wix/correspondent.jpg"
          alt="Interview at a school in Juazeiro, Bahia"
          className="feature-photo"
        />
        <Spotify
          src="https://open.spotify.com/embed/episode/4nKW34QYy936CQXfLTRcsE?utm_source=generator"
          title="Correspondent reporter episode on Spotify"
        />
      </div>
    </>
  );
}
