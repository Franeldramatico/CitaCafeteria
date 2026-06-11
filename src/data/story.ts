import { Scene, Ending, GameStats } from '../types';

export const INITIAL_STATS: GameStats = {
  affinity: 10,
  trust: 10,
  romance: 10,
  comfort: 10,
  mutualInterest: 10,
  curiosity: 10
};

export const PROLOGUE_PAGES = [
  {
    text: "La tarde de jueves se viste con un manto templado de color ámbar. Caminas por la acera húmeda de Aranza, sintiendo el murmullo de la ciudad como un ruido distante que deseas apagar.",
    illustration: "cafe_afternoon"
  },
  {
    text: "Decides refugiarte en 'Le Petit Refuge', esa pequeña cafetería de techos altos y aroma a madera que siempre promete calma. Al empujar la puerta de vidrio, el tintineo de una campanilla de bronce te da la bienvenida.",
    illustration: "cafe_afternoon"
  },
  {
    text: "El interior es un suspiro de calidez. Pequeñas plantas colgantes, estanterías repletas de novelas antiguas y el vapor danzante que emerge de las tazas recién servidas. La luz dorada del atardecer atraviesa los grandes ventanales, creando un tapiz de sombras largas y acogedoras.",
    illustration: "cafe_afternoon"
  },
  {
    text: "Buscas con la mirada un rincón tranquilo. Y ahí, junto al ventanal del fondo, lo ves. Un chico de mirada atenta y semblante misterioso, concentrado en una libreta de notas de cuero oscuro.",
    illustration: "boy_mysterious"
  },
  {
    text: "Lleva un suéter de punto suave y sostiene su taza con una delicadeza casi poética. Por una fracción de segundo, él levanta la mirada. Tus ojos se cruzan con los suyos. Un chispazo imperceptible, una pausa en el tiempo que hace que tu corazón salte un latido.",
    illustration: "boy_mysterious"
  },
  {
    text: "Él te sostiene la mirada durante un latido entero, dedicándote un gesto casi invisible con la cabeza antes de volver a su libreta. No sabes quién es, nunca lo has visto, pero sientes una atracción inexplicable hacia su misterio.",
    illustration: "boy_mysterious"
  },
  {
    text: "El destino acaba de darte tres mesas libres. Dos están lejos de él, bajo el cobijo de la penumbra... y una está justo enfrente de su ventana, al alcance de un susurro.",
    illustration: "boy_mysterious"
  }
];

