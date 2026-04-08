// Tabela periódica completa — 118 elementos
// Categorias: metal-alcalino, metal-alcalino-terroso, metal-transicao, metal-pos-transicao,
//   semimetal, nao-metal, halogeno, gas-nobre, lantanideo, actinideo

export interface Elemento {
  numero: number
  simbolo: string
  nome: string
  massa: number          // u.m.a.
  categoria: string
  periodo: number
  grupo: number | null   // null para lantanídeos/actinídeos
  config: string         // configuração eletrônica abreviada
  eletroneg?: number     // Pauling
  fusao?: number         // °C
  ebulicao?: number      // °C
  densidade?: number     // g/cm³ (ou g/L para gases)
  descoberto: string     // ano ou "Antigo"
  cor: string            // hex para UI
  descricao: string
  usos: string[]
}

type E = [
  number, string, string, number, string, number, number|null, string,
  number|undefined, number|undefined, number|undefined, number|undefined, string, string, string, string[]
]

const RAW: E[] = [
  [1,'H','Hidrogênio',1.008,'nao-metal',1,1,'1s¹',2.20,-259,-253,0.00009,'1766','#74b9ff','O elemento mais abundante do universo. Compõe a água e os combustíveis. Extremamente inflamável.',['Células de combustível','Amônia industrial','Refino de petróleo','Foguetes (combustível líquido)']],
  [2,'He','Hélio',4.003,'gas-nobre',1,18,'1s²',undefined,-272,-269,0.00018,'1868','#a29bfe','Segundo elemento mais abundante do universo. Inerte, leve e não inflamável.',['Balões e dirigíveis','Mergulho (mistura respiratória)','Resfriamento de magnetos (MRI)','Lasers de hélio-neon']],
  [3,'Li','Lítio',6.941,'metal-alcalino',2,1,'[He] 2s¹',0.98,180,1342,0.534,'1817','#fd79a8','O metal sólido mais leve. Reage vigorosamente com água. Essencial para baterias recarregáveis.',['Baterias de íon-lítio','Medicamento para bipolaridade','Ligas leves','Vidros e cerâmicas especiais']],
  [4,'Be','Berílio',9.012,'metal-alcalino-terroso',2,2,'[He] 2s²',1.57,1287,2470,1.85,'1798','#00b894','Metal muito leve e rígido. Tóxico. Bom condutor de calor e eletricidade.',['Janelas de raios-X','Ligas com cobre','Aeronaves e foguetes','Componentes nucleares']],
  [5,'B','Boro',10.811,'semimetal',2,13,'[He] 2s² 2p¹',2.04,2076,3927,2.34,'1808','#6c5ce7','Semimetal duro e refratário. Ocorre naturalmente como bórax.',['Borax (detergentes)','Vidros borossilicato (Pyrex)','Ácido bórico (antisséptico)','Semicondutores dopantes']],
  [6,'C','Carbono',12.011,'nao-metal',2,14,'[He] 2s² 2p²',2.55,3550,4827,2.267,'Antigo','#2d3436','Base da química orgânica. Existe como diamante, grafite, fulerenos e nanotubos.',['Combustíveis fósseis','Plásticos e polímeros','Fibra de carbono','Diamantes industriais']],
  [7,'N','Nitrogênio',14.007,'nao-metal',2,15,'[He] 2s² 2p³',3.04,-210,-196,0.00125,'1772','#00cec9','Compõe 78% da atmosfera. Essencial para proteínas e ácidos nucleicos.',['Fertilizantes (amônia, ureia)','Atmosfera inerte industrial','Criogenia (N₂ líquido)','Explosivos (TNT, nitroglicerina)']],
  [8,'O','Oxigênio',15.999,'nao-metal',2,16,'[He] 2s² 2p⁴',3.44,-218,-183,0.00143,'1771','#0984e3','Compõe 21% da atmosfera. Essencial para a respiração e combustão.',['Respiração médica','Siderurgia (oxigênio industrial)','Tratamento de água','Propelentes de foguete']],
  [9,'F','Flúor',18.998,'halogeno',2,17,'[He] 2s² 2p⁵',3.98,-220,-188,0.0017,'1886','#fd9644','O elemento mais eletronegativamente ativo. Extremamente reativo e corrosivo.',['Pasta de dente (fluoreto)','Teflon (PTFE)','Freons e refrigerantes','Enriquecimento de urânio']],
  [10,'Ne','Neônio',20.180,'gas-nobre',2,18,'[He] 2s² 2p⁶',undefined,-249,-246,0.0009,'1898','#a29bfe','Gás nobre inerte. Produz luz laranja-avermelhada característica.',['Letreiros luminosos','Lasers de neônio','Indicadores de alta tensão','Mistura de gases criogênicos']],
  [11,'Na','Sódio',22.990,'metal-alcalino',3,1,'[Ne] 3s¹',0.93,98,883,0.971,'1807','#fd79a8','Metal muito reativo que explode em contato com água. Essencial para o organismo.',['Sal de cozinha (NaCl)','Soda cáustica (NaOH)','Lâmpadas de vapor','Reações nucleares']],
  [12,'Mg','Magnésio',24.305,'metal-alcalino-terroso',3,2,'[Ne] 3s²',1.31,650,1090,1.738,'1808','#00b894','Metal leve e estrutural. Quarto mineral mais abundante no corpo humano.',['Ligas leves (avião, carro)','Fogos de artifício','Suplemento alimentar','Antiacido (leite de magnésia)']],
  [13,'Al','Alumínio',26.982,'metal-pos-transicao',3,13,'[Ne] 3s² 3p¹',1.61,660,2519,2.7,'1825','#b2bec3','Metal mais abundante na crosta terrestre. Leve, resistente à corrosão e reciclável.',['Embalagens e latas','Construção civil','Aviação e automotivo','Linhas de transmissão']],
  [14,'Si','Silício',28.086,'semimetal',3,14,'[Ne] 3s² 3p²',1.90,1414,3265,2.33,'1824','#6c5ce7','Base da eletrônica moderna. Segundo elemento mais abundante da crosta terrestre.',['Chips e transistores','Painéis solares','Vidro e cimento','Silicone']],
  [15,'P','Fósforo',30.974,'nao-metal',3,15,'[Ne] 3s² 3p³',2.19,44,281,1.82,'1669','#e17055','Essencial para DNA, RNA e ATP. Existe em formas branca, vermelha e negra.',['Fertilizantes','Fósforos de segurança','Detergentes','Defensivos agrícolas']],
  [16,'S','Enxofre',32.065,'nao-metal',3,16,'[Ne] 3s² 3p⁴',2.58,113,445,2.067,'Antigo','#fdcb6e','Sólido amarelo cristalino. Essencial para aminoácidos cisteína e metionina.',['Ácido sulfúrico (H₂SO₄)','Vulcanização da borracha','Fungicidas e pesticidas','Pólvora negra']],
  [17,'Cl','Cloro',35.453,'halogeno',3,17,'[Ne] 3s² 3p⁵',3.16,-101,-34,0.00321,'1774','#fd9644','Gás amarelo-esverdeado muito reativo. Excelente desinfetante.',['Tratamento de água','PVC e plásticos clorados','Produtos de limpeza','Síntese de cloro-orgânicos']],
  [18,'Ar','Argônio',39.948,'gas-nobre',3,18,'[Ne] 3s² 3p⁶',undefined,-189,-186,0.00178,'1894','#a29bfe','Terceiro gás mais abundante na atmosfera. Completamente inerte.',['Proteção em soldagem (MIG/TIG)','Lâmpadas incandescentes','Vidros duplos (isolamento)','Atmosfera inerte laboratorial']],
  [19,'K','Potássio',39.098,'metal-alcalino',4,1,'[Ar] 4s¹',0.82,63,759,0.862,'1807','#fd79a8','Metal macio e reativo. Essencial para o funcionamento celular e cardíaco.',['Fertilizantes (KCl)','Sal de baixo sódio (KCl)','Hidróxido de potássio (KOH)','Nitrato de potássio (pólvora)']],
  [20,'Ca','Cálcio',40.078,'metal-alcalino-terroso',4,2,'[Ar] 4s²',1.00,842,1484,1.55,'1808','#00b894','Metal essencial para ossos e dentes. Quinto elemento mais abundante da crosta.',['Cimento e concreto','Suplementos de cálcio','Cal (CaO) na construção','Tratamento de água']],
  [21,'Sc','Escândio',44.956,'metal-transicao',4,3,'[Ar] 3d¹ 4s²',1.36,1541,2836,2.985,'1879','#81ecec','Metal de transição raro. Usado em ligas leves de alto desempenho.',['Ligas de alumínio-escândio','Lâmpadas de halogênio metálico','Lasers de estado sólido','Rastreamento radioativo (Sc-46)']],
  [22,'Ti','Titânio',47.867,'metal-transicao',4,4,'[Ar] 3d² 4s²',1.54,1668,3287,4.507,'1791','#81ecec','Metal leve, resistente e biocompatível. Alta relação resistência/peso.',['Implantes médicos e dentários','Aviação e aeroespacial','Próteses','Pigmento branco (TiO₂)']],
  [23,'V','Vanádio',50.942,'metal-transicao',4,5,'[Ar] 3d³ 4s²',1.63,1910,3407,6.11,'1801','#81ecec','Metal de transição duro. Melhora a dureza do aço.',['Aços especiais','Catalisadores','Baterias de fluxo de vanádio','Liga para ferramentas de corte']],
  [24,'Cr','Cromo',51.996,'metal-transicao',4,6,'[Ar] 3d⁵ 4s¹',1.66,1907,2671,7.19,'1798','#81ecec','Metal duro e brilhante. Confere resistência à corrosão ao aço inoxidável.',['Aço inoxidável','Cromagem','Pigmentos (verde e amarelo de cromo)','Curtimento de couro']],
  [25,'Mn','Manganês',54.938,'metal-transicao',4,7,'[Ar] 3d⁵ 4s²',1.55,1246,2061,7.21,'1774','#81ecec','Metal essencial para a produção de aço. Importante em biologia (antioxidante).',['Aço manganês (resistente ao impacto)','Baterias alcalinas (MnO₂)','Pigmentos','Fertilizante micronutriente']],
  [26,'Fe','Ferro',55.845,'metal-transicao',4,8,'[Ar] 3d⁶ 4s²',1.83,1538,2861,7.874,'Antigo','#81ecec','O metal mais usado pela humanidade. Essencial para hemoglobina.',['Aço (construção civil e automotivo)','Hemoglobina (transporte de O₂)','Imãs','Catalisadores de Haber-Bosch']],
  [27,'Co','Cobalto',58.933,'metal-transicao',4,9,'[Ar] 3d⁷ 4s²',1.88,1495,2927,8.9,'1735','#81ecec','Metal de transição magnético. Presente na vitamina B12.',['Baterias de lítio-cobalto','Superligas para turbinas','Pigmentos azuis','Vitamina B12']],
  [28,'Ni','Níquel',58.693,'metal-transicao',4,10,'[Ar] 3d⁸ 4s²',1.91,1455,2913,8.908,'1751','#81ecec','Metal resistente à corrosão. Amplamente usado em ligas e baterias.',['Aço inoxidável','Baterias NiMH e NiCd','Moedas','Catalisadores']],
  [29,'Cu','Cobre',63.546,'metal-transicao',4,11,'[Ar] 3d¹⁰ 4s¹',1.90,1085,2562,8.96,'Antigo','#81ecec','Excelente condutor elétrico e térmico. Antimicrobiano natural.',['Fios elétricos','Encanamentos','Moedas e ligas (bronze, latão)','Motores elétricos']],
  [30,'Zn','Zinco',65.38,'metal-transicao',4,12,'[Ar] 3d¹⁰ 4s²',1.65,420,907,7.134,'Antigo','#81ecec','Metal essencial para o sistema imunológico e cicatrização.',['Galvanização do aço','Ligas (latão)','Suplemento nutricional','Pilhas secas (Zn-MnO₂)']],
  [31,'Ga','Gálio',69.723,'metal-pos-transicao',4,13,'[Ar] 3d¹⁰ 4s² 4p¹',1.81,30,2229,5.91,'1875','#b2bec3','Metal que derrete na mão (ponto de fusão 29,8°C). Essencial em semicondutores.',['LEDs (GaN)','Células solares de alta eficiência','Termômetros','Semicondutores de nitreto']],
  [32,'Ge','Germânio',72.630,'semimetal',4,14,'[Ar] 3d¹⁰ 4s² 4p²',2.01,938,2833,5.323,'1886','#6c5ce7','Semimetal previsto por Mendeleev. Essencial em fibras ópticas e semicondutores.',['Fibras ópticas','Câmeras infravermelhas','Transistores','Catalisadores PET']],
  [33,'As','Arsênio',74.922,'semimetal',4,15,'[Ar] 3d¹⁰ 4s² 4p³',2.18,817,614,5.727,'Antigo','#6c5ce7','Semimetal tóxico. Usado em semicondutores e pesticidas historicamente.',['Semicondutor GaAs','Vidros especiais','Pesticidas (uso histórico)','Ligas endurecedoras de chumbo']],
  [34,'Se','Selênio',78.971,'nao-metal',4,16,'[Ar] 3d¹⁰ 4s² 4p⁴',2.55,221,685,4.81,'1817','#00cec9','Micronutriente essencial. Propriedades fotocondutoras importantes.',['Células fotovoltaicas','Copiadoras (tambor fotossensível)','Suplemento antioxidante','Pigmento vermelho em vidros']],
  [35,'Br','Bromo',79.904,'halogeno',4,17,'[Ar] 3d¹⁰ 4s² 4p⁵',2.96,-7,59,3.12,'1826','#fd9644','Único não-metal líquido à temperatura ambiente. Odor pungente.',['Retardantes de chama','Agrotóxicos','Medicamentos sedativos (histórico)','Fotografia (brometo de prata)']],
  [36,'Kr','Criptônio',83.798,'gas-nobre',4,18,'[Ar] 3d¹⁰ 4s² 4p⁶',undefined,-157,-153,0.00375,'1898','#a29bfe','Gás nobre raro. Usado em lasers e iluminação especial.',['Lasers de criptônio','Lâmpadas de alta intensidade','Janelas de isolamento termoacústico','Padrão de comprimento (Kr-86)']],
  [37,'Rb','Rubídio',85.468,'metal-alcalino',5,1,'[Kr] 5s¹',0.82,39,688,1.532,'1861','#fd79a8','Metal alcalino muito reativo. Aplicações em eletrônica de precisão.',['Relógios atômicos','Células fotoelétricas','Propulsão iônica espacial','Pesquisa de condensados BEC']],
  [38,'Sr','Estrôncio',87.62,'metal-alcalino-terroso',5,2,'[Kr] 5s²',0.95,777,1382,2.64,'1790','#00b894','Metal alcalino-terroso. Sr-90 é produto perigoso de fissão nuclear.',['Fogos de artifício (chama vermelha)','Imãs de ferrita','Tratamento de câncer ósseo (Sr-89)','Tubos de raios catódicos (CRT)']],
  [39,'Y','Ítrio',88.906,'metal-transicao',5,3,'[Kr] 4d¹ 5s²',1.22,1526,3336,4.472,'1794','#81ecec','Metal de transição. Essencial para lasers YAG e supercondutores.',['Lasers YAG (cirurgia, indústria)','Fosfores de TV e monitores','Supercondutores de alta temperatura','Ligas para imãs permanentes']],
  [40,'Zr','Zircônio',91.224,'metal-transicao',5,4,'[Kr] 4d² 5s²',1.33,1855,4409,6.52,'1789','#81ecec','Metal resistente à corrosão e biocompatível. Núcleos de reatores nucleares.',['Revestimento de varetas de combustível nuclear','Implantes dentários (zircônia)','Joias (zircônia cúbica)','Cerâmicas de alto desempenho']],
  [41,'Nb','Nióbio',92.906,'metal-transicao',5,5,'[Kr] 4d⁴ 5s¹',1.6,2477,4744,8.57,'1801','#81ecec','O Brasil é o maior produtor mundial de nióbio. Metal estratégico para aço.',['Aços microligados (construção e automotivo)','Imãs supercondutores (MRI, aceleradores)','Ligas para aviação','Capacitores eletrolíticos']],
  [42,'Mo','Molibdênio',95.96,'metal-transicao',5,6,'[Kr] 4d⁵ 5s¹',2.16,2623,4639,10.28,'1778','#81ecec','Metal de alto ponto de fusão. Melhora resistência e dureza do aço.',['Aços especiais para ferramentas','Lubrificante sólido (MoS₂)','Eletrodos em fornos de arco','Catalisadores (refino de petróleo)']],
  [43,'Tc','Tecnécio',98,'metal-transicao',5,7,'[Kr] 4d⁵ 5s²',1.9,2157,4265,11.5,'1937','#81ecec','Primeiro elemento produzido artificialmente. Tc-99m é o radioisótopo médico mais usado.',['Diagnóstico por imagem nuclear (Tc-99m)','Proteção anticorrosão (pesquisa)','Rastreamento metabólico']],
  [44,'Ru','Rutênio',101.07,'metal-transicao',5,8,'[Kr] 4d⁷ 5s¹',2.2,2334,4150,12.45,'1844','#81ecec','Metal do grupo da platina. Melhora a dureza de ligas de platina e paládio.',['Contatos elétricos resistentes','Catalisadores','Resistores de filme fino','Células solares Gratzel']],
  [45,'Rh','Ródio',102.906,'metal-transicao',5,9,'[Kr] 4d⁸ 5s¹',2.28,1964,3695,12.41,'1803','#81ecec','Um dos metais mais caros do mundo. Essencial para catalisadores automotivos.',['Catalisadores de conversor catalítico','Eletrodos de platina-ródio (termopares)','Revestimento decorativo','Catalisadores industriais']],
  [46,'Pd','Paládio',106.42,'metal-transicao',5,10,'[Kr] 4d¹⁰',2.20,1555,2963,12.023,'1803','#81ecec','Metal precioso com capacidade única de absorver hidrogênio.',['Conversores catalíticos (veículos)','Eletrônica (conectores, capacitores)','Joias (ouro branco)','Purificação de hidrogênio']],
  [47,'Ag','Prata',107.868,'metal-transicao',5,11,'[Kr] 4d¹⁰ 5s¹',1.93,962,2162,10.49,'Antigo','#81ecec','Melhor condutor elétrico e térmico entre os metais. Propriedades antimicrobianas.',['Joias e talheres','Eletrônica (contatos, pastas condutoras)','Fotografia (brometo de prata)','Biocida antimicrobiano']],
  [48,'Cd','Cádmio',112.411,'metal-transicao',5,12,'[Kr] 4d¹⁰ 5s²',1.69,321,767,8.65,'1817','#81ecec','Metal tóxico. Usado em baterias recarregáveis e pigmentos.',['Baterias NiCd','Pigmentos amarelo/vermelho','Estabilizadores de PVC','Células solares CdTe']],
  [49,'In','Índio',114.818,'metal-pos-transicao',5,13,'[Kr] 4d¹⁰ 5s² 5p¹',1.78,157,2072,7.31,'1863','#b2bec3','Metal macio. Essencial para telas touchscreen modernas.',['ITO (telas touchscreen e displays)','Soldas de baixo ponto de fusão','Revestimentos anticorrosão','Semicondutores compostos (InP)']],
  [50,'Sn','Estanho',118.710,'metal-pos-transicao',5,14,'[Kr] 4d¹⁰ 5s² 5p²',1.96,232,2602,7.287,'Antigo','#b2bec3','Metal macio com ponto de fusão baixo. Usado há milênios em ligas.',['Latas de alimentos (estanhagem)','Solda eletrônica','Bronze (liga Cu-Sn)','Revestimentos anticorrosão']],
  [51,'Sb','Antimônio',121.760,'semimetal',5,15,'[Kr] 4d¹⁰ 5s² 5p³',2.05,631,1587,6.697,'Antigo','#6c5ce7','Semimetal quebradiço. Aumenta a dureza de ligas de chumbo.',['Retardantes de chama','Baterias de chumbo-ácido (liga)','Pigmentos','Semicondutores (InSb)']],
  [52,'Te','Telúrio',127.60,'semimetal',5,16,'[Kr] 4d¹⁰ 5s² 5p⁴',2.1,450,988,6.24,'1782','#6c5ce7','Semimetal raro. Importante para células solares modernas.',['Células solares CdTe','Ligas de aço e cobre','Óptica infravermelha','Memórias de mudança de fase (HDD)']],
  [53,'I','Iodo',126.904,'halogeno',5,17,'[Kr] 4d¹⁰ 5s² 5p⁵',2.66,114,184,4.93,'1811','#fd9644','Micronutriente essencial para a tireoide. Único halogênio sólido à temp. ambiente.',['Sal iodado (prevenção de bócio)','Antissépticos (tintura de iodo)','Contrastes em radiologia','Catalisadores']],
  [54,'Xe','Xenônio',131.293,'gas-nobre',5,18,'[Kr] 4d¹⁰ 5s² 5p⁶',2.6,-112,-108,0.00589,'1898','#a29bfe','Gás nobre denso. Produz luz azul-branca intensa.',['Lâmpadas de xenônio (faróis, projetores)','Anestésico (xenônio medicinal)','Propulsão iônica de satélites','Detectores de nêutrons']],
  [55,'Cs','Césio',132.905,'metal-alcalino',6,1,'[Xe] 6s¹',0.79,29,671,1.873,'1860','#fd79a8','Metal mais reativo. Cs-133 define o segundo no SI (relógio atômico).',['Relógios atômicos (padrão de tempo)','Células fotoelétricas','Propulsão iônica','Equipamentos de perfuração de poços']],
  [56,'Ba','Bário',137.327,'metal-alcalino-terroso',6,2,'[Xe] 6s²',0.89,727,1897,3.594,'1808','#00b894','Metal alcalino-terroso denso. BaSO₄ é usado em exames de raios-X.',['Contraste em exames de raios-X (BaSO₄)','Fogos de artifício (chama verde)','Vidros especiais','Tratamento de água']],
  [57,'La','Lantânio',138.905,'lantanideo',6,null,'[Xe] 5d¹ 6s²',1.10,920,3464,6.162,'1839','#fdcb6e','Primeiro lantanídeo. Essencial em óptica e catálise.',['Óptica de alta qualidade (lentes de câmera)','Catalisadores de craqueamento','Baterias NiMH','Eletrodos de arco para iluminação']],
  [58,'Ce','Cério',140.116,'lantanideo',6,null,'[Xe] 4f¹ 5d¹ 6s²',1.12,798,3360,6.77,'1803','#fdcb6e','Lantanídeo mais abundante. Propriedades catalíticas notáveis.',['Catalisadores automotivos (Ce-oxidante)','Polimento de vidro (CeO₂)','Isqueiros (liga com Fe)','Células de combustível de óxido sólido']],
  [59,'Pr','Praseodímio',140.908,'lantanideo',6,null,'[Xe] 4f³ 6s²',1.13,931,3290,6.773,'1885','#fdcb6e','Lantanídeo de cor verde. Imãs de praseodímio-neodímio são muito fortes.',['Imãs permanentes de alta resistência','Filtros de vidro para soldagem','Óculos de proteção para soldadores','Turbinas eólicas']],
  [60,'Nd','Neodímio',144.242,'lantanideo',6,null,'[Xe] 4f⁴ 6s²',1.14,1016,3074,7.007,'1885','#fdcb6e','Produz os imãs permanentes mais fortes conhecidos (NdFeB).',['Imãs de neodímio (motores elétricos, HDs)','Lasers Nd:YAG','Alto-falantes e fones de ouvido','Turbinas eólicas e veículos elétricos']],
  [61,'Pm','Promécio',145,'lantanideo',6,null,'[Xe] 4f⁵ 6s²',undefined,1042,3000,7.26,'1945','#fdcb6e','Único lantanídeo sem isótopos estáveis. Radioativo.',['Baterias nucleares (marca-passo histórico)','Pinturas luminosas (histórico)','Fonte de raios-X portátil']],
  [62,'Sm','Samário',150.36,'lantanideo',6,null,'[Xe] 4f⁶ 6s²',1.17,1074,1794,7.52,'1879','#fdcb6e','Imãs de samário-cobalto têm excelente resistência à alta temperatura.',['Imãs SmCo (turbinas, motores)','Lasers de estado sólido','Tratamento de câncer (Sm-153)','Catalisadores']],
  [63,'Eu','Európio',151.964,'lantanideo',6,null,'[Xe] 4f⁷ 6s²',undefined,822,1529,5.243,'1901','#fdcb6e','Lantanídeo mais reativo. Fosfores de európio produzem cores vivas.',['Fosfores vermelhos e azuis (TVs, monitores)','Selos de autenticidade em notas (fluorescência)','Lâmpadas fluorescentes compactas','Lasers']],
  [64,'Gd','Gadolínio',157.25,'lantanideo',6,null,'[Xe] 4f⁷ 5d¹ 6s²',1.20,1313,3273,7.895,'1880','#fdcb6e','Excelente propriedades magnéticas. Contraste em ressonância magnética.',['Contraste MRI (quelatos de Gd)','Blindagem de nêutrons em reatores','Imãs magnetocalóricos (refrigeração)','Fosfores']],
  [65,'Tb','Térbio',158.925,'lantanideo',6,null,'[Xe] 4f⁹ 6s²',undefined,1356,3230,8.229,'1843','#fdcb6e','Lantanídeo verde-fluorescente. Essencial em displays de alta eficiência.',['LEDs verdes e fosfores','Atuadores magnetostritivos','Imãs de alta temperatura','Discos magneto-ópticos']],
  [66,'Dy','Disprósio',162.500,'lantanideo',6,null,'[Xe] 4f¹⁰ 6s²',1.22,1407,2567,8.55,'1886','#fdcb6e','Adicionado ao neodímio para manter a força magnética em alta temperatura.',['Imãs NdFeB de alta temperatura','Dosimetria de radiação','Discos rígidos','Veículos elétricos']],
  [67,'Ho','Hólmio',164.930,'lantanideo',6,null,'[Xe] 4f¹¹ 6s²',1.23,1461,2720,8.795,'1879','#fdcb6e','Maior momento magnético de qualquer elemento. Lasers médicos de hólmio.',['Lasers Ho:YAG (cirurgia urológica)','Imãs supercondutores','Espectroscopia']],
  [68,'Er','Érbio',167.259,'lantanideo',6,null,'[Xe] 4f¹² 6s²',1.24,1529,2868,9.066,'1842','#fdcb6e','Essencial para amplificadores de fibra óptica que sustentam a internet global.',['Amplificadores de fibra óptica (EDFA)','Lasers Er:YAG (dermatologia)','Vidros coloridos rosa','Energia nuclear']],
  [69,'Tm','Túlio',168.934,'lantanideo',6,null,'[Xe] 4f¹³ 6s²',1.25,1545,1950,9.321,'1879','#fdcb6e','Lantanídeo mais raro e caro. Lasers de túlio são usados em medicina.',['Lasers de túlio (urologia, pneumologia)','Fosfores','Fontes portáteis de raios-X']],
  [70,'Yb','Itérbio',173.054,'lantanideo',6,null,'[Xe] 4f¹⁴ 6s²',undefined,824,1196,6.965,'1878','#fdcb6e','Lantanídeo macio. Lasers de íterbio são muito eficientes.',['Lasers de fibra de íterbio','Relógios ópticos atômicos','Estresses em aço (ligas)','Amplificadores a laser']],
  [71,'Lu','Lutécio',174.967,'lantanideo',6,null,'[Xe] 4f¹⁴ 5d¹ 6s²',1.27,1663,3402,9.841,'1907','#fdcb6e','Lantanídeo mais denso e duro. Usado em catalisadores e medicina nuclear.',['Detectores de PET (Lu₂SiO₅)','Catalisadores de craqueamento','Terapia de radionuclídeos (Lu-177)','Relógios atômicos']],
  [72,'Hf','Háfnio',178.49,'metal-transicao',6,4,'[Xe] 4f¹⁴ 5d² 6s²',1.3,2233,4603,13.31,'1923','#81ecec','Metal de alto ponto de fusão. Absorve nêutrons — barras de controle de reatores.',['Barras de controle de reatores nucleares','Dielétrico em chips (HfO₂)','Ligas para turbinas (superligas)','Eletrodos de plasma']],
  [73,'Ta','Tântalo',180.948,'metal-transicao',6,5,'[Xe] 4f¹⁴ 5d³ 6s²',1.5,3017,5458,16.69,'1802','#81ecec','Metal extremamente resistente à corrosão. Biocompatível.',['Capacitores de tântalo (eletrônica)','Implantes cirúrgicos','Superligas para aviação','Equipamentos químicos resistentes a ácidos']],
  [74,'W','Tungstênio',183.84,'metal-transicao',6,6,'[Xe] 4f¹⁴ 5d⁴ 6s²',2.36,3422,5555,19.25,'1783','#81ecec','Maior ponto de fusão de todos os metais. Filamento de lâmpadas incandescentes.',['Filamentos de lâmpadas','Brocas e ferramentas de corte (carboneto de W)','Blindagem contra radiação','Eletrodos de soldagem TIG']],
  [75,'Re','Rênio',186.207,'metal-transicao',6,7,'[Xe] 4f¹⁴ 5d⁵ 6s²',1.9,3186,5596,21.02,'1925','#81ecec','Metal muito raro e de altíssimo ponto de fusão. Essencial em turbinas a jato.',['Superligas para turbinas a jato','Catalisadores de reforma catalítica (petróleo)','Filamentos de tungstênio-rênio','Termopares de alta temperatura']],
  [76,'Os','Ósmio',190.23,'metal-transicao',6,8,'[Xe] 4f¹⁴ 5d⁶ 6s²',2.2,3033,5012,22.59,'1803','#81ecec','Elemento mais denso naturalmente. Ligas extremamente duras.',['Pontas de canetas esferográficas','Agulhas de fonógrafo','Contatos elétricos de precisão','Catalisadores']],
  [77,'Ir','Irídio',192.217,'metal-transicao',6,9,'[Xe] 4f¹⁴ 5d⁷ 6s²',2.20,2446,4428,22.56,'1803','#81ecec','Segundo metal mais denso. Extremamente resistente à corrosão.',['Padrão de 1 kg (liga Pt-Ir)','Plugues de vela (liga Ir)','Implantes médicos','Catalisadores de alto desempenho']],
  [78,'Pt','Platina',195.084,'metal-transicao',6,10,'[Xe] 4f¹⁴ 5d⁹ 6s¹',2.28,1768,3825,21.45,'Antigo','#81ecec','Metal precioso, nobre e biocompatível. Catalisador universal.',['Joias','Catalisadores (conversores e células de combustível)','Eletrodos médicos','Termopares de precisão']],
  [79,'Au','Ouro',196.967,'metal-transicao',6,11,'[Xe] 4f¹⁴ 5d¹⁰ 6s¹',2.54,1064,2856,19.32,'Antigo','#fdcb6e','Metal precioso mais famoso. Excelente condutor e resistente à corrosão.',['Joias e moedas','Conectores eletrônicos de alta confiabilidade','Nanopartículas para diagnóstico médico','Espaçonaves (proteção contra radiação)']],
  [80,'Hg','Mercúrio',200.59,'metal-transicao',6,12,'[Xe] 4f¹⁴ 5d¹⁰ 6s²',2.0,-39,357,13.534,'Antigo','#81ecec','Único metal líquido à temperatura ambiente. Altamente tóxico.',['Termômetros (em declínio)','Lâmpadas fluorescentes','Amálgamas dentárias (histórico)','Pilas de mercúrio']],
  [81,'Tl','Tálio',204.383,'metal-pos-transicao',6,13,'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹',1.62,304,1473,11.85,'1861','#b2bec3','Metal tóxico. Cintiladores de iodeto de tálio usados em medicina nuclear.',['Detectores de radiação (cintiladores)','Semicondutores infravermelhos','Pesticidas (histórico, banido)','Supercondutores (ligas)']],
  [82,'Pb','Chumbo',207.2,'metal-pos-transicao',6,14,'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²',2.33,327,1749,11.34,'Antigo','#b2bec3','Metal denso e macio. Tóxico. Usado em baterias e blindagem contra radiação.',['Baterias de chumbo-ácido (automóveis)','Blindagem contra radiação-X','Chumbo de pesca e projéteis','Soldas (em declínio)']],
  [83,'Bi','Bismuto',208.980,'metal-pos-transicao',6,15,'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³',2.02,271,1564,9.807,'Antigo','#b2bec3','Metal não tóxico que substitui o chumbo. Expande ao solidificar.',['Bismuto subsalicilato (antiácido, Pepto-Bismol)','Liga Wood (ponto de fusão baixo)','Pigmentos nacarados','Catalisadores farmacêuticos']],
  [84,'Po','Polônio',209,'metal-pos-transicao',6,16,'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴',2.0,254,962,9.32,'1898','#b2bec3','Elemento altamente radioativo, descoberto por Marie Curie.',['Eliminadores de estática (industrial)','Fontes de nêutrons','Aquecedores em sondas espaciais (histórico)']],
  [85,'At','Astatínio',210,'halogeno',6,17,'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵',2.2,302,337,7,'1940','#fd9644','Halogênio radioativo. Um dos elementos mais raros na natureza.',['Radioterapia direcionada (At-211)','Pesquisa em física nuclear']],
  [86,'Rn','Radônio',222,'gas-nobre',6,18,'[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶',2.2,-71,-62,0.00973,'1900','#a29bfe','Gás nobre radioativo. Segundo principal causador de câncer de pulmão.',['Detecção de falhas geológicas','Dosimetria de radônio residencial','Tratamento de cânceres (radon-seed histórico)']],
  [87,'Fr','Frâncio',223,'metal-alcalino',7,1,'[Rn] 7s¹',0.7,27,677,1.87,'1939','#fd79a8','Metal alcalino mais instável. Meia-vida máxima de 22 minutos.',['Pesquisa científica fundamental','Estudo de estrutura atômica']],
  [88,'Ra','Rádio',226,'metal-alcalino-terroso',7,2,'[Rn] 7s²',0.9,700,1737,5.5,'1898','#00b894','Descoberto por Marie e Pierre Curie. Usado em radioterapia.',['Radioterapia (histórico)','Tintas luminosas (histórico, banido)','Pesquisa em física nuclear']],
  [89,'Ac','Actínio',227,'actinideo',7,null,'[Rn] 6d¹ 7s²',1.1,1050,3200,10.07,'1899','#fab1a0','Primeiro actinídeo. Radioativo. Precursor de outros actinídeos.',['Fonte de nêutrons','Gerador de Bi-213 (terapia)','Pesquisa em química de actinídeos']],
  [90,'Th','Tório',232.038,'actinideo',7,null,'[Rn] 6d² 7s²',1.3,1750,4788,11.72,'1829','#fab1a0','Actinídeo radioativo. Potencial combustível nuclear de ciclo do tório.',['Ligas de magnésio de alta resistência','Eletrodos de tungstênio-tório (TIG)','Potencial combustível nuclear','Catalisadores (óleos essenciais)']],
  [91,'Pa','Protactínio',231.036,'actinideo',7,null,'[Rn] 5f² 6d¹ 7s²',1.5,1568,4000,15.37,'1913','#fab1a0','Actinídeo radioativo. Intermediário na cadeia de decaimento do urânio.',['Pesquisa nuclear','Datação radiométrica']],
  [92,'U','Urânio',238.029,'actinideo',7,null,'[Rn] 5f³ 6d¹ 7s²',1.38,1135,4131,19.05,'1789','#fab1a0','Combustível primário da energia nuclear. Naturalmente radioativo.',['Combustível nuclear (U-235 enriquecido)','Munição de penetração (U depletado)','Datação geológica (U-Pb)','Coloração de vidros histórica']],
  [93,'Np','Netúnio',237,'actinideo',7,null,'[Rn] 5f⁴ 6d¹ 7s²',1.36,644,4000,20.45,'1940','#fab1a0','Primeiro transurânio sintetizado. Precursor do plutônio.',['Detectores de nêutrons','Produção de Pu-238 (geradores termoelétricos espaciais)','Pesquisa nuclear']],
  [94,'Pu','Plutônio',244,'actinideo',7,null,'[Rn] 5f⁶ 7s²',1.28,640,3228,19.86,'1940','#fab1a0','Combustível de armas nucleares e reatores. Extremamente tóxico.',['Armas nucleares (Pu-239)','Combustível nuclear MOX','Geradores termoelétricos de radioisótopos (RTG) em sondas espaciais','Marca-passos nucleares (histórico)']],
  [95,'Am','Amerício',243,'actinideo',7,null,'[Rn] 5f⁷ 7s²',1.3,1176,2011,13.67,'1944','#fab1a0','Actinídeo produzido em reatores. Presente em detectores de fumaça.',['Detectores de fumaça iônicos (Am-241)','Fontes de nêutrons','Pesquisa em medicina nuclear']],
  [96,'Cm','Cúrio',247,'actinideo',7,null,'[Rn] 5f⁷ 6d¹ 7s²',1.3,1345,3110,13.51,'1944','#fab1a0','Actinídeo sintetizado em honra a Marie e Pierre Curie.',['Geradores termoelétricos espaciais','Espectrômetros de raios-X em sondas (Mars Pathfinder)','Pesquisa nuclear']],
  [97,'Bk','Berquélio',247,'actinideo',7,null,'[Rn] 5f⁹ 7s²',1.3,986,2627,14.78,'1949','#fab1a0','Actinídeo sintetizado em homenagem a Berkeley (Califórnia).',['Pesquisa científica','Produção de elementos mais pesados (Cf)']],
  [98,'Cf','Califórnio',251,'actinideo',7,null,'[Rn] 5f¹⁰ 7s²',1.3,900,1470,15.1,'1950','#fab1a0','Um dos elementos mais caros do mundo. Emissor de nêutrons.',['Iniciador de reatores nucleares','Detecção de metais e ouro (análise de ativação)','Tratamento de câncer cervical','Detectores portáteis de nêutrons']],
  [99,'Es','Einstênio',252,'actinideo',7,null,'[Rn] 5f¹¹ 7s²',1.3,860,996,8.84,'1952','#fab1a0','Sintetizado em 1952 após teste de bomba de hidrogênio. Nomeado em honra a Einstein.',['Pesquisa em física nuclear','Síntese de elementos superpesados']],
  [100,'Fm','Férmio',257,'actinideo',7,null,'[Rn] 5f¹² 7s²',1.3,1527,undefined,9.7,'1952','#fab1a0','Sintetizado em honra a Enrico Fermi. Apenas nanogramas já foram produzidos.',['Pesquisa em física de partículas','Síntese de elementos transactinídeos']],
  [101,'Md','Mendelévio',258,'actinideo',7,null,'[Rn] 5f¹³ 7s²',1.3,827,undefined,10.3,'1955','#fab1a0','Nomeado em honra a Dmitri Mendeleev, criador da tabela periódica.',['Pesquisa científica fundamental']],
  [102,'No','Nobélio',259,'actinideo',7,null,'[Rn] 5f¹⁴ 7s²',1.3,827,undefined,9.9,'1958','#fab1a0','Nomeado em honra a Alfred Nobel. Meia-vida de apenas 58 minutos (No-259).',['Pesquisa em física nuclear de alta energia']],
  [103,'Lr','Laurêncio',262,'actinideo',7,null,'[Rn] 5f¹⁴ 7s² 7p¹',1.3,1627,undefined,undefined,'1961','#fab1a0','Último actinídeo. Nomeado em honra a Ernest Lawrence.',['Pesquisa em física de partículas']],
  [104,'Rf','Rutherfórdio',267,'metal-transicao',7,4,'[Rn] 5f¹⁴ 6d² 7s²',undefined,2100,5500,23.2,'1964','#81ecec','Primeiro transactinídeo. Meia-vida de 78 segundos. Estudado apenas em aceleradores.',['Pesquisa em física nuclear']],
  [105,'Db','Dúbnio',268,'metal-transicao',7,5,'[Rn] 5f¹⁴ 6d³ 7s²',undefined,undefined,undefined,29.3,'1968','#81ecec','Elemento superpesado. Nomeado em honra a Dubna (Rússia).',['Pesquisa em física de partículas']],
  [106,'Sg','Seabórgio',271,'metal-transicao',7,6,'[Rn] 5f¹⁴ 6d⁴ 7s²',undefined,undefined,undefined,35,'1974','#81ecec','Nomeado em honra a Glenn Seaborg. Meia-vida de segundos.',['Pesquisa em química de elementos superpesados']],
  [107,'Bh','Bóhrio',272,'metal-transicao',7,7,'[Rn] 5f¹⁴ 6d⁵ 7s²',undefined,undefined,undefined,37.1,'1981','#81ecec','Nomeado em honra a Niels Bohr. Produzido em aceleradores de partículas.',['Pesquisa em física nuclear']],
  [108,'Hs','Hássio',270,'metal-transicao',7,8,'[Rn] 5f¹⁴ 6d⁶ 7s²',undefined,undefined,undefined,40.7,'1984','#81ecec','Nomeado em honra ao estado alemão Hessen. Isótopo mais estável: Hs-269.',['Pesquisa em física de partículas']],
  [109,'Mt','Meitnério',278,'metal-transicao',7,9,'[Rn] 5f¹⁴ 6d⁷ 7s²',undefined,undefined,undefined,undefined,'1982','#81ecec','Nomeado em honra a Lise Meitner. Apenas uns poucos átomos já foram produzidos.',['Pesquisa em química relativística']],
  [110,'Ds','Darmstádtio',281,'metal-transicao',7,10,'[Rn] 5f¹⁴ 6d⁹ 7s¹',undefined,undefined,undefined,undefined,'1994','#81ecec','Nomeado em honra a Darmstadt, Alemanha. Meia-vida de microssegundos.',['Pesquisa em física nuclear']],
  [111,'Rg','Roentgênio',282,'metal-transicao',7,11,'[Rn] 5f¹⁴ 6d¹⁰ 7s¹',undefined,undefined,undefined,undefined,'1994','#81ecec','Nomeado em honra a Wilhelm Röntgen (raios-X). Extremamente instável.',['Pesquisa em física de elementos superpesados']],
  [112,'Cn','Copernício',285,'metal-transicao',7,12,'[Rn] 5f¹⁴ 6d¹⁰ 7s²',undefined,undefined,undefined,undefined,'1996','#81ecec','Nomeado em honra a Nicolau Copérnico. Pode ser gás à temperatura ambiente.',['Pesquisa em química relativística']],
  [113,'Nh','Nihônio',286,'metal-pos-transicao',7,13,'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹',undefined,undefined,undefined,undefined,'2004','#b2bec3','Primeiro elemento com nome japonês. Sintetizado no RIKEN (Japão).',['Pesquisa em física nuclear']],
  [114,'Fl','Fleróvio',289,'metal-pos-transicao',7,14,'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²',undefined,undefined,undefined,undefined,'1999','#b2bec3','Nomeado em honra ao Laboratório Flerov de Dubna. Pode ter propriedades de gás nobre.',['Pesquisa em química de elementos superpesados']],
  [115,'Mc','Moscóvio',290,'metal-pos-transicao',7,15,'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³',undefined,undefined,undefined,undefined,'2003','#b2bec3','Nomeado em honra à região de Moscou, Rússia.',['Pesquisa em física nuclear']],
  [116,'Lv','Livermório',293,'metal-pos-transicao',7,16,'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴',undefined,undefined,undefined,undefined,'2000','#b2bec3','Nomeado em honra ao Laboratório Lawrence Livermore. Meia-vida de milissegundos.',['Pesquisa em física de partículas']],
  [117,'Ts','Tenesso',294,'halogeno',7,17,'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵',undefined,undefined,undefined,undefined,'2010','#fd9644','Nomeado em honra ao Tennessee (EUA), onde fica o Oak Ridge National Laboratory.',['Pesquisa em física nuclear']],
  [118,'Og','Oganessônio',294,'gas-nobre',7,18,'[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶',undefined,undefined,undefined,undefined,'2002','#a29bfe','Elemento mais pesado confirmado. Pode não ser gás à temperatura ambiente (relativístico).',['Pesquisa em química relativística e estrutura atômica']],
]

