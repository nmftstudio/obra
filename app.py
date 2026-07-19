import streamlit as st
import streamlit.components.v1 as components
from PIL import Image, ImageDraw
import datetime
import hashlib
import random
import io
import requests

# ==========================================
# CONFIGURACIÓN DE LA PÁGINA Y ESTILOS CSS
# ==========================================
st.set_page_config(
    page_title="La Obra Misteriosa - NMFT Studio",
    page_icon="🎨",
    layout="centered",
    initial_sidebar_state="collapsed"
)

# Inyección de CSS Personalizado (Estética Indie / Dark Mode / Glassmorphism)
st.markdown("""
    <style>
    /* Fondo general y fuentes */
    .stApp {
        background-color: #0d0e15;
        color: #e2e8f0;
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    
    /* Contenedor principal estilo Glassmorphism */
    .main-container {
        background: rgba(22, 25, 41, 0.7);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        padding: 25px;
        margin-bottom: 20px;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    }
    
    /* Título estilizado */
    .titulo-juego {
        font-size: 2.2rem;
        font-weight: 800;
        background: linear-gradient(45deg, #ff79c6, #bd93f9, #8be9fd);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        margin-bottom: 5px;
    }
    
    .subtitulo-juego {
        font-size: 1rem;
        color: #6272a4;
        text-align: center;
        margin-bottom: 25px;
    }

    /* Ajustes para inputs y selectbox dentro del entorno oscuro */
    .stSelectbox label {
        color: #ffb86c !important;
        font-weight: 600;
    }
    
    /* Mensajes de feedback */
    .stAlert {
        border-radius: 10px !important;
        background-color: rgba(40, 42, 54, 0.8) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
    
    /* Botones personalizados */
    div.stButton > button:first-child {
        background: linear-gradient(135deg, #6272a4 0%, #44475a 100%);
        color: #f8f8f2;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 10px 20px;
        font-weight: 600;
        transition: all 0.3s ease;
        width: 100%;
    }
    
    div.stButton > button:first-child:hover {
        background: linear-gradient(135deg, #bd93f9 0%, #ff79c6 100%);
        color: #ffffff;
        border-color: transparent;
        box-shadow: 0 4px 15px rgba(189, 147, 249, 0.4);
        transform: translateY(-1px);
    }
    </style>
""", unsafe_allow_html=True)

# ==========================================
# BANCO DE DATOS DE OBRAS DE ARTE
# ==========================================
OBRAS = [
    {
        "id": 1,
        "titulo": "La Noche Estrellada",
        "autor": "Vincent van Gogh",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/600px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
        "colores_respaldo": ["#1a2a6c", "#b21f1f", "#fdbb2d"]
    },
    {
        "id": 2,
        "titulo": "El Grito",
        "autor": "Edvard Munch",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73.5_cm%2C_National_Gallery_of_Norway.jpg/450px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73.5_cm%2C_National_Gallery_of_Norway.jpg",
        "colores_respaldo": ["#e65c00", "#f9d423", "#2193b0"]
    },
    {
        "id": 3,
        "titulo": "La Mona Lisa",
        "autor": "Leonardo da Vinci",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/402px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
        "colores_respaldo": ["#3d3d29", "#261a0d", "#5c5c3d"]
    },
    {
        "id": 4,
        "titulo": "La Joven de la Perla",
        "autor": "Johannes Vermeer",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/416px-1665_Girl_with_a_Pearl_Earring.jpg",
        "colores_respaldo": ["#002147", "#cc9933", "#111111"]
    },
    {
        "id": 5,
        "titulo": "El Nacimiento de Venus",
        "autor": "Sandro Botticelli",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project.jpg/640px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project.jpg",
        "colores_respaldo": ["#e0c3fc", "#8ec5fc", "#fbc2eb"]
    },
    {
        "id": 6,
        "titulo": "La Persistencia de la Memoria",
        "autor": "Salvador Dalí",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/The_Persistence_of_Memory.jpg/600px-The_Persistence_of_Memory.jpg",
        "colores_respaldo": ["#4a3b32", "#8b7355", "#4682b4"]
    },
    {
        "id": 7,
        "titulo": "Las Meninas",
        "autor": "Diego Velázquez",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Las_Meninas%2C_by_Diego_Vel%C3%A1zquez%2C_from_Prado_in_Google_Earth.jpg/509px-Las_Meninas%2C_by_Diego_Vel%C3%A1zquez%2C_from_Prado_in_Google_Earth.jpg",
        "colores_respaldo": ["#2b1d0c", "#423119", "#1a1107"]
    },
    {
        "id": 8,
        "titulo": "El Beso",
        "autor": "Gustav Klimt",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/587px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg",
        "colores_respaldo": ["#ffd700", "#b8860b", "#8b6508"]
    },
    {
        "id": 9,
        "titulo": "Impresión, sol naciente",
        "autor": "Claude Monet",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Claude_Monet%2C_Impression%2C_soleil_levant.jpg/600px-Claude_Monet%2C_Impression%2C_soleil_levant.jpg",
        "colores_respaldo": ["#203a43", "#2c5364", "#0f2027"]
    },
    {
        "id": 10,
        "titulo": "La Gran Ola de Kanagawa",
        "autor": "Katsushika Hokusai",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/640px-Great_Wave_off_Kanagawa2.jpg",
        "colores_respaldo": ["#0f2b46", "#e1dcd6", "#1c3b5e"]
    },
    {
        "id": 11,
        "titulo": "La Libertad guiando al pueblo",
        "autor": "Eugène Delacroix",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Eug%C3%A8ne_Delacroix_-_Le_28_Juillet._La_Libert%C3%A9_guidant_le_peuple.jpg/563px-Eug%C3%A8ne_Delacroix_-_Le_28_Juillet._La_Libert%C3%A9_guidant_le_peuple.jpg",
        "colores_respaldo": ["#3e423a", "#7c6c59", "#20221f"]
    },
    {
        "id": 12,
        "titulo": "Terraza de café por la noche",
        "autor": "Vincent van Gogh",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Vincent_Van_Gogh_-_Caf%C3%A9_Terrace_at_Night_%28YMS_Extract%29.jpg/464px-Vincent_Van_Gogh_-_Caf%C3%A9_Terrace_at_Night_%28YMS_Extract%29.jpg",
        "colores_respaldo": ["#000046", "#1cb5e0", "#f7b733"]
    }
]

