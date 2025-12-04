// Datos de las terapias
const therapiesData = [
  {
    id: 'iridologia',
    title: 'Iridología',
    subtitle: 'Diagnóstico del estado orgánico y sistémico a través del iris',
    emoji: '👁️',
    content: `
    <p>La Iridología es una disciplina de la Medicina Naturista que estudia el iris del ojo como reflejo del estado de salud general del organismo. Mediante la observación de sus patrones, colores y estructuras, se busca identificar desequilibrios y predisposiciones a enfermedades, permitiendo una aproximación integral al bienestar físico y emocional.</p>
    <h4>📜 Breve historia de la Iridología</h4>
      <p>Aunque algunas fuentes remontan sus orígenes a civilizaciones antiguas como Egipto, India o China, la Iridología moderna se consolidó en el siglo XIX. El médico húngaro Ignaz von Peczely (1826–1911) es reconocido como el pionero de esta técnica. Según la leyenda, a los 11 años observó una marca en el iris de una lechuza que había herido accidentalmente. Al sanar el ave, la marca desapareció, lo que le inspiró a investigar la relación entre el iris y la salud. En 1886, publicó una de las primeras topografías del iris, estableciendo correlaciones entre áreas del ojo y órganos del cuerpo.</p>
      <p>Posteriormente, el sueco Nils Liljequist (1893) amplió este enfoque al crear un atlas detallado del iris, introduciendo la Iridología en América del Norte. En el siglo XX, el quiropráctico estadounidense Bernard Jensen (1908–2001) popularizó su uso como herramienta complementaria en la medicina naturista.</p>
    `
  },
  {
    id: 'alimentacion',
    title: 'Alimentación Intuitiva',
    subtitle: 'Guiada y Curativa',
    emoji: '🥗',
    content: `
      <p>La alimentación intuitiva y curativa se basa en escuchar tu cuerpo y elegir alimentos que nutran, sanen y equilibren tu organismo. Junto con la fitoterapia, utiliza plantas y hierbas medicinales para potenciar la salud de manera natural.</p>
      <p>Este enfoque promueve el consumo de alimentos vivos, frescos y alcalinos, que ayudan a:</p>
      <ul class="therapy-list">
        <li>🌿 Depurar el organismo</li>
        <li>🌿 Fortalecer el sistema inmunológico</li>
        <li>🌿 Prevenir enfermedades crónicas</li>
      </ul>
      <p class="therapy-highlight">✨ ¿Sabías que aprender a sintonizar con tus señales internas puede transformar tu relación con la comida y tu bienestar general?</p>
      <p><strong>🍃 Limpieza del colon:</strong> desde la perspectiva naturista, se utilizan métodos como infusiones depurativas, enemas suaves y dieta basada en alimentos frescos y vivos para eliminar residuos acumulados, mejorar la digestión y revitalizar el organismo.</p>
      <p><strong>🌱 Desintoxicación hepática:</strong> se apoya al hígado mediante plantas medicinales como el cardo mariano, diente de león o alcachofa, junto con hábitos de alimentación consciente, para favorecer la eliminación de toxinas y el equilibrio energético.</p>
    `
  },
  {
    id: 'tinturas',
    title: 'Tinturas Herbolarias',
    subtitle: 'y Fitoterapia',
    emoji: '🌿',
    content: `
      <p>Las tinturas herbolarias son preparaciones concentradas de plantas medicinales en alcohol, que conservan sus principios activos y actúan de manera rápida y efectiva sobre el cuerpo.</p>
      <p>La fitoterapia aprovecha el poder curativo de las plantas a través de infusiones, tinturas, ungüentos o baños, integrando sabiduría ancestral y femenina para apoyar la salud de manera natural y profunda.</p>
      <p class="therapy-highlight">✨ ¿Sabías que muchas de estas prácticas se han transmitido de generación en generación, conectando la medicina con la naturaleza y la intuición femenina?</p>
    `
  },
  {
    id: 'hidroterapia',
    title: 'Hidroterapia',
    subtitle: 'Terapia con agua',
    emoji: '💧',
    content: `
      <p>La hidroterapia utiliza el agua como herramienta terapéutica a través de baños, compresas, duchas frías y técnicas de contraste.</p>
      <p>Estas prácticas ayudan a:</p>
      <ul class="therapy-list">
        <li>🔹 Mejorar la circulación</li>
        <li>🔹 Favorecer la digestión</li>
        <li>🔹 Regular la respuesta nerviosa del cuerpo</li>
      </ul>
      <p class="therapy-highlight">✨ Explora cómo el agua, en sus distintas formas, puede convertirse en un aliado natural para tu bienestar físico y emocional.</p>
    `
  },
  {
    id: 'biomagnetismo',
    title: 'Biomagnetismo',
    subtitle: 'Médico, Emocional y Energético',
    emoji: '🧲',
    content: `
      <p>El Biomagnetismo Médico es una terapia alternativa que aplica imanes en pares sobre puntos específicos del cuerpo para:</p>
      <ul class="therapy-list">
        <li>Restablecer el equilibrio del pH</li>
        <li>Desinflamar órganos</li>
        <li>Eliminar virus, bacterias o parásitos</li>
        <li>Liberar memorias emocionales</li>
      </ul>
      <p>Además, se extiende al biomagnetismo emocional y energético, ayudando a desbloquear emociones retenidas, armonizar la energía del cuerpo y restablecer el bienestar integral.</p>
      <h4>📜 Breve historia</h4>
      <p>Aunque el uso de imanes con fines terapéuticos se remonta a civilizaciones antiguas como China, fue el Dr. Isaac Goiz Durán, en 1988, quien descubrió el Par Biomagnético. Este hallazgo permitió tratar no solo desequilibrios físicos, sino también emocionales y energéticos, integrando cuerpo, mente y espíritu.</p>
      <p class="therapy-highlight">✨ Esta técnica combina ciencia y energía, ofreciendo una herramienta poderosa para limpiar, reequilibrar y sanar de manera profunda.</p>
    `
  },
  {
    id: 'ginecologia',
    title: 'Ginecología Natural',
    subtitle: 'y Terapia Menstrual',
    emoji: '🌸',
    content: `
      <p>La Ginecología Natural es un enfoque integral que acompaña a las mujeres en todas las etapas de su ciclo vital: desde la menarquía (inicio de la menstruación), pasando por el ciclo fértil, el posparto y el climaterio. Este enfoque promueve la autonomía femenina sobre la salud ginecológica, recuperando saberes ancestrales y prácticas naturales.</p>
      <h4>🌿 Herramientas y prácticas utilizadas:</h4>
      <ul class="therapy-list">
        <li><strong>Plantas medicinales:</strong> Infusiones y preparados que apoyan el equilibrio hormonal y alivian molestias menstruales.</li>
        <li><strong>Observación del ciclo menstrual:</strong> Registro y análisis de las fases del ciclo para comprender y atender las necesidades del cuerpo.</li>
        <li><strong>Vaporizaciones uterinas:</strong> Uso de vapores herbales para tonificar y limpiar el útero.</li>
        <li><strong>Masajes abdominales:</strong> Técnicas que estimulan la circulación y alivian tensiones en la zona pélvica.</li>
        <li><strong>Conocimiento del útero como centro de poder:</strong> Reconocimiento del útero como fuente de sabiduría y energía femenina.</li>
        <li><strong>Desintoxicación uterina:</strong> inspirada en la ginecología natural, se realiza mediante vaporizaciones con hierbas, masajes suaves y gotas específicas, ayudando a liberar toxinas físicas y energéticas, tonificar el útero y reconectar con su poder.</li>
      </ul>
      <h4>📚 Fuentes de conocimiento:</h4>
      <ul class="therapy-list">
        <li><em>Manual de Ginecología Natural para Mujeres</em> de Rina Nissim</li>
        <li><em>Manual Introductorio a la Ginecología Natural</em> de Pabla Pérez San Martín</li>
      </ul>
    `
  },
  {
    id: 'auriculoterapia',
    title: 'Auriculoterapia',
    subtitle: 'Estimulación de puntos reflejos',
    emoji: '👂',
    content: `
      <p>La auriculoterapia es una técnica que se centra en la estimulación de puntos reflejos en la oreja para tratar dolencias físicas y emocionales.</p>
      <p>Se utilizan diferentes herramientas como:</p>
      <ul class="therapy-list">
        <li>🌿 Semillas</li>
        <li>🧲 Imanes</li>
        <li>🪡 Agujas</li>
      </ul>
      <p>Estas prácticas ayudan a equilibrar órganos, regular emociones y aliviar dolores crónicos, aprovechando la conexión del oído con todo el cuerpo según los principios de la medicina reflexológica.</p>
      <p class="therapy-highlight">✨ ¿Sabías que cada punto de la oreja refleja un órgano o sistema del cuerpo? Aprender a estimularlos puede convertirse en una poderosa herramienta de autocuidado.</p>
    `
  }
];

export default therapiesData;
