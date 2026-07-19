# 易經 · I Ching Coin App — versión definitiva

App de consulta del I Ching por NMFT STUDIO. Fusiona lo mejor de las tres
versiones de desarrollo:

- **Shell visual y animación de monedas (de V3):** el altar, la caída física
  de las tres monedas en 3D, la formación línea por línea del hexagrama y el
  pergamino que se despliega con sello de cera al revelar el resultado.
- **Narración de los 64 hexagramas (de V1):** cada hexagrama trae esencia,
  narración poética, dictamen e imagen — no solo una línea de lectura — con
  un bloque expandible ("Ver dictamen e imagen") para no saturar la pantalla.
  El hexagrama de transformación (cuando hay líneas cambiantes) tiene la
  misma narración completa.
- **Minijuego "Acertijos del Sabio" ampliado:** de ~20 preguntas a 62
  (37 trivia + 25 acertijos de lógica/parábolas). Las opciones de cada
  trivia están calibradas en extensión y tono para que la respuesta correcta
  no se note por ser "la más larga" — y además se mezclan en cada partida,
  así la posición tampoco es una pista.

## Tirada manual, línea por línea

Cada una de las 6 líneas requiere una acción del usuario: agitar el celular
o tocar el altar. Después de cada tirada la app queda esperando la próxima
acción ("Tocá el altar para tirar la segunda línea", etc.) — ya no se
resuelven las 6 automáticamente en cadena.

## La intensidad de la agitada se refleja en la animación

Cuando el sensor de movimiento está activo, la magnitud de la sacudida
detectada (delta de aceleración) se traduce en la física de la tirada:

- Una sacudida apenas por encima del umbral hace que las monedas floten
  suave y giren lo justo.
- Una sacudida fuerte las hace volar más alto, girar más rápido y caer con
  más "peso" (duración y bamboleo mayores).
- El altar mismo vibra brevemente con una fuerza proporcional a la sacudida,
  como retroalimentación inmediata.

El toque táctil sobre el altar (fallback en desktop o si el usuario prefiere
no agitar) usa una intensidad fija de referencia, con la misma física de
caída que la sacudida.

## Archivos

- `index.html` — estructura de la app (landing, tirada, revelación, popups)
- `style.css` — todos los estilos (papel envejecido, altar, pergamino, juego)
- `data.js` — trigramas y los 64 hexagramas en secuencia King Wen, con
  esencia/narración/dictamen/imagen
- `riddles.js` — banco de 62 preguntas para "Acertijos del Sabio"
- `app.js` — lógica de la app: ritual de monedas (manual, línea por línea,
  con intensidad de sacudida), revelación, minijuego

## Uso

Abrir `index.html` directamente en el navegador (no requiere build ni
servidor). Funciona con sensor de movimiento (agitar el celular) o con toque
táctil sobre el altar como alternativa/fallback.