# ==========================================
# LOGICA DE PROCESAMIENTO DE IMÁGENES
# ==========================================
def generar_imagen_procedimental(colores, titulo):
    img = Image.new("RGB", (600, 600), color=colores[0])
    draw = ImageDraw.Draw(img)
    semilla = int(hashlib.md5(titulo.encode()).hexdigest(), 16)
    random.seed(semilla)
    for _ in range(25):
        x0 = random.randint(0, 500)
        y0 = random.randint(0, 500)
        x1 = x0 + random.randint(50, 250)
        y1 = y0 + random.randint(50, 250)
        color = random.choice(colores)
        draw.ellipse([x0, y0, x1, y1], fill=color, outline=None)
    return img

@st.cache_data(show_spinner=False)
def cargar_imagen_obra(obra_dict):
    try:
        response = requests.get(obra_dict["url"], timeout=4)
        if response.status_code == 200:
            return Image.open(io.BytesIO(response.content)).convert("RGB")
    except Exception:
        pass
    return generar_imagen_procedimental(obra_dict["colores_respaldo"], obra_dict["titulo"])

def aplicar_distorsion_mosaico(imagen, nivel_distorsion):
    if nivel_distorsion <= 0:
        return imagen

    ancho_original, alto_original = imagen.size
    factor = 0.018 + (0.28 * (1.0 - nivel_distorsion))
    
    nuevo_ancho = max(6, int(ancho_original * factor))
    nuevo_alto = max(6, int(alto_original * factor))
    
    imagen_pequena = imagen.resize((nuevo_ancho, nuevo_alto), resample=Image.BOX)
    imagen_pixelada = imagen_pequena.resize((ancho_original, alto_original), resample=Image.NEAREST)
    
    return imagen_pixelada

# ==========================================
# LÓGICA DETERMINISTA POR HORA
# ==========================================
def obtener_obra_del_periodo():
    ahora = datetime.datetime.now()
    id_temporal = ahora.strftime("%Y-%m-%d-%H")
    hash_digest = hashlib.md5(id_temporal.encode()).hexdigest()
    indice = int(hash_digest, 16) % len(OBRAS)
    return OBRAS[indice], id_temporal

