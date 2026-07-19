"""
Obra del Día — Streamlit
100% Python. Un cuadro nuevo cada día, seis intentos, revelado progresivo.
Deploy: Streamlit Community Cloud → github.com/nmftstudio/obra
"""

import hashlib
import unicodedata
import re
from datetime import date
from io import BytesIO

import requests
import streamlit as st
from PIL import Image, ImageFilter, ImageDraw

# ──────────────────────────────────────────────
# DATASET — 18 obras de dominio público (Wikimedia Commons)
# ──────────────────────────────────────────────
PAINTINGS = [
    {
        "id": "mona-lisa",
        "title": "La Mona Lisa",
        "artist": "Leonardo da Vinci",
        "year": "c. 1503–1517",
        "museum": "Museo del Louvre, París",
        "file": "Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg",
        "aliases": ["mona lisa", "la gioconda", "gioconda", "monna lisa"],
        "artist_aliases": ["leonardo", "da vinci", "leonardo da vinci"],
        "fun_fact": "Fue robada del Louvre en 1911 por un empleado del museo, lo que la catapultó a la fama mundial.",
    },
    {
        "id": "starry-night",
        "title": "La Noche Estrellada",
        "artist": "Vincent van Gogh",
        "year": "1889",
        "museum": "MoMA, Nueva York",
        "file": "Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
        "aliases": ["la noche estrellada", "noche estrellada", "starry night"],
        "artist_aliases": ["van gogh", "vincent van gogh", "vincent"],
        "fun_fact": "Van Gogh la pintó desde la ventana de su cuarto en un sanatorio psiquiátrico.",
    },
    {
        "id": "the-scream",
        "title": "El Grito",
        "artist": "Edvard Munch",
        "year": "1893",
        "museum": "Galería Nacional de Noruega, Oslo",
        "file": "Edvard_Munch,_1893,_The_Scream,_oil,_tempera_and_pastel_on_cardboard,_91_x_73_cm,_National_Gallery_of_Norway.jpg",
        "aliases": ["el grito", "the scream", "grito"],
        "artist_aliases": ["munch", "edvard munch"],
        "fun_fact": "Munch la pintó tras sentir 'un grito infinito atravesando la naturaleza' durante un atardecer.",
    },
    {
        "id": "pearl-earring",
        "title": "La Joven de la Perla",
        "artist": "Johannes Vermeer",
        "year": "c. 1665",
        "museum": "Mauritshuis, La Haya",
        "file": "1665_Girl_with_a_Pearl_Earring.jpg",
        "aliases": ["la joven de la perla", "joven de la perla", "girl with a pearl earring", "la chica de la perla"],
        "artist_aliases": ["vermeer", "johannes vermeer"],
        "fun_fact": "No es un retrato real sino un 'tronie', un estudio de expresión típico del barroco holandés.",
    },
    {
        "id": "great-wave",
        "title": "La Gran Ola de Kanagawa",
        "artist": "Katsushika Hokusai",
        "year": "c. 1831",
        "museum": "Varios museos (xilografía)",
        "file": "The_Great_Wave_off_Kanagawa.jpg",
        "aliases": ["la gran ola", "la gran ola de kanagawa", "great wave", "the great wave"],
        "artist_aliases": ["hokusai", "katsushika hokusai"],
        "fun_fact": "Es un grabado en madera, no una pintura única: se imprimieron miles de copias en su época.",
    },
    {
        "id": "american-gothic",
        "title": "Gótico Americano",
        "artist": "Grant Wood",
        "year": "1930",
        "museum": "Art Institute of Chicago",
        "file": "Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg",
        "aliases": ["gotico americano", "gótico americano", "american gothic"],
        "artist_aliases": ["grant wood"],
        "fun_fact": "Los modelos fueron la hermana del pintor y su dentista, no una pareja de granjeros real.",
    },
    {
        "id": "impression-sunrise",
        "title": "Impresión, Sol Naciente",
        "artist": "Claude Monet",
        "year": "1872",
        "museum": "Museo Marmottan Monet, París",
        "file": "Monet_-_Impression,_Sunrise.jpg",
        "aliases": ["impresion sol naciente", "impresión sol naciente", "impression sunrise"],
        "artist_aliases": ["monet", "claude monet"],
        "fun_fact": "Le dio nombre a todo el movimiento Impresionista, usado al principio como burla por la crítica.",
    },
    {
        "id": "birth-of-venus",
        "title": "El Nacimiento de Venus",
        "artist": "Sandro Botticelli",
        "year": "c. 1485",
        "museum": "Galería Uffizi, Florencia",
        "file": "Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg",
        "aliases": ["el nacimiento de venus", "nacimiento de venus", "birth of venus"],
        "artist_aliases": ["botticelli", "sandro botticelli"],
        "fun_fact": "Está pintada sobre tela en vez de madera, algo inusual para su escala en el siglo XV.",
    },
    {
        "id": "las-meninas",
        "title": "Las Meninas",
        "artist": "Diego Velázquez",
        "year": "1656",
        "museum": "Museo del Prado, Madrid",
        "file": "Las_Meninas,_by_Diego_Vel%C3%A1zquez,_from_Prado_in_Google_Earth.jpg",
        "aliases": ["las meninas"],
        "artist_aliases": ["velazquez", "velázquez", "diego velazquez"],
        "fun_fact": "El propio Velázquez se autorretrató en la escena, pincel en mano, mirando al espectador.",
    },
    {
        "id": "night-watch",
        "title": "La Ronda de Noche",
        "artist": "Rembrandt van Rijn",
        "year": "1642",
        "museum": "Rijksmuseum, Ámsterdam",
        "file": "The_Night_Watch_-_HD.jpg",
        "aliases": ["la ronda de noche", "ronda de noche", "the night watch", "ronda nocturna"],
        "artist_aliases": ["rembrandt"],
        "fun_fact": "Pese al nombre, no transcurre de noche: siglos de barniz oscurecido le dieron esa apariencia.",
    },
    {
        "id": "the-kiss",
        "title": "El Beso",
        "artist": "Gustav Klimt",
        "year": "1908",
        "museum": "Belvedere, Viena",
        "file": "Gustav_Klimt_016.jpg",
        "aliases": ["el beso", "the kiss"],
        "artist_aliases": ["klimt", "gustav klimt"],
        "fun_fact": "Usó pan de oro real, una técnica heredada del trabajo de orfebre de su padre.",
    },
    {
        "id": "liberty-leading",
        "title": "La Libertad Guiando al Pueblo",
        "artist": "Eugène Delacroix",
        "year": "1830",
        "museum": "Museo del Louvre, París",
        "file": "Eug%C3%A8ne_Delacroix_-_La_libert%C3%A9_guidant_le_peuple.jpg",
        "aliases": ["la libertad guiando al pueblo", "libertad guiando al pueblo", "liberty leading the people"],
        "artist_aliases": ["delacroix", "eugene delacroix"],
        "fun_fact": "Conmemora la Revolución de Julio de 1830, no la Revolución Francesa de 1789 como muchos creen.",
    },
    {
        "id": "garden-earthly-delights",
        "title": "El Jardín de las Delicias",
        "artist": "El Bosco",
        "year": "c. 1500",
        "museum": "Museo del Prado, Madrid",
        "file": "The_Garden_of_earthly_delights.jpg",
        "aliases": ["el jardin de las delicias", "jardin de las delicias", "garden of earthly delights"],
        "artist_aliases": ["el bosco", "hieronymus bosch", "bosco", "bosch"],
        "fun_fact": "Es un tríptico: al cerrar sus puertas se revela otra pintura del mundo antes de la creación de Eva.",
    },
    {
        "id": "wanderer-fog",
        "title": "El Caminante sobre el Mar de Nubes",
        "artist": "Caspar David Friedrich",
        "year": "c. 1818",
        "museum": "Kunsthalle de Hamburgo",
        "file": "Caspar_David_Friedrich_-_Wanderer_above_the_Sea_of_Fog.jpeg",
        "aliases": ["el caminante sobre el mar de nubes", "caminante sobre el mar de nubes", "wanderer above the sea of fog"],
        "artist_aliases": ["caspar david friedrich", "friedrich"],
        "fun_fact": "Se convirtió en el ícono visual del Romanticismo alemán.",
    },
    {
        "id": "third-of-may",
        "title": "El Tres de Mayo de 1808",
        "artist": "Francisco de Goya",
        "year": "1814",
        "museum": "Museo del Prado, Madrid",
        "file": "El_Tres_de_Mayo,_by_Francisco_de_Goya,_from_Prado_in_Google_Earth.jpg",
        "aliases": ["el tres de mayo", "tres de mayo", "el tres de mayo de 1808", "third of may"],
        "artist_aliases": ["goya", "francisco de goya"],
        "fun_fact": "Una de las primeras obras que retrata la guerra moderna sin idealizar a los vencedores.",
    },
    {
        "id": "composition-viii",
        "title": "Composición VIII",
        "artist": "Vasili Kandinsky",
        "year": "1923",
        "museum": "Museo Guggenheim, Nueva York",
        "file": "Vassily_Kandinsky,_1923_-_Composition_8,_Guggenheim_Museum.jpg",
        "aliases": ["composicion viii", "composición viii", "composition 8", "composition viii"],
        "artist_aliases": ["kandinsky", "vasili kandinsky", "wassily kandinsky"],
        "fun_fact": "Kandinsky sostenía que ciertos colores y formas producían sonidos: sinestesia.",
    },
    {
        "id": "grande-jatte",
        "title": "Una Tarde de Domingo en la Grande Jatte",
        "artist": "Georges Seurat",
        "year": "1884–1886",
        "museum": "Art Institute of Chicago",
        "file": "A_Sunday_on_La_Grande_Jatte,_Georges_Seurat,_1884.jpg",
        "aliases": ["la grande jatte", "domingo en la grande jatte", "grande jatte"],
        "artist_aliases": ["seurat", "georges seurat"],
        "fun_fact": "Pintada con puntillismo: miles de puntitos de color puro que el ojo mezcla a distancia.",
    },
]

