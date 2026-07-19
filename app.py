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

st.markdown("""
    <style>
    .stApp {
        background-color: #0d0e15;
        color: #e2e8f0;
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    
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

    .stSelectbox label {
        color: #ffb86c !important;
        font-weight: 600;
    }
    
    .stAlert {
        border-radius: 10px !important;
        background-color: rgba(40, 42, 54, 0.8) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
    
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
# BANCO DE DATOS DE OBRAS DE ARTE (REMOTO)
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
    }
]

# ==========================================
# PROCESAMIENTO DE IMÁGENES
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
        # Cabeceras declarativas estrictas según la política oficial de la API de Wikimedia
        cabeceras = {
            'User-Agent': 'LaObraMisteriosa/1.0 (https://nmftstudio.great-site.net; contacto@nmftstudio.com)'
        }
        response = requests.get(obra_dict["url"], timeout=6, headers=cabeceras)
        
        if response.status_code == 200:
            return Image.open(io.BytesIO(response.content)).convert("RGB")
        else:
            # Reporte interno en la consola de logs del servidor de Streamlit en caso de error
            print(f"[NMFT LOG] Error HTTP {response.status_code} al solicitar ID {obra_dict['id']}")
    except Exception as e:
        print(f"[NMFT LOG] Fallo de conexión remota: {e}")
        
    # Lienzo abstracto de respaldo únicamente si la descarga web es bloqueada por completo
    return generar_imagen_procedimental(obra_dict["colores_respaldo"], obra_dict["titulo"])

def aplicar_distorsion_mosaico(imagen, nivel_distorsion):
    if nivel_distorsion <= 0:
        return imagen

    ancho_original, alto_original = imagen.size
    
    # Conservamos el umbral mínimo balanceado al 6% para mantener una resolución
    # pixelada retro legible y evitar distorsiones masivas imposibles de resolver.
    factor = 0.06 + (0.34 * (1.0 - nivel_distorsion))
    
    nuevo_ancho = max(16, int(ancho_original * factor))
    nuevo_alto = max(16, int(alto_original * factor))
    
    imagen_pequena = imagen.resize((nuevo_ancho, nuevo_alto), resample=Image.BOX)
    imagen_pixelada = imagen_pequena.resize((ancho_original, alto_original), resample=Image.NEAREST)
    
    return imagen_pixelada

# ==========================================
# LÓGICA DE JUEGO DETERMINISTA
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
    comodines = ["Guernica — Pablo Picasso", "Las Meninas — Diego Velázquez", "El Beso — Gustav Klimt", "Impresión — Claude Monet"]
    pool_incorrectas = otras_opciones + comodines
    opciones_incorrectas = random.sample(pool_incorrectas, min(11, len(pool_incorrectas)))
    
    todas_opciones = list(set(opciones_incorrectas + [opcion_correcta]))
    todas_opciones.sort()
    return todas_opciones

# ==========================================
# COMPONENTE DE FESTEJO MEJORADO
# ==========================================
def lanzar_festejo_confetti():
    # Contenedor iframe controlado con altura definida para desplegar la lluvia de partículas sin recortes
    confetti_js = """
    <div style="text-align:center; margin-top: 10px;">
        <canvas id="canvas-festejo" style="width:100%; height:200px; z-index:10; pointer-events:none;"></canvas>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
        var miCanvas = document.getElementById('canvas-festejo');
        var confetiLocal = confetti.create(miCanvas, { resize: true });
        
        var duracion = 3.5 * 1000;
        var fin = Date.now() + duracion;

        (function lanzarRáfaga() {
          confetiLocal({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 1 } });
          confetiLocal({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 1 } });
          
          if (Date.now() < fin) {
            requestAnimationFrame(lanzarRáfaga);
          }
        }());
    </script>
    """
    components.html(confetti_js, height=220, scrolling=False)
    st.balloons()

# ==========================================
# INTERFAZ PRINCIPAL
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

    # Bloque de Imagen
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

    # Bloque de Control
    st.markdown('<div class="main-container">', unsafe_allow_html=True)
    opcion_correcta_str = f"{obra_actual['titulo']} — {obra_actual['autor']}"

    if st.session_state.adivinado:
        lanzar_festejo_confetti()
        st.success(f"🎉 ¡Es correcto! La obra es **{obra_actual['titulo']}** de *{obra_actual['autor']}*.")
        
        st.markdown("### Compartte tu resultado")
        resumen_texto = f"La Obra Misteriosa 🎨\nIntentos: {st.session_state.intentos_realizados}/{max_intentos}\n"
        resumen_texto += "".join(st.session_state.historial_bloques) + "\n#LaObraMisteriosa #NMFTStudio"
        st.code(resumen_texto, language="text")

    elif st.session_state.juego_terminado:
        st.error(f"💥 Se agotaron los intentos. La respuesta correcta era: **{opcion_correcta_str}**")
        if st.button("Revisar composición limpia"):
            st.session_state.adivinado = True
            st.rerun()
    else:
        st.info(f"Intento **{st.session_state.intentos_realizados + 1} de {max_intentos}**. Distorsión balanceada.")
        
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