def generar_12_opciones(obra_correcta):
    opcion_correcta = f"{obra_correcta['titulo']} — {obra_correcta['autor']}"
    otras_opciones = [f"{o['titulo']} — {o['autor']}" for o in OBRAS if o["id"] != obra_correcta["id"]]
    
    random.seed(obra_correcta["id"])
    opciones_incorrectas = random.sample(otras_opciones, min(11, len(otras_opciones)))
    
    todas_opciones = opciones_incorrectas + [opcion_correcta]
    todas_opciones.sort()
    return todas_opciones

# ==========================================
# EFECTO DE CELEBRACIÓN
# ==========================================
def lanzar_festejo_confetti():
    confetti_js = """
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
        var duracion = 4 * 1000;
        var fin = Date.now() + duracion;

        (function lanzarRáfaga() {
          confetti({ particleCount: 6, angle: 55, spread: 60, origin: { x: 0, y: 0.8 } });
          confetti({ particleCount: 6, angle: 125, spread: 60, origin: { x: 1, y: 0.8 } });
          if (Date.now() < fin) { requestAnimationFrame(lanzarRáfaga); }
        }());
    </script>
    """
    components.html(confetti_js, height=0, width=0)

# ==========================================
# FLUJO PRINCIPAL
# ==========================================
def main():
    obra_actual, id_hora = obtener_obra_del_periodo()
    max_intentos = 5

    if "id_hora" not in st.session_state or st.session_state.id_hora != id_hora:
        st.session_state.id_hora = id_hora
        st.session_state.intentos_realizados = 0
        st.session_state.adivinado = False
        st.session_state.juego_terminado = False
        st.session_state.historial_bloques = []
        st.session_state.opciones = generar_12_opciones(obra_actual)

    st.markdown('<div class="main-container">', unsafe_allow_html=True)
    st.markdown('<h1 class="titulo-juego">🖼️ La Obra Misteriosa</h1>', unsafe_allow_html=True)
    st.markdown('<p class="subtitulo-juego">NMFT Studio • Desafío de Reconocimiento Visual Progresivo</p>', unsafe_allow_html=True)
    
    imagen_base = cargar_imagen_obra(obra_actual)
    
    if st.session_state.adivinado:
        nivel_distorsion = 0.0
    else:
        progreso = st.session_state.intentos_realizados / max_intentos
        nivel_distorsion = max(0.15, 1.0 - progreso)

    imagen_renderizada = aplicar_distorsion_mosaico(imagen_base, nivel_distorsion)
    st.image(imagen_renderizada, use_container_width=True)
    st.markdown('</div>', unsafe_allow_html=True)

    st.markdown('<div class="main-container">', unsafe_allow_html=True)
    opcion_correcta_str = f"{obra_actual['titulo']} — {obra_actual['autor']}"

    if st.session_state.adivinado:
        st.success(f"🎉 ¡Es correcto! La obra es **{obra_actual['titulo']}** de *{obra_actual['autor']}*.")
        lanzar_festejo_confetti()
        
        st.markdown("### Comparte tu resultado")
        resumen_texto = f"La Obra Misteriosa 🎨\nIntentos: {st.session_state.intentos_realizados}/{max_intentos}\n"
        resumen_texto += "".join(st.session_state.historial_bloques) + "\n#LaObraMisteriosa #NMFTStudio"
        st.code(resumen_texto, language="text")

    elif st.session_state.juego_terminado:
        st.error(f"💥 Se agotaron los intentos. La respuesta correcta era: **{opcion_correcta_str}**")
        if st.button("Revisar composición limpia"):
            st.session_state.adivinado = True
            st.rerun()
    else:
        st.info(f"Intento **{st.session_state.intentos_realizados + 1} de {max_intentos}**. Distorsión estructural activa.")
        
        with st.form(key="formulario_adivinar"):
            seleccion = st.selectbox(
                "¿Qué obra y autor crees que representa este lienzo?",
                options=st.session_state.opciones,
                index=0
            )
            boton_enviar = st.form_submit_button(label="Enviar Respuesta ⚡")
            
            if boton_enviar:
                if seleccion == opcion_correcta_str:
                    st.session_state.adivinado = True
                    st.session_state.juego_terminado = True
                    st.session_state.intentos_realizados += 1
                    st.session_state.historial_bloques.append("🟩")
                    st.rerun()
                else:
                    st.session_state.intentos_realizados += 1
                    st.session_state.historial_bloques.append("🟥")
                    if st.session_state.intentos_realizados >= max_intentos:
                        st.session_state.juego_terminado = True
                    st.rerun()

    st.markdown('</div>', unsafe_allow_html=True)

if __name__ == "__main__":
    main()