MAX_ATTEMPTS = 6

# Niveles de desenfoque (radio de blur) por intento — decrece hasta 0
BLUR_LEVELS = [28, 20, 13, 7, 3, 0]

# Porcentaje del cuadro visible por intento (ventana central que se revela)
CROP_SIZES = [0.18, 0.30, 0.46, 0.64, 0.82, 1.0]


# ──────────────────────────────────────────────
# LÓGICA
# ──────────────────────────────────────────────

def painting_of_the_day() -> dict:
    seed = date.today().isoformat()
    digest = hashlib.sha256(seed.encode()).hexdigest()
    return PAINTINGS[int(digest, 16) % len(PAINTINGS)]


def normalize(text: str) -> str:
    text = text.strip().lower()
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = re.sub(r"[^a-z0-9\s]", "", text)
    return re.sub(r"\s+", " ", text).strip()


def check_guess(painting: dict, guess: str) -> str:
    """Retorna 'correct', 'close' o 'miss'."""
    g = normalize(guess)
    if not g:
        return "empty"
    if g == normalize(painting["title"]) or g in [normalize(a) for a in painting["aliases"]]:
        return "correct"
    if g in [normalize(a) for a in painting["artist_aliases"]]:
        return "correct"
    # "cerca": comparte al menos una palabra larga con el título
    gw = set(w for w in g.split() if len(w) > 3)
    tw = set(w for w in normalize(painting["title"]).split() if len(w) > 3)
    if gw & tw:
        return "close"
    return "miss"