export const STORY_SCENES: Record<string, Scene> = {
  sitting_down: {
    id: 'sitting_down',
    title: 'Capítulo 1: La Elección del Espacio',
    characterExpression: 'mysterious',
    lighting: 'golden',
    text: "Te acercas lentamente con tu bolso al hombro. Tus pasos resuenan sutilmente en el suelo de madera. Él no levanta la mirada de inmediato, pero notas cómo su postura se vuelve un poco más sobria. Te sientas en la mesa contigua, respirando el aroma a canela y granos tostados. Un camarero se acerca amablemente a tomar tu pedido. ¿Qué decides hacer para inaugurar este encuentro?",
    choices: [
      {
        id: 'sit_order_bold',
        text: "Pedir un café fuerte cargado y mirarlo fijamente con una sonrisa cómplice.",
        consequenceText: "Pides un espresso doble. Él nota la intensidad de tu pedido, levanta los ojos y te sonríe de soslayo, impresionado por tu seguridad. La chispa del romance empieza a encenderse.",
        statsModifiers: { romance: 3, affinity: 2, curiosity: 1 },
        nextSceneId: 'first_words'
      },
      {
        id: 'sit_order_cozy',
        text: "Pedir un té de manzanilla con miel, suspirar aliviada y abrir tu propio diario.",
        consequenceText: "Optas por la calidez silenciosa. Él te observa de reojo mientras el camarero te sirve. Parece hallar comodidad en tu aura pacífica y tranquila. La confianza mutua florece.",
        statsModifiers: { comfort: 3, trust: 2, affinity: 1 },
        nextSceneId: 'first_words'
      },
      {
        id: 'sit_order_timid',
        text: "Pedir un chocolate caliente con malvaviscos, mirando con atención los detalles del menú para ocultar tus nervios.",
        consequenceText: "Tu timidez resulta adorable. El chico dibuja una suave sonrisa en sus labios, tal vez encontrando tierno tu sutil rubor. Despiertas en él una gran curiosidad.",
        statsModifiers: { curiosity: 3, trust: 2, comfort: 1 },
        nextSceneId: 'first_words'
      }
    ]
  },

  first_words: {
    id: 'first_words',
    title: 'Capítulo 2: El Sonido de una Voz',
    characterExpression: 'mysterious',
    lighting: 'golden',
    text: "El vapor de tu bebida asciende dibujando formas caprichosas. De repente, el chico misterioso deja escapar un leve suspiro y cierra su libreta. Te mira directamente. Sus ojos tienen un brillo cálido y misterioso. —Disculpa si parezco indiscreto —su voz es suave, modulada, con una cadencia tranquila—, pero... ese libro/cuaderno que traes, o la forma en que miras la tarde... da la impresión de que buscas una respuesta de la vida, o tal vez escapar de ella. ¿Cuál de las dos es?",
    dialogueSpeaker: 'Chico Misterioso',
    choices: [
      {
        id: 'words_escape',
        text: "—Creo que a veces escapar es la única manera de encontrarse. ¿Tú también huyes de algo?",
        consequenceText: "Él apoya la barbilla en su mano, intrigado por tu profundidad simbólica. —Tal vez —responde—. El truco está en saber huir hacia el lugar correcto.",
        statsModifiers: { affinity: 3, romance: 2, curiosity: 2 },
        nextSceneId: 'sharing_space'
      },
      {
        id: 'words_answer',
        text: "—Busco respuestas sencillas en un mundo demasiado complicado. ¿Y tú, qué escribes con tanto afán?",
        consequenceText: "Se sorprende gratamente por tu pregunta directa. Da un golpecito con el dedo sobre su cuaderno de cuero. —Escribo pensamientos efímeros. Cosas que la gente olvida cuando el atardecer termina.",
        statsModifiers: { mutualInterest: 3, trust: 2, comfort: 1 },
        nextSceneId: 'sharing_space'
      },
      {
        id: 'words_joke',
        text: "—Solo buscaba un buen café, pero parece que encontré a un filósofo de cafetería de tiempo completo.",
        consequenceText: "Suelta una risa franca y cantarina que rompe el hielo por completo. Se inclina hacia adelante, divertido. —Me han llamado cosas peores. Pero tienes razón, tiendo a sobrepensar.",
        statsModifiers: { comfort: 3, affinity: 2, romance: 1 },
        nextSceneId: 'sharing_space'
      }
    ]
  },

  sharing_space: {
    id: 'sharing_space',
    title: 'Capítulo 3: Acortando Distancias',
    characterExpression: 'smiling',
    lighting: 'sunset',
    text: "El sol empieza a descender, pintando las paredes con un tono naranja encendido y melancólico. Él toma su taza de café de la mesa, se levanta con lentitud impecable y te mira pidiendo permiso de forma tácita. —¿Te molestaría si compartimos mesa? Odio hablar a través de la distancia, y me gustaría conocer a la dueña de respuestas tan singulares.",
    dialogueSpeaker: 'Chico Misterioso',
    choices: [
      {
        id: 'space_welcome',
        text: "—Para nada. Adelante, tu misterio ya estaba ocupando demasiado espacio de todas formas.",
        consequenceText: "Se sienta frente a ti con una sonrisa brillante. La distancia física se reduce a centímetros y el aire se llena de una tensión romántica exquisita. Sientes el calor de su presencia.",
        statsModifiers: { romance: 3, mutualInterest: 2, affinity: 2 },
        nextSceneId: 'deep_connections'
      },
      {
        id: 'space_warm',
        text: "—Sería un placer. Siento que este rincón es ideal para compartir una buena conversación.",
        consequenceText: "Asiente complacido y se acomoda con suavidad. Su forma de sentarse denota absoluta comodidad y respeto hacia tu espacio personal. La confianza se solidifica.",
        statsModifiers: { trust: 3, comfort: 3, affinity: 1 },
        nextSceneId: 'deep_connections'
      },
      {
        id: 'space_hesitant',
        text: "—Está bien, puedes sentarte... pero solo si me dejas ver al menos una página de esa misteriosa libreta.",
        consequenceText: "Él sonríe misteriosamente y desliza el cuaderno un poco hacia ti, pero sin abrirlo del todo. —Es un trato justo, Aranza... pero los secretos se entregan a cambio de otros secretos.",
        statsModifiers: { curiosity: 3, mutualInterest: 2, romance: 1 },
        nextSceneId: 'deep_connections'
      }
    ]
  },

  deep_connections: {
    id: 'deep_connections',
    title: 'Capítulo 4: El Peso de las Palabras',
    characterExpression: 'smiling',
    lighting: 'sunset',
    text: "Ya sentados en la misma mesa redonda de madera rústica, conversan sobre las melodías melancólicas que suenan en los altavoces de la cafetería. Él se queda mirándote fijamente, apreciando los reflejos dorados del crepúsculo en tu cabello. —Dime algo, Aranza. ¿Cuál es ese recuerdo de tu infancia que vuelve a ti cada vez que huele a lluvia, o cuando te sientes infinitamente pequeña?",
    dialogueSpeaker: 'Él',
    choices: [
      {
        id: 'deep_poetic',
        text: "—El olor a tierra mojada en el patio de mi abuela. Sentía que el mundo se detenía y que nada malo podía pasar.",
        consequenceText: "Él suspira con nostalgia, mirándote con una ternura desarmante. —Es hermoso. La lluvia solía curar todas nuestras dudas cuando éramos niños. Creo que tú aún conservas esa inocencia mágica.",
        statsModifiers: { affinity: 3, romance: 3, trust: 2 },
        nextSceneId: 'the_confession'
      },
      {
        id: 'deep_realist',
        text: "—Mirar las gotas correr por la ventana intentando adivinar cuál ganaría la carrera. Era una forma de encontrar orden en el caos.",
        consequenceText: "Él ríe suavemente, asombrado por tu mente analítica y curiosa. —¡Yo hacía exactamente lo mismo! Es increíble cómo nuestras mentes buscaban pequeñas reglas para entender el mundo.",
        statsModifiers: { trust: 3, comfort: 3, mutualInterest: 2 },
        nextSceneId: 'the_confession'
      },
      {
        id: 'deep_vulnerable',
        text: "—El sonido de mi propia respiración bajo las cobijas, deseando crecer rápido. Aunque ahora que crecí, solo quiero volver ahí.",
        consequenceText: "Su mirada se torna comprensiva y empática. Pone una mano muy cerca de la tuya sobre la mesa, sin llegar a tocarte pero dándote calor de apoyo. —Crecer es un viaje solitario. Me alegra que hayamos coincidido en esta parada.",
        statsModifiers: { comfort: 3, affinity: 2, curiosity: 3 },
        nextSceneId: 'the_confession'
      }
    ]
  },

  the_confession: {
    id: 'the_confession',
    title: 'Capítulo 5: Revelaciones bajo la Penumbra',
    characterExpression: 'mysterious',
    lighting: 'dust',
    text: "Las luces cálidas de filamento de la cafetería se encienden con un suave zumbido, creando un ambiente de ensueño. Las sombras colonizan el rincón. Él acaricia el borde de su taza vacía y confiesa con voz queda: —A decir verdad, vine hoy aquí porque mañana debo tomar una decisión crucial sobre mi futuro: marcharme lejos por una oportunidad profesional... o quedarme en esta ciudad donde todo me resulta familiar, pero a veces me siento invisible. Escuchar tu voz hoy me hace dudar de mis planes.",
    dialogueSpeaker: 'Él',
    choices: [
      {
        id: 'confess_stay',
        text: "—Quédate. A veces lo que buscamos no está en un mapa nuevo, sino en las conexiones inesperadas del presente.",
        consequenceText: "Tus palabras vibran en el aire con un peso romántico abrumador. Él te mira intensamente, con los ojos llenos de una mezcla de esperanza e indecisión hermosa.",
        statsModifiers: { romance: 4, affinity: 3, mutualInterest: 2 },
        nextSceneId: 'the_touch'
      },
      {
        id: 'confess_leave',
        text: "—Sigue tu camino y vuela alto. Pero prométeme que este atardecer se quedará grabado en tu equipaje.",
        consequenceText: "La madurez de tu consejo lo impacta profundamente. Te mira con profundo respeto y un dejo de dulce resignación. Siente que eres un alma sabia y única.",
        statsModifiers: { trust: 4, comfort: 3, affinity: 2 },
        nextSceneId: 'the_touch'
      },
      {
        id: 'confess_fate',
        text: "—¿Y si dejamos que el destino decida? Lanza una moneda. Si de verdad tienes que irte, el universo te lo dirá.",
        consequenceText: "Saca una moneda de plata envejecida de su bolsillo, fascinado por tu propuesta mística. Sonríe con picardía y curiosidad desbordante. —Me gusta cómo piensas, Aranza.",
        statsModifiers: { curiosity: 4, comfort: 2, romance: 2 },
        nextSceneId: 'the_touch'
      }
    ]
  },

  the_touch: {
    id: 'the_touch',
    title: 'Capítulo 6: La Proximidad de los Cuerpos',
    characterExpression: 'smiling',
    lighting: 'dust',
    text: "La noche ha caído y la cafetería se siente como un refugio de cristal rodeado de sombras oscuras. Él acerca su mano a la tuya. Sus dedos rozan apenas el puño de tu suéter. Sientes una calidez eléctrica que te recorre la espina dorsal. Sus ojos negros buscan los tuyos, pidiendo silenciosamente desvelar las últimas barreras. —¿Te has preguntado —pregunta en un susurro— si la casualidad de nuestro encuentro de hoy es solo azar... o si estábamos destinados a salvarnos mutuamente del frío de esta tarde?",
    dialogueSpeaker: 'Él',
    choices: [
      {
        id: 'touch_hold',
        text: "Deslizar tu mano libre para entrelazar tus dedos con los suyos, sosteniendo su mirada cálida.",
        consequenceText: "Nuestros dedos se entrelazan a la perfección. Es un contacto tibio, seguro y profundamente romántico. Él aprieta suavemente tu mano, sellando un pacto sin palabras.",
        statsModifiers: { romance: 5, affinity: 4, trust: 3 },
        nextSceneId: 'last_moment'
      },
      {
        id: 'touch_smile',
        text: "Sonreír tímidamente, acariciar suavemente su taza y decirle que crees en el hilo rojo del destino.",
        consequenceText: "Él suspira aliviado y sus ojos brillan con devoción emocional. Se siente profundamente comprendido e inspirado por tu romántica visión del mundo.",
        statsModifiers: { affinity: 5, comfort: 4, mutualInterest: 3 },
        nextSceneId: 'last_moment'
      },
      {
        id: 'touch_tease',
        text: "Mirarlo con picardía y decirle: —¿Y por qué no ambas cosas? El azar es más divertido si tiene un poco de magia.",
        consequenceText: "Se ríe suavemente, encantado por tu espíritu lúdico e ingenioso. Siente que eres un enigma que desearía pasar el resto de su vida descifrando.",
        statsModifiers: { curiosity: 5, mutualInterest: 4, romance: 2 },
        nextSceneId: 'last_moment'
      }
    ]
  },

  last_moment: {
    id: 'last_moment',
    title: 'Capítulo 7: La Despedida de las Tazas Vacías',
    characterExpression: 'smiling',
    lighting: 'night_warm',
    text: "El aroma a café y canela es un recuerdo lejano, sustituido por el olor a cera de las velas que parpadean en el mostrador. El camarero comienza a voltear las sillas de las mesas lejanas. Es la señal inequívoca de que la cafetería está por cerrar sus puertas. Tus tazas de cerámica están completamente vacías. Él arregla su suéter y se levanta lentamente, ofreciéndote su mano para ayudarte a ponerte de pie. Es el último momento. ¿Cómo decides cerrar este inolvidable capítulo bajo la luz nocturna?",
    choices: [
      {
        id: 'last_kiss',
        text: "Aceptar su mano, acortar toda distancia y darle un suave beso de despedida cerca de sus labios.",
        consequenceText: "Te acercas decidida. Él contiene la respiración mientras tus labios rozan la comisura de su boca con una ternura infinita. Un temblor de romance puro domina el aire.",
        statsModifiers: { romance: 6, affinity: 4, trust: 2 },
        nextSceneId: 'evaluate_ending'
      },
      {
        id: 'last_number',
        text: "Tomar un trocito de papel de una servilleta, escribir tu número telefónico y guardárselo en el bolsillo de su suéter con una mirada coqueta.",
        consequenceText: "Deslizas el papel dentro del bolsillo de lana gruesa de su pecho, rozando sutilmente su piel. Él sonríe con fascinación y asiente, prometiendo guardar el secreto en su corazón.",
        statsModifiers: { mutualInterest: 6, curiosity: 4, romance: 2 },
        nextSceneId: 'evaluate_ending'
      },
      {
        id: 'last_hug',
        text: "Darle un abrazo prolongado y reconfortante, susurrándole que el universo siempre conspira a favor de los corazones sinceros.",
        consequenceText: "Te refugias en su pecho por unos segundos eternos. El aroma de su perfume te inunda de paz. Él te abraza con fuerza, deseando que ese abrazo detuviera la rotación del planeta.",
        statsModifiers: { comfort: 6, trust: 5, affinity: 3 },
        nextSceneId: 'evaluate_ending'
      }
    ]
  }
};