const CAT_NOMES: Record<string, string> = {
  'nao-metal': 'Não-Metal', 'gas-nobre': 'Gás Nobre', 'metal-alcalino': 'Metal Alcalino',
  'metal-alcalino-terroso': 'Metal Alcalino-Terroso', 'metal-transicao': 'Metal de Transição',
  'metal-pos-transicao': 'Metal Pós-Transição', 'semimetal': 'Semimetal',
  'halogeno': 'Halogênio', 'lantanideo': 'Lantanídeo', 'actinideo': 'Actinídeo',
}

const CAT_COR: Record<string, string> = {
  'nao-metal': '#00cec9', 'gas-nobre': '#a29bfe', 'metal-alcalino': '#fd79a8',
  'metal-alcalino-terroso': '#00b894', 'metal-transicao': '#81ecec',
  'metal-pos-transicao': '#b2bec3', 'semimetal': '#6c5ce7',
  'halogeno': '#fd9644', 'lantanideo': '#fdcb6e', 'actinideo': '#fab1a0',
}

export const ELEMENTOS: Elemento[] = RAW.map(r => ({
  numero: r[0], simbolo: r[1], nome: r[2], massa: r[3], categoria: r[4],
  periodo: r[5], grupo: r[6], config: r[7], eletroneg: r[8],
  fusao: r[9], ebulicao: r[10], densidade: r[11], descoberto: r[12],
  cor: CAT_COR[r[4]] ?? '#74b9ff',
  descricao: r[14], usos: r[15],
}))

export function getElementoBySimboloOuSlug(id: string): Elemento | undefined {
  return ELEMENTOS.find(e =>
    e.simbolo.toLowerCase() === id.toLowerCase() ||
    e.nome.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase() ||
    e.numero.toString() === id
  )
}

export function getCatNomePeriodica(cat: string): string {
  return CAT_NOMES[cat] ?? cat
}

export function getCatCorPeriodica(cat: string): string {
  return CAT_COR[cat] ?? '#74b9ff'
}

export function getElementosByCategoria(cat: string): Elemento[] {
  return ELEMENTOS.filter(e => e.categoria === cat)
}

export const CATEGORIAS_PERIODICA = Object.entries(CAT_NOMES).map(([slug, nome]) => ({
  slug, nome, cor: CAT_COR[slug] ?? '#74b9ff',
  total: ELEMENTOS.filter(e => e.categoria === slug).length,
}))
