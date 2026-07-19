/* ============================================================
   ACERTIJOS DEL SABIO — banco ampliado de trivia y acertijos
   ------------------------------------------------------------
   Todo el texto es redacción original. Las opciones de cada
   pregunta de trivia están calibradas para tener una extensión
   y un tono similares entre sí, de modo que la respuesta correcta
   no se pueda adivinar por ser "la más larga" o "la más rara".
   Los acertijos son de revelar-respuesta (sin opciones), pensados
   como enigmas de lógica o parábolas, no solo datos.
   ============================================================ */

const ACERTIJOS = [

/* ---------------------- TRIVIA ---------------------- */

{tipo:"trivia",pregunta:"¿Cuántos hexagramas componen el I Ching?",
 opciones:["Cuarenta y ocho","Sesenta y cuatro","Setenta y dos","Ochenta y uno"],correcta:1,
 explicacion:"Ocho trigramas combinados de a pares (8×8) dan exactamente sesenta y cuatro hexagramas posibles."},

{tipo:"trivia",pregunta:"¿Cómo se llaman las figuras de tres líneas que, combinadas de a dos, forman cada hexagrama?",
 opciones:["El Bagua","El Wu Xing","El Tao Te Ching","El Feng Shui"],correcta:0,
 explicacion:"El Bagua reúne los ocho trigramas fundamentales: la base de todo el sistema del I Ching."},

{tipo:"trivia",pregunta:"El nombre «I Ching» (易經) se traduce de forma más literal como…",
 opciones:["El Libro del Camino","El Libro de las Mutaciones","El Libro del Vacío","El Libro de la Armonía"],correcta:1,
 explicacion:"«Yì Jīng» significa literalmente «Clásico de los Cambios» o «Libro de las Mutaciones»."},

{tipo:"trivia",pregunta:"La tradición atribuye a un filósofo chino una serie de comentarios que ayudaron a difundir el I Ching. ¿A quién?",
 opciones:["Laozi","Sun Tzu","Confucio","Mencio"],correcta:2,
 explicacion:"La tradición le atribuye las llamadas «Diez Alas», un conjunto de comentarios que enriquecen el texto original."},

{tipo:"trivia",pregunta:"En el método de las tres monedas, ¿qué suma corresponde a un yang «viejo», a punto de transformarse?",
 opciones:["Seis","Siete","Ocho","Nueve"],correcta:3,
 explicacion:"Tres caras (3+3+3=9) es la única forma de obtener un yang viejo, que se convierte en yin."},

{tipo:"trivia",pregunta:"¿Cuál de estos trigramas está formado por tres líneas yin, sin interrupción alguna?",
 opciones:["Qián, el Cielo","Kūn, la Tierra","Kǎn, el Agua","Lí, el Fuego"],correcta:1,
 explicacion:"Kūn, la Tierra, es la receptividad pura: sus tres líneas están quebradas de punta a punta."},

{tipo:"trivia",pregunta:"El yin y el yang se describen mejor como…",
 opciones:["Dos fuerzas opuestas y complementarias","Los cinco elementos clásicos","Las cuatro estaciones del año","Un sistema de ocho direcciones"],correcta:0,
 explicacion:"Ninguna de las dos fuerzas existe sin la otra: se generan y se transforman mutuamente."},

{tipo:"trivia",pregunta:"¿Qué designa, de manera literal, la palabra «Tao» (道)?",
 opciones:["El destino fijado","El vacío original","El camino o curso natural","El espíritu ancestral"],correcta:2,
 explicacion:"«Tao» designa el curso natural de las cosas: el camino que todo proceso sigue."},

{tipo:"trivia",pregunta:"Los cinco elementos (Wu Xing) de la cosmología china tradicional son:",
 opciones:["Tierra, Fuego, Agua, Metal y Madera","Tierra, Aire, Fuego, Agua y Éter","Sol, Luna, Estrellas, Tierra y Cielo","Norte, Sur, Este, Oeste y Centro"],correcta:0,
 explicacion:"Se relacionan entre sí en ciclos de generación mutua y de control mutuo."},

{tipo:"trivia",pregunta:"¿A qué dinastía se atribuye tradicionalmente el ordenamiento King Wen de los 64 hexagramas?",
 opciones:["Dinastía Tang","Dinastía Zhou","Dinastía Ming","Dinastía Han"],correcta:1,
 explicacion:"Se dice que el Rey Wen de Zhou ordenó los hexagramas mientras estaba preso, en el siglo XII a. C."},

{tipo:"trivia",pregunta:"¿Cómo se llama, en el taoísmo, la idea de «acción sin forzar», el fluir con el curso natural de las cosas?",
 opciones:["El Chi","El Wu Wei","El Li","El De"],correcta:1,
 explicacion:"Wu Wei no significa no hacer nada, sino actuar sin resistencia innecesaria contra el curso natural."},

{tipo:"trivia",pregunta:"El símbolo del Tai Chi (taijitu), el círculo con dos mitades entrelazadas, representa sobre todo…",
 opciones:["El equilibrio dinámico entre yin y yang","La sucesión de los ocho trigramas","Los cinco elementos en ciclo","El calendario lunar chino"],correcta:0,
 explicacion:"Cada mitad contiene una semilla de la otra: nada es puro, todo se transforma en su opuesto."},

{tipo:"trivia",pregunta:"¿Cuál de estos NO pertenece a los ocho trigramas tradicionales del Bagua?",
 opciones:["Zhèn, el Trueno","Xùn, el Viento","Qì, la energía vital","Duì, el Lago"],correcta:2,
 explicacion:"El Qì es un concepto de energía vital presente en toda la filosofía china, pero no es uno de los ocho trigramas."},

{tipo:"trivia",pregunta:"La «Gran Imagen» que acompaña a cada hexagrama del I Ching ofrece tradicionalmente…",
 opciones:["Una predicción del clima","Una enseñanza sobre cómo debe actuar la persona noble","El nombre del consultante","Una fecha considerada propicia"],correcta:1,
 explicacion:"Cada Gran Imagen traduce la combinación de trigramas en una lección de conducta."},

{tipo:"trivia",pregunta:"En la consulta de las tres monedas, ¿cuál es el valor asignado tradicionalmente a «cara» y a «cruz»?",
 opciones:["Cara vale 2, cruz vale 3","Cara vale 3, cruz vale 2","Ambas valen 1","Cara vale 1, cruz vale 0"],correcta:1,
 explicacion:"Cara (yang) vale 3 y cruz (yin) vale 2; la suma de las tres monedas siempre da 6, 7, 8 o 9."},

{tipo:"trivia",pregunta:"Si una línea del hexagrama es «vieja» (6 o 9), se dice que está…",
 opciones:["Anulada, no cuenta para la lectura","En transformación hacia su opuesto","Duplicada en el trigrama superior","Reservada para otra consulta"],correcta:1,
 explicacion:"Las líneas viejas se invierten para formar un segundo hexagrama, el resultante, que muestra hacia dónde se dirige la situación."},

{tipo:"trivia",pregunta:"¿Qué elemento se asocia tradicionalmente con el trigrama ☵ Kǎn?",
 opciones:["El Fuego","La Madera","El Agua","El Metal"],correcta:2,
 explicacion:"Kǎn representa el Agua: el peligro y lo abismal, pero también la fluidez inagotable."},

{tipo:"trivia",pregunta:"¿Qué elemento se asocia tradicionalmente con el trigrama ☲ Lí?",
 opciones:["El Fuego","La Tierra","El Agua","El Viento"],correcta:0,
 explicacion:"Lí representa el Fuego: la claridad y la luz, aunque una luz que necesita adherirse a algo para arder."},

{tipo:"trivia",pregunta:"El texto llamado «Dictamen», presente en cada hexagrama, se ocupa principalmente de…",
 opciones:["Narrar la historia legendaria del hexagrama","Ofrecer el juicio general sobre la situación que describe","Listar los nombres de sus líneas cambiantes","Explicar la caligrafía del carácter chino"],correcta:1,
 explicacion:"El Dictamen (o Juicio) resume el sentido general de la situación y su pronóstico, más allá de la imagen poética."},

{tipo:"trivia",pregunta:"En el pensamiento confuciano, el término «Rén» (仁) se refiere sobre todo a…",
 opciones:["La benevolencia y el cuidado hacia los demás","La estrategia militar","El destino inmutable","La riqueza material"],correcta:0,
 explicacion:"Rén es la virtud central de la ética confuciana: la humanidad genuina en el trato con otros."},

{tipo:"trivia",pregunta:"¿Qué representa mejor la práctica del «Wu Wei» en la vida cotidiana?",
 opciones:["No hacer absolutamente nada nunca","Forzar cada situación hasta lograr un control total","Actuar en armonía con el momento, sin resistencia innecesaria","Evitar toda forma de responsabilidad"],correcta:2,
 explicacion:"Wu Wei no significa inacción total, sino actuar sin luchar contra la corriente natural de las cosas."},

{tipo:"trivia",pregunta:"El trigrama ☶ Gèn (Montaña) se asocia sobre todo con la idea de…",
 opciones:["El movimiento constante","La quietud y el detenerse a tiempo","La disolución de los vínculos","El conflicto abierto"],correcta:1,
 explicacion:"Gèn representa la montaña inmóvil: la capacidad de detenerse justo en el momento correcto."},

{tipo:"trivia",pregunta:"¿Qué figura del zodíaco chino NO forma parte del ciclo de doce animales?",
 opciones:["El Dragón","El Fénix","El Tigre","La Serpiente"],correcta:1,
 explicacion:"El Fénix es una figura mítica importante en la cultura china, pero no integra el ciclo de los doce animales del zodíaco."},

{tipo:"trivia",pregunta:"Un hexagrama se construye tradicionalmente…",
 opciones:["De arriba hacia abajo, línea por línea","De abajo hacia arriba, línea por línea","De afuera hacia adentro","Todas las líneas a la vez"],correcta:1,
 explicacion:"Cada tirada agrega una línea nueva desde la base, hasta completar las seis que forman el hexagrama."},

{tipo:"trivia",pregunta:"¿Qué distingue a un trigrama superior de uno inferior dentro de un hexagrama?",
 opciones:["El superior ocupa las líneas 4, 5 y 6; el inferior, las líneas 1, 2 y 3","El superior es siempre yang puro","No hay diferencia real entre ambos","El inferior determina solamente el nombre del hexagrama"],correcta:0,
 explicacion:"El trigrama inferior forma la base (líneas 1 a 3) y el superior corona el hexagrama (líneas 4 a 6)."},

{tipo:"trivia",pregunta:"El «Libro de los Cambios» influyó, además de en la adivinación, en otra disciplina china muy conocida. ¿Cuál?",
 opciones:["La medicina tradicional china","La astronomía occidental","La aritmética decimal","La cartografía naval"],correcta:0,
 explicacion:"Conceptos como el yin-yang y los cinco elementos, presentes en el I Ching, son centrales también en la medicina tradicional china."},

{tipo:"trivia",pregunta:"¿Cuál de estas frases describe mejor la actitud recomendada al consultar el I Ching?",
 opciones:["Preguntar con sinceridad y aceptar la respuesta con calma","Repetir la tirada hasta obtener el resultado deseado","Formular preguntas cerradas de sí o no únicamente","Consultar solo en presencia de otras personas"],correcta:0,
 explicacion:"La tradición insiste en la sinceridad de la pregunta: forzar el resultado deseado desvirtúa la consulta."},

{tipo:"trivia",pregunta:"En el I Ching, dos hexagramas cuyas líneas son exactamente opuestas (todo yang cambia a yin y viceversa) se llaman…",
 opciones:["Hexagramas gemelos","Hexagramas de oposición total (o «invertidos»)","Hexagramas idénticos","Hexagramas nulos"],correcta:1,
 explicacion:"Un ejemplo clásico es Qián (todo yang) frente a Kūn (todo yin): representan polos opuestos y complementarios."},

{tipo:"trivia",pregunta:"El texto tradicionalmente asociado a cada línea individual de un hexagrama se conoce como…",
 opciones:["El Dictamen general","El Comentario de las líneas","La Gran Imagen","El Prefacio del hexagrama"],correcta:1,
 explicacion:"Cada una de las seis líneas tiene su propio texto interpretativo, distinto del Dictamen que resume el hexagrama completo."},

{tipo:"trivia",pregunta:"¿Qué número, en la numerología de las monedas, corresponde al yin en su expresión más extrema (yin viejo)?",
 opciones:["Seis","Siete","Ocho","Nueve"],correcta:0,
 explicacion:"Tres cruces (2+2+2=6) dan el valor más bajo: un yin viejo, listo para transformarse en yang."},

{tipo:"trivia",pregunta:"El zen, como escuela del budismo, es reconocido sobre todo por su énfasis en…",
 opciones:["El estudio exhaustivo de textos antiguos","La experiencia directa por sobre la explicación conceptual","Los rituales elaborados de ofrenda","La predicción precisa del futuro"],correcta:1,
 explicacion:"El zen privilegia la comprensión directa —a menudo a través de la meditación o los koans— por sobre la teoría abstracta."},

{tipo:"trivia",pregunta:"¿Cómo se llama la pregunta o relato aparentemente absurdo que los maestros zen usan para romper el pensamiento lógico habitual?",
 opciones:["Un mantra","Un koan","Un sutra","Un mandala"],correcta:1,
 explicacion:"El koan no busca una respuesta lógica convencional, sino abrir una comprensión que va más allá del razonamiento ordinario."},

{tipo:"trivia",pregunta:"La expresión «mente de principiante», propia del zen, se refiere a…",
 opciones:["La ingenuidad de quien recién empieza a estudiar","Una actitud abierta y sin prejuicios, incluso con la experiencia","El primer día de meditación de un monje","Un error común de los estudiantes novatos"],correcta:1,
 explicacion:"La mente de principiante es un ideal, no una etapa: mantener apertura genuina aun después de años de práctica."},

{tipo:"trivia",pregunta:"En la tradición taoísta, ¿qué cualidad se atribuye al agua como virtud ejemplar?",
 opciones:["Su dureza inquebrantable","Su capacidad de ceder y aun así moldear lo que la rodea","Su color siempre constante","Su velocidad superior a cualquier otro elemento"],correcta:1,
 explicacion:"El agua no combate los obstáculos: los rodea, y con paciencia sostenida termina transformando incluso la piedra."},

{tipo:"trivia",pregunta:"¿Qué representa, dentro del I Ching, un hexagrama sin ninguna línea cambiante?",
 opciones:["Una situación estable, descrita solo por ese hexagrama","Un error en la tirada de monedas","La necesidad de repetir toda la consulta","Un hexagrama incompleto"],correcta:0,
 explicacion:"Cuando no hay líneas viejas (6 o 9), no existe hexagrama resultante: la situación se lee tal como está, sin transformación en curso."},

{tipo:"trivia",pregunta:"La filosofía china distingue entre «Xiān Tiān» (Cielo Anterior) y «Hòu Tiān» (Cielo Posterior) para referirse a…",
 opciones:["Dos disposiciones distintas de los ocho trigramas","Dos calendarios agrícolas diferentes","Dos dinastías consecutivas","Dos escuelas de caligrafía"],correcta:0,
 explicacion:"Existen dos arreglos clásicos del Bagua —uno atribuido a Fu Xi y otro al Rey Wen— usados con propósitos distintos."},

{tipo:"trivia",pregunta:"¿Qué buscaban tradicionalmente los antiguos consultantes del I Ching antes de lanzar las monedas o los tallos de milenrama?",
 opciones:["Concentrar la mente en una pregunta sincera","Memorizar los 64 hexagramas de antemano","Reunir un grupo numeroso de testigos","Elegir el hexagrama que preferían obtener"],correcta:0,
 explicacion:"La calma y la sinceridad de la pregunta se consideran, en la tradición, tan importantes como el método mismo de la tirada."},

/* ---------------------- ACERTIJOS (revelar respuesta) ---------------------- */

{tipo:"riddle",pregunta:"Un discípulo le preguntó a su maestro qué era más fuerte: la roca o el agua. Tras años de práctica comprendió la respuesta. ¿Cuál fue?",
 respuesta:"El agua: no combate a la roca, la rodea, y con paciencia infinita termina moldeándola.",
 explicacion:"Es la idea taoísta del wu wei: la fuerza blanda que vence a la dura por constancia, no por choque."},

{tipo:"riddle",pregunta:"En la numerología del I Ching, ¿qué número puro representa al yang en su máxima expresión, asociado al Cielo?",
 respuesta:"El nueve.",
 explicacion:"Nueve es la suma máxima en el método de monedas y el número del yang viejo, listo para transformarse."},

{tipo:"riddle",pregunta:"Un koan zen muy citado empieza así: «Si en tu camino te encontrás con…». ¿Cómo sigue la frase, y qué enseña en realidad?",
 respuesta:"«…con Buda, matalo.»",
 explicacion:"No es un llamado literal a la violencia: enseña a no aferrarse a ninguna imagen fija —ni siquiera la del maestro— y a buscar la propia comprensión directa."},

{tipo:"riddle",pregunta:"Tengo ciudades pero no casas, bosques pero no árboles, ríos pero no una gota de agua. ¿Qué soy?",
 respuesta:"Un mapa.",
 explicacion:"Como el I Ching, un mapa no es el territorio: es un sistema de símbolos que ayuda a leerlo."},

{tipo:"riddle",pregunta:"Ante una tormenta, ¿qué sobrevive mejor: el árbol rígido o el bambú flexible? ¿Por qué lo dirían los sabios taoístas?",
 respuesta:"El bambú, porque cede sin quebrarse.",
 explicacion:"Es una metáfora clásica de la fuerza que reside en la adaptabilidad, no en la resistencia rígida."},

{tipo:"riddle",pregunta:"Cuanto más le sacás, más grande se vuelve. ¿Qué es?",
 respuesta:"Un pozo (o un hoyo).",
 explicacion:"La paradoja conecta con el hexagrama 48, El Pozo: lo que se vacía correctamente es también lo que sigue dando."},

{tipo:"riddle",pregunta:"Un granjero pierde su único caballo y sus vecinos lo compadecen. Él responde: «¿Quién sabe si es desgracia o fortuna?». Días después el caballo vuelve acompañado de otros salvajes. Poco a poco, cada giro de la historia se lee dos veces: como pérdida y como ganancia. ¿Qué actitud del I Ching resume esta parábola?",
 respuesta:"Que ningún evento tiene un significado fijo hasta que se despliega por completo; toda fortuna puede volverse su opuesto y viceversa.",
 explicacion:"Es la conocida parábola del granjero, muy citada en la tradición taoísta: el sabio suspende el juicio apresurado porque sabe que la situación aún está en movimiento."},

{tipo:"riddle",pregunta:"Un maestro sirve té en la taza de su discípulo y sigue sirviendo aunque la taza ya está llena y se derrama. El discípulo protesta. ¿Qué le respondería el maestro sobre el motivo de su gesto?",
 respuesta:"Que una mente ya llena de opiniones y certezas no tiene lugar para recibir algo nuevo, igual que la taza llena no puede recibir más té.",
 explicacion:"Es la enseñanza zen de la «mente de principiante»: solo una taza vacía puede llenarse."},

{tipo:"riddle",pregunta:"Camino sin pies, hablo sin boca, y cuando el viento me toca, cambio de forma sin perder mi nombre. ¿Qué soy?",
 respuesta:"El agua (un río, una nube, la niebla).",
 explicacion:"El agua conserva su naturaleza incluso al cambiar de forma: hielo, vapor o corriente siguen siendo agua, imagen frecuente del Tao."},

{tipo:"riddle",pregunta:"Dos monjes discuten sobre una bandera que se mueve con el viento: uno dice que es la bandera la que se mueve, el otro dice que es el viento. Un tercero interrumpe y da una respuesta que no elige ningún bando. ¿Cuál podría haber sido?",
 respuesta:"Que lo que en realidad se mueve es la mente de quienes observan y discuten.",
 explicacion:"Es un koan zen clásico: desplaza la pregunta desde el objeto externo hacia la percepción de quien observa."},

{tipo:"riddle",pregunta:"Un arquero falla el blanco una y otra vez mientras piensa en el premio que ganará. Su maestro le pide que deje de apuntar al premio. ¿Qué principio ilustra este consejo?",
 respuesta:"Que la acción certera surge cuando se suelta el apego al resultado, no cuando se lo persigue con ansiedad.",
 explicacion:"Es una idea central del budismo zen aplicada a las artes marciales y al tiro con arco: la excelencia aparece al soltar la obsesión por ganar."},

{tipo:"riddle",pregunta:"Nazco de la tierra, muero en el fuego, y sin embargo sostengo la casa entera mientras vivo. ¿Qué soy?",
 respuesta:"La leña (la madera).",
 explicacion:"Conecta con el trigrama Xùn y con el hexagrama 50, El Caldero: la madera se consume para nutrir y transformar."},

{tipo:"riddle",pregunta:"Un discípulo pregunta cómo alcanzar la iluminación. El maestro responde: «¿Ya comiste tu arroz? Entonces lava tu cuenco». ¿Qué le está enseñando en realidad?",
 respuesta:"Que la sabiduría no está en un lugar lejano, sino en hacer con plena atención lo que ya se tiene por delante.",
 explicacion:"Es una enseñanza zen recurrente: la iluminación no es una fuga de la vida cotidiana, sino la atención plena dentro de ella."},

{tipo:"riddle",pregunta:"Si respondo demasiado rápido, me equivoco. Si tardo demasiado, ya no sirvo. ¿Qué soy en el contexto de una consulta al I Ching?",
 respuesta:"El momento justo para actuar (el «tiempo» u oportunidad, tan central en el I Ching).",
 explicacion:"Muchos hexagramas —como el 5, La Espera, o el 24, El Retorno— giran en torno a reconocer el momento adecuado, ni antes ni después."},

{tipo:"riddle",pregunta:"Cuanto más se llena, menos pesa; cuanto más se vacía, más pesa. ¿Qué es?",
 respuesta:"Un globo (o algo similar que se llena de aire).",
 explicacion:"Es un acertijo clásico de lógica, no de filosofía oriental, pero encaja bien con la idea del I Ching de que las apariencias engañan al juicio apresurado."},

{tipo:"riddle",pregunta:"Un viajero llega a una encrucijada donde un guardián siempre dice la verdad y otro siempre miente, pero no sabe cuál es cuál. Solo puede hacerle una pregunta a uno de ellos para encontrar el camino correcto. ¿Qué pregunta le sirve sin importar a cuál le pregunte?",
 respuesta:"«Si le preguntara al otro guardián cuál es el camino correcto, ¿qué me respondería?» — y luego tomar el camino contrario a esa respuesta.",
 explicacion:"Es un clásico acertijo de lógica: la pregunta indirecta neutraliza tanto la verdad como la mentira, revelando el camino real."},

{tipo:"riddle",pregunta:"Tres sabios se sientan en fila mirando hacia el mismo lado; cada uno lleva un sombrero blanco o negro, pero ninguno puede ver el propio. Se les dice que al menos uno lleva sombrero negro. El del fondo, que ve a los otros dos, no puede adivinar el suyo. El del medio, que ve solo al de adelante, tampoco puede. El de adelante, que no ve a nadie, entonces sabe con certeza el color del suyo. ¿De qué color es, y por qué?",
 respuesta:"Negro. Si el del fondo no pudo deducirlo viendo a los otros dos, es porque al menos dos sombreros negros son visibles entre ellos; si el del medio tampoco pudo deducirlo viendo solo al de adelante, es porque el de adelante debe llevar sombrero negro.",
 explicacion:"Es un acertijo lógico de deducción por silencio: lo que los demás NO pueden saber también es información."},

{tipo:"riddle",pregunta:"Un discípulo pregunta: «¿Cuál es el sonido de una sola mano aplaudiendo?». ¿Qué busca provocar esta pregunta, más allá de su imposibilidad literal?",
 respuesta:"Busca romper el pensamiento lógico habitual para abrir una comprensión directa, no verbal, de la realidad.",
 explicacion:"Es uno de los koans zen más conocidos: no tiene una respuesta racional correcta, y esa es justamente la enseñanza."},

{tipo:"riddle",pregunta:"En un pueblo, cada persona dice siempre la verdad los días pares y siempre miente los días impares. Un viajero le pregunta a un aldeano si hoy es día par, y este responde que sí. ¿Qué día es, sabiendo que la respuesta es coherente con su propia regla?",
 respuesta:"Es un día par: solo un día par permite que la afirmación «hoy es par» sea verdadera y coherente con la regla del aldeano.",
 explicacion:"En un día impar, el aldeano mentiría, y decir «hoy es par» siendo impar sería una mentira consistente también... pero la única respuesta sin contradicción lógica plena es que sea día par y diga la verdad."},

{tipo:"riddle",pregunta:"Un sabio taoísta observa un río que nunca dos veces moja el mismo pie del que lo cruza, aunque el río parece siempre el mismo. ¿Qué principio del cambio ilustra esta imagen?",
 respuesta:"Que todo fluye y se transforma constantemente, aunque conserve un nombre o una forma reconocible.",
 explicacion:"Es una imagen que resume bien el espíritu del I Ching, el Libro de los Cambios: la identidad de las cosas convive con su transformación permanente."},

{tipo:"riddle",pregunta:"Se rompe sin hacer ruido y, sin embargo, todos lo notan de inmediato. ¿Qué es?",
 respuesta:"El silencio (o también: la confianza, la promesa).",
 explicacion:"Un acertijo de doble lectura, útil para pensar en lo intangible: lo que no hace ruido al romperse puede ser justamente lo más ruidoso en sus consecuencias."},

{tipo:"riddle",pregunta:"Un monje pregunta cuál es el camino hacia la sabiduría. El maestro señala la luna. El monje se queda mirando el dedo. ¿Qué error está señalando esta anécdota?",
 respuesta:"Confundir el medio (el dedo, la enseñanza, el símbolo) con el fin (la luna, la comprensión misma).",
 explicacion:"Es una advertencia frecuente en el budismo y el taoísmo: los textos, ritos y símbolos —incluido el I Ching— son señales, no la meta en sí misma."},

{tipo:"riddle",pregunta:"En una isla viven solo caballeros que siempre dicen la verdad y bribones que siempre mienten. Un viajero se encuentra con dos habitantes, A y B. A dice: «Al menos uno de nosotros es un bribón». ¿Qué son A y B?",
 respuesta:"A es un caballero y B es un bribón.",
 explicacion:"Si A fuera un bribón, su frase sería verdadera, lo cual es imposible para un bribón; por lo tanto A es caballero, y su afirmación verdadera obliga a que B sea el bribón."},

{tipo:"riddle",pregunta:"No tengo voz y sin embargo hablo con todos; no tengo edad y sin embargo cambio cada vez que se me consulta. ¿Qué soy?",
 respuesta:"El I Ching (el oráculo, el libro mismo).",
 explicacion:"Cada consulta ofrece una lectura distinta según las líneas obtenidas, aunque el texto permanezca siempre igual."},

{tipo:"riddle",pregunta:"Un viajero debe cruzar un río llevando un lobo, una cabra y una col, pero su bote solo tiene lugar para él y una carga a la vez. Si deja al lobo con la cabra, el lobo se la come; si deja a la cabra con la col, la cabra la come. ¿Cómo cruza sin perder nada?",
 respuesta:"Lleva primero la cabra, vuelve solo, lleva el lobo, regresa con la cabra, lleva la col y por último vuelve a buscar a la cabra.",
 explicacion:"El truco está en el segundo viaje: llevar algo de vuelta (la cabra) para poder transportar sin riesgo lo que quedaba en la otra orilla."},

];