export const ENDINGS: Ending[] = [
  {
    id: 'ending_love_true',
    title: 'Final 1: Amor Verdadero',
    subtitle: 'Almas gemelas bajo la luz dorada',
    illustrationType: 'love_true',
    description: "Aranza y el muchacho sintieron una conexión gravitacional que rompió cualquier duda terrenal. Él decidió aplazar su viaje indefinidamente para explorar este sentimiento real. Aquella tarde en 'Le Petit Refuge' no fue una simple coincidencia, sino el primer capítulo de su historia de amor eterna.",
    poeticText: "—Hay encuentros que no se miden en segundos, sino en la eternidad que despiertan en los ojos del otro.",
    statsRequirementMessage: "Desbloqueado al lograr máxima Afinidad (>=15) y máxima Atracción Romántica (>=15).",
    minStats: { affinity: 15, romance: 15 }
  },
  {
    id: 'ending_perfect_date',
    title: 'Final 2: Primera Cita Perfecta',
    subtitle: 'Navegando el asfalto nocturno',
    illustrationType: 'perfect_date',
    description: "Al apagarse las luces de la cafetería, ninguno deseaba despedirse. Sosteniendo tu mano con firmeza y ternura, él te invitó a caminar bajo los faroles de la ciudad y cenar en su rincón italiano favorito. La noche apenas comenzaba, y la complicidad entre ustedes encendió las estrellas de la capital.",
    poeticText: "—La noche es más cálida cuando caminamos juntos al mismo ritmo.",
    statsRequirementMessage: "Desbloqueado al lograr máxima Confianza (>=14) y alta Atracción Romántica (>=12).",
    minStats: { trust: 13, romance: 12 }
  },
  {
    id: 'ending_number_exchange',
    title: 'Final 3: Intercambio de Números',
    subtitle: 'La promesa de un nuevo amanecer',
    illustrationType: 'numbers',
    description: "Con ojos traviesos y una promesa suspendida en el aire, Aranza guardó el número del muchacho en su bolso. Al llegar a casa, un zumbido en tu pantalla reveló su primer mensaje: 'Ya extraño el aroma a café y tu sonrisa'. Ambos saben perfectamente que este juego no ha hecho más que comenzar.",
    poeticText: "—Un número en un papel es solo tinta; pero en nuestras manos, es el mapa de un feliz reencuentro.",
    statsRequirementMessage: "Desbloqueado al lograr alto Interés Mutuo (>=14) y alta Curiosidad (>=12).",
    minStats: { mutualInterest: 14, curiosity: 12 }
  },
  {
    id: 'ending_friends_potential',
    title: 'Final 4: Amigos con Potencial',
    subtitle: 'Cimientos fuertes para un gran amor',
    illustrationType: 'friends_potential',
    description: "La comodidad de su conversación fue tan natural que parecía que se conocían de vidas pasadas. Decidieron ir despacio, construyendo una amistad sincera que desborda un latente potencial romántico. Él te prometió llamarte cada vez que visite la ciudad, sabiendo que tú eres su refugio favorito.",
    poeticText: "—Los mejores amores se cocinan a fuego lento, empezando por risas sinceras compartidas.",
    statsRequirementMessage: "Desbloqueado al lograr alta Comodidad (>=15) y alta Confianza (>=12).",
    minStats: { comfort: 15, trust: 12 }
  },
  {
    id: 'ending_unforgettable',
    title: 'Final 5: Encuentro Inolvidable',
    subtitle: 'Marcas de fuego en el alma',
    illustrationType: 'unforgettable',
    description: "Se revelaron secretos trémulos que jamás le habían confesado a nadie más. Fue una tarde de catarsis emocional bajo el resplandor cósmico del atardecer. Aunque su destino inmediato los lleve por rumbos diferentes, ambos sabrán para siempre que lo vivido hoy cambió su forma de percibir la vida.",
    poeticText: "—Nos tocamos en el lugar donde las almas guardan sus silencios más celosos.",
    statsRequirementMessage: "Desbloqueado al lograr alta Curiosidad (>=15) y alta Afinidad (>=10).",
    minStats: { curiosity: 14, affinity: 10 }
  },
  {
    id: 'ending_too_shy',
    title: 'Final 6: Tímidos Demasiado Tiempo',
    subtitle: 'El silencio de las palabras no pronunciadas',
    illustrationType: 'shy',
    description: "A pesar de la increíble atmósfera de confort mutuo, el pudor y la timidez impidieron dar ese paso decisivo hacia la cercanía romántica. Se despidieron con una dulce sonrisa y miradas que imploraban un abrazo silencioso. Se marcharon separados, deseando en secreto haber tenido un poco de valentía.",
    poeticText: "—El amor a veces susurra tan despacio que tememos responderle en voz alta.",
    statsRequirementMessage: "Desbloqueado con alta Comodidad (>=12) pero bajo Romance (<11).",
    minStats: { comfort: 11 }
  },
  {
    id: 'ending_missed_opportunity',
    title: 'Final 7: Oportunidad Perdida',
    subtitle: 'Estaciones de tren que se bifurcan',
    illustrationType: 'missed',
    description: "Aranza mantuvo una coraza impenetrable debido a los temores del pasado. Al final de la tarde, la conversación se apagó lentamente como una vela sin oxígeno. El chico recogió su abrigo con un destello de tristeza en sus ojos, despidiéndose amablemente para perderse entre la niebla del frío nocturno.",
    poeticText: "—A veces las hojas caen del árbol no por el viento, sino por falta de calor.",
    statsRequirementMessage: "Desbloqueado con baja Afinidad (<9) y baja Confianza (<9). Cruces de diálogo distantes."
  },
  {
    id: 'ending_misunderstanding',
    title: 'Final 8: Un Sutil Malentendido',
    subtitle: 'Señales encontradas en el humo de café',
    illustrationType: 'misunderstanding',
    description: "Ambos querían conectar, pero un cruce de miradas esquivas y palabras mal interpretadas levantó un muro invisible de inseguridad. Al despedirse, quedó la extraña sensación de que debajo del malentendido latía un deseo ardiente que simplemente no supo cómo expresarse.",
    poeticText: "—Hay silencios que gritan 'quédate' pero se escuchan como un tibio 'adiós'.",
    statsRequirementMessage: "Desbloqueado con baja Confianza (<8) pero alto interés o curiosidad."
  },
  {
    id: 'ending_sweet_goodbye',
    title: 'Final 9: Dulce Despedida',
    subtitle: 'Una lágrima de agradecimiento',
    illustrationType: 'sweet_goodbye',
    description: "Disfrutaron de una plática pacífica y reconfortante, pero comprendieron maduramente que sus vidas pertenecen a universos distintos. Se abrazaron con ternura al salir, sabiendo que este cruce de caminos fue un hermoso obsequio efímero del destino que atesorarán con alegría sana.",
    poeticText: "—No toda historia hermosa necesita ser eterna para ser perfecta.",
    statsRequirementMessage: "Desbloqueado con alta Comodidad (>=14) pero baja Afinidad general (<11)."
  },
  {
    id: 'ending_uncertain_destiny',
    title: 'Final 10: Destino Incierto',
    subtitle: 'El misterio continúa suspendido',
    illustrationType: 'uncertain',
    description: "Se despidieron flotando en una nube de misterio sin límites definidos. Ninguno se atrevió a pedir el teléfono ni a prometer un reencuentro, pero ambos acordaron volver a sentarse en las mismas mesas la tarde del próximo jueves a la misma hora. El destino jugará su última carta en siete días.",
    poeticText: "—El misterio más grande no es hacia dónde vamos, sino si volveremos a coincidir.",
    statsRequirementMessage: "Desbloqueado por defecto cuando las elecciones son uniformes y balanceadas."
  }
];