@st.cache_data(show_spinner=False)
def load_image(filename: str) -> Image.Image | None:
    url = f"https://commons.wikimedia.org/wiki/Special:FilePath/{filename}?width=900"
    try:
        r = requests.get(url, timeout=15, headers={"User-Agent": "ObraDelDia/1.0"})
        r.raise_for_status()
        img = Image.open(BytesIO(r.content)).convert("RGB")
        # cuadrar con crop centrado
        w, h = img.size
        side = min(w, h)
        left = (w - side) // 2
        top = (h - side) // 2
        return img.crop((left, top, left + side, top + side)).resize((600, 600))
    except Exception:
        return None


def apply_reveal(img: Image.Image, attempt: int) -> Image.Image:
    """Blur + ventana circular que se agranda con cada intento."""
    step = min(attempt, len(BLUR_LEVELS) - 1)
    blur_r = BLUR_LEVELS[step]
    crop_pct = CROP_SIZES[step]

    w, h = img.size  # 600×600

    if blur_r > 0:
        blurred = img.filter(ImageFilter.GaussianBlur(radius=blur_r))
    else:
        blurred = img.copy()

    if crop_pct >= 1.0:
        return blurred

    # máscara circular que crece
    radius = int((w / 2) * crop_pct)
    cx, cy = w // 2, h // 2

    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse(
        (cx - radius, cy - radius, cx + radius, cy + radius),
        fill=255,
    )
    # difuminar el borde de la máscara
    mask = mask.filter(ImageFilter.GaussianBlur(radius=max(radius // 5, 4)))

    dark = Image.new("RGB", (w, h), (18, 14, 18))
    result = Image.composite(blurred, dark, mask)
    return result


# ──────────────────────────────────────────────
# CSS PERSONALIZADO
# ──────────────────────────────────────────────

CSS = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,500&family=Inter:wght@400;500;700&display=swap');

html, body, [data-testid="stAppViewContainer"] {
    background: #141014 !important;
}
[data-testid="stAppViewContainer"] > .main {
    background: #141014;
}
[data-testid="stHeader"] { background: transparent !important; }
[data-testid="stSidebar"] { display: none; }

/* ── tipografía ── */
h1 {
    font-family: 'Cormorant Garamond', Georgia, serif !important;
    font-size: 2rem !important;
    color: #f2ece2 !important;
    margin-bottom: 0 !important;
    letter-spacing: 0.02em;
}
p, label, .stMarkdown, .stText {
    font-family: 'Inter', sans-serif !important;
    color: #a99da2 !important;
}

/* ── input ── */
input[type="text"] {
    background: #1c161b !important;
    border: 1px solid #3a2f36 !important;
    border-radius: 6px !important;
    color: #f2ece2 !important;
    font-family: 'Inter', sans-serif !important;
}
input[type="text"]:focus {
    border-color: #8a7326 !important;
    box-shadow: 0 0 0 2px rgba(201,162,39,0.15) !important;
}

/* ── botón principal ── */
[data-testid="baseButton-primary"] > button,
.stButton > button[kind="primary"] {
    background: #c9a227 !important;
    color: #1c1408 !important;
    border: none !important;
    font-weight: 700 !important;
    border-radius: 6px !important;
}
.stButton > button {
    background: #1c161b !important;
    color: #c9a227 !important;
    border: 1px solid #8a7326 !important;
    border-radius: 6px !important;
    font-family: 'Inter', sans-serif !important;
}

/* ── imagen / frame ── */
[data-testid="stImage"] img {
    border-radius: 4px;
    box-shadow:
        0 0 0 10px #1e1519,
        0 0 0 12px #3a2f22,
        0 30px 60px -10px rgba(0,0,0,0.8) !important;
    display: block;
    margin: 0 auto;
}

/* ── intentos dots ── */
.dot-row { display: flex; gap: 8px; justify-content: center; margin: 12px 0; }
.dot {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700;
    font-family: 'Inter', sans-serif;
}
.dot-pending { background:#1c161b; border:1px dashed #3a2f36; color:#6b6069; }
.dot-miss    { background:#1c161b; border:1px solid #7a2e3a; color:#a83f4f; }
.dot-close   { background:#1c161b; border:1px solid #8a7326; color:#c9a227; }
.dot-hit     { background:#7fae6d; border:1px solid #7fae6d; color:#10240c; }

/* ── feedback ── */
.feedback-miss  { color:#a83f4f; font-weight:600; text-align:center; }
.feedback-close { color:#c9a227; font-weight:600; text-align:center; }
.feedback-hit   { color:#7fae6d; font-weight:600; text-align:center; }

/* ── result card ── */
.result-card {
    background: #1c161b;
    border: 1px solid #3a2f36;
    border-radius: 8px;
    padding: 20px 22px;
    margin-top: 16px;
}
.result-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.6rem;
    color: #f4e6c1;
    margin: 0 0 4px;
}
.result-meta { color: #8a7326 !important; font-size: 0.8rem !important; margin: 0 0 10px; }
.result-fact { color: #a99da2 !important; font-size: 0.9rem !important; line-height: 1.5; }

/* ── eyebrow ── */
.eyebrow {
    font-family: 'Inter', sans-serif;
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #6b6069;
    text-align: center;
    margin-bottom: 4px;
}
.plaque {
    font-family: 'Inter', sans-serif;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    color: #8a7326;
    text-align: center;
    margin-top: 8px;
}

/* ── footer ── */
.footer {
    text-align: center;
    font-size: 0.75rem;
    color: #3a2f36;
    margin-top: 32px;
    font-family: 'Inter', sans-serif;
}
.footer a { color: #8a7326; text-decoration: none; }
</style>
"""

# ──────────────────────────────────────────────
# SESSION STATE
# ──────────────────────────────────────────────

def init_state():
    painting = painting_of_the_day()
    today = date.today().isoformat()

    if "date" not in st.session_state or st.session_state.date != today:
        st.session_state.date = today
        st.session_state.painting = painting
        st.session_state.attempts = []   # lista de dicts: {guess, result}
        st.session_state.finished = False
        st.session_state.won = False

# ──────────────────────────────────────────────
# APP
# ──────────────────────────────────────────────

def main():
    st.set_page_config(
        page_title="Obra del Día",
        page_icon="◆",
        layout="centered",
    )
    st.markdown(CSS, unsafe_allow_html=True)
    init_state()

    painting = st.session_state.painting
    attempts = st.session_state.attempts
    attempt_count = len(attempts)

    # ── header ──
    st.markdown('<p class="eyebrow">◆ Obra del Día</p>', unsafe_allow_html=True)
    st.title("¿Qué obra es esta?")

    d = date.today()
    fecha = d.strftime("%-d de %B de %Y").lower()
    # capitalizar primer letra
    fecha = fecha[0].upper() + fecha[1:]
    st.markdown(f'<p class="eyebrow">{fecha}</p>', unsafe_allow_html=True)

    # ── imagen ──
    img = load_image(painting["file"])

    col1, col2, col3 = st.columns([1, 3, 1])
    with col2:
        if img:
            revealed = apply_reveal(img, attempt_count)
            st.image(revealed, use_container_width=True)
            if st.session_state.finished:
                st.markdown(
                    f'<p class="plaque">{painting["title"]} · {painting["artist"]}</p>',
                    unsafe_allow_html=True,
                )
            else:
                remaining = MAX_ATTEMPTS - attempt_count
                st.markdown(
                    f'<p class="plaque">{remaining} intento{"s" if remaining != 1 else ""} restante{"s" if remaining != 1 else ""}</p>',
                    unsafe_allow_html=True,
                )
        else:
            st.warning("No se pudo cargar la imagen. Intentá recargar la página.")

    st.markdown("<br>", unsafe_allow_html=True)

    # ── dots de intentos ──
    dots_html = '<div class="dot-row">'
    for i in range(MAX_ATTEMPTS):
        if i < len(attempts):
            r = attempts[i]["result"]
            cls = f"dot dot-{r}"
            symbol = "✓" if r == "correct" else ("~" if r == "close" else "✕")
        else:
            cls = "dot dot-pending"
            symbol = str(i + 1)
        dots_html += f'<div class="{cls}">{symbol}</div>'
    dots_html += "</div>"
    st.markdown(dots_html, unsafe_allow_html=True)

    # ── último feedback ──
    if attempts:
        last = attempts[-1]
        r = last["result"]
        if r == "correct":
            msg = f"¡Exacto! Es «{painting['title']}»"
            cls = "hit"
        elif r == "close":
            msg = f"Cerca… pero no es «{last['guess']}»"
            cls = "close"
        else:
            msg = f"No es «{last['guess']}», seguí intentando"
            cls = "miss"
        st.markdown(f'<p class="feedback-{cls}">{msg}</p>', unsafe_allow_html=True)

    # ── formulario de intento ──
    if not st.session_state.finished:
        with st.form("guess_form", clear_on_submit=True):
            guess = st.text_input(
                "Tu respuesta",
                placeholder="Título de la obra o nombre del artista…",
                label_visibility="collapsed",
            )
            submitted = st.form_submit_button("Adivinar", type="primary", use_container_width=True)

        if submitted:
            if not guess.strip():
                st.warning("Escribí algo antes de adivinar.")
            else:
                result = check_guess(painting, guess)
                st.session_state.attempts.append({"guess": guess.strip(), "result": result})

                if result == "correct":
                    st.session_state.finished = True
                    st.session_state.won = True
                elif len(st.session_state.attempts) >= MAX_ATTEMPTS:
                    st.session_state.finished = True
                    st.session_state.won = False

                st.rerun()

    # ── resultado final ──
    if st.session_state.finished:
        won = st.session_state.won
        emoji_row = ""
        for a in attempts:
            r = a["result"]
            emoji_row += "🟩" if r == "correct" else ("🟨" if r == "close" else "🟥")
        emoji_row += "⬛" * (MAX_ATTEMPTS - len(attempts))

        st.markdown(
            f"""
            <div class="result-card">
                <p class="result-title">{'¡La identificaste! 🎨' if won else 'Esta vez no salió'}</p>
                <p class="result-meta">{painting['artist']} · {painting['year']} · {painting['museum']}</p>
                <p class="result-fact">{painting['fun_fact']}</p>
            </div>
            """,
            unsafe_allow_html=True,
        )

        share_text = f"Obra del Día — {date.today().isoformat()}\n{emoji_row}\nnmft.ar"
        st.code(share_text, language=None)
        st.caption("Copiá el texto de arriba para compartir tu resultado.")

    # ── footer ──
    st.markdown(
        '<div class="footer">Un juego de <a href="https://nmft.ar" target="_blank">NMFT STUDIO</a></div>',
        unsafe_allow_html=True,
    )


if __name__ == "__main__":
    main()