export function getMatchingEnding(stats: GameStats): Ending {
  // Check the ending conditions in descending order of value
  
  // 1. Amor Verdadero
  if (stats.affinity >= 14 && stats.romance >= 14) {
    return ENDINGS.find(e => e.id === 'ending_love_true') || ENDINGS[9];
  }
  
  // 2. Primera Cita Perfecta
  if (stats.trust >= 13 && stats.romance >= 12) {
    return ENDINGS.find(e => e.id === 'ending_perfect_date') || ENDINGS[9];
  }
  
  // 3. Intercambio de Números
  if (stats.mutualInterest >= 13 && stats.curiosity >= 12) {
    return ENDINGS.find(e => e.id === 'ending_number_exchange') || ENDINGS[9];
  }
  
  // 4. Amigos con Potencial
  if (stats.comfort >= 14 && stats.trust >= 11) {
    return ENDINGS.find(e => e.id === 'ending_friends_potential') || ENDINGS[9];
  }
  
  // 5. Encuentro Inolvidable
  if (stats.curiosity >= 14 && stats.affinity >= 11) {
    return ENDINGS.find(e => e.id === 'ending_unforgettable') || ENDINGS[9];
  }

  // 6. Tímidos Demasiado Tiempo
  if (stats.comfort >= 11 && stats.romance < 11) {
    return ENDINGS.find(e => e.id === 'ending_too_shy') || ENDINGS[9];
  }
  
  // 7. Oportunidad Perdida
  if (stats.affinity < 10 && stats.trust < 10) {
    return ENDINGS.find(e => e.id === 'ending_missed_opportunity') || ENDINGS[9];
  }

  // 8. Malentendido
  if (stats.trust < 9 && (stats.curiosity >= 11 || stats.romance >= 11)) {
    return ENDINGS.find(e => e.id === 'ending_misunderstanding') || ENDINGS[9];
  }

  // 9. Dulce Despedida
  if (stats.comfort >= 13 && stats.affinity < 11) {
    return ENDINGS.find(e => e.id === 'ending_sweet_goodbye') || ENDINGS[9];
  }

  // 10. Destino Incierto (Default)
  return ENDINGS.find(e => e.id === 'ending_uncertain_destiny') || ENDINGS[9];
}
