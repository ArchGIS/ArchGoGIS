// Заполнить БД
create (mesolit:Epoch {
  id: 1,
  name: 'Мезолит'
})
create (paleolit:Epoch {
  id: 2,
  name: 'Палеолит'
})
create (neolit:Epoch {
  id: 3,
  name: 'Неолит'
})
create (bronze_age:Epoch {
  id: 4,
  name: 'Бронзовый век'
})
create (iron_age:Epoch {
  id: 5,
  name: 'Ранний железный век'
})
create (migration_age:Epoch {
  id: 6,
  name: 'Эпоха великого переселения'
})
create (middle_age:Epoch {
  id: 7,
  name: 'Средневековье'
})
create (new_age:Epoch {
  id: 8,
  name: 'Новое время'
})

create (yellow:Tag {
  name: 'Желтый'
})
create (big:Tag {
  name: 'Большой'
})
create (funny:Tag {
  name: 'Забавный'
})

create (kazan:City {
  name: 'Казань',
  id: 1
})
create (piter:City {
  name: 'Санкт-Петербург',
  id: 2
})
create (bolgar:City {
  name: 'Болгар',
  id: 3
})
create (moscow:City {
  name: 'Москва',
  id: 4
})

create (tatar:Culture {
  id: 1,
  name: 'Татарская'
})
create (fin:Culture {
  id: 2,
  name: 'Финно-угорская'
})
create (mongol:Culture {
  id: 3,
  name: 'Монгольская'
})

create (mound:MonumentType {
  id: 1,
  name: 'Курган'
})
create (tomb:MonumentType {
  id: 2,
  name: 'Гробница'
})

create (tri:Area {
  coordinates: '[[100, 100],[100, 50],[50, 75]]'
})
create (square:Area {
  coordinates: '[[10, 10],[20, 10],[20, 20],[10,20]]'
})

create (cir1:CircleArea {
  x: 75,
  y: 75,
  radius: 10
})
create (cir2:CircleArea {
  x: 15,
  y: 15,
  radius: 1
})

create (weapon:ArtifactCategory {
  name: 'Оружие'
})
create (armor:ArtifactCategory {
  name: 'Доспехи'
})
create (jewelry:ArtifactCategory {
  name: 'Украшения'
})

create (metal:ArtifactMaterial {
  name: 'Металл'
})
create (wood:ArtifactMaterial {
  name: 'Дерево'
})
create (fabric:ArtifactMaterial {
  name: 'Ткань'
})
create (gems:ArtifactMaterial {
  name: 'Драгоценные камни'
})

create (au1:Author {
  id: 9997,
  name: 'Николай',
  birthdate: 1965
})
create (au2:Author {
  id: 9998,
  name: 'Булат',
  birthdate: 1980
})
create (au3:Author {
  id: 9999,
  name: 'Джек',
  birthdate: 1985
})

create (job1:AuthorJob {
  post_name: 'Главный археолог',
  period: [2000]
})
create (job2:AuthorJob {
  post_name: 'Помощник археолога',
  period: [2010]
})
create (job3:AuthorJob {
  post_name: 'Помощник археолога',
  period: [2010]
})
create (job4:AuthorJob {
  post_name: 'Копатель',
  period: [2005, 2010]
})

create (r1:Research {
  id: 1,
  year: 2011,
  name: 'Болгар-2011',
  description: 'Анализируем Болгар'
})
create (r2:Research {
  id: 2,
  year: 2010,
  name: 'Болгар-2010',
  description: 'Поиск оружия'
})
create (r3:Research {
  id: 3,
  year: 2005,
  name: 'Болгар-2005',
  description: 'Разведка'
})

create (rep1:Report {
  id: 1,
  year: 2012,
  name: "Отчет об анализе",
  fileid: '10'
})
create (rep2:Report {
  id: 2,
  year: 2011,
  name: "Отчет о раскопках",
  fileid: '11'
})
create (rep3:Report {
  id: 3,
  year: 2006,
  name: "Отчет о разведке",
  fileid: '12'
})

create (rt1:ResearchType {
  id: 2,
  name: 'Аналитическое'
})
create (rt2:ResearchType {
  id: 3,
  name: 'Раскопки'
})
create (rt3:ResearchType {
  id: 4,
  name: 'Разведка'
})

create (exc:Knowledge {
  id: 1,
  monument_name: 'Болгарский курган',
  x: 55,
  y: 49,
  description: 'Копаем оружие в Болгаре'
})
create (surv:Knowledge {
  id: 2,
  monument_name: 'Гробница в Болгаре',
  y: 48.8,
  x: 54.8,
  description: 'Расхищаем гробницу'
})
create (an:Knowledge {
  id: 3,
  y: 48.6,
  x: 54.6,
  monument_name: 'Курган в Болгаре',
  description: 'Изучаем курган'
})

create (map:Publication {
  id: 1,
  name: 'Карта кургана',
  published_at: 2007,
  volume: '1',
  isbn: '1241523-9837',
  link: "https://www.google.ru"
})
create (mono1:Publication {
  id: 2,
  name: 'Как я копал Курган',
  published_at: 2010,
  isbn: '1241523-9137',
  pages: 200,
  link: "https://www.google.ru"
})
create (mono2:Publication {
  id: 3,
  name: 'Анализ раскопок кургана',
  published_at: 2012,
  isbn: '1241523-9137',
  pages: 150,
  link: "https://www.google.ru"
})
create (dig:Publication {
  id: 4,
  name: 'Сборник легенд о гробнице царя',
  published_at: 2000,
  isbn: '1241523-4137',
  pages: 120,
  link: "https://www.google.ru"
})
create (jour:Publication {
  id: 5,
  name: 'Вестник Болгара',
  published_at: 2011,
  volume: 1,
  number: '37',
  isbn: '1241523-4737',
  pages: 70,
  link: "https://www.google.ru"
})	

create (publ1:PublicationType {
  id: 1,
  name: "Монография"
})
create (publ2:PublicationType {
  id: 2,
  name: "Журнал"
})
create (publ3:PublicationType {
  id: 3,
  name: "Сборник"
})
create (publ4:PublicationType {
  id: 4,
  name: "Археологическая карта"
})

create (art1:Article {
  name: 'Описание найденого в кургане оружия',
  pages: [33, 77]
})	
create (art2:Article {
  name: 'Расхищение гробницы. Что надо об этом знать?',
  pages: [60, 80]
})	

create (col1:Collection {
  name: 'Вещи царя',
  Description: 'Древние украшения, найденные в гробнице'
})
create (col2:Collection {
  name: 'Питерская коллекция',
  Description: 'Коллекция древностей в Питере'
})

create (mon1:Monument {
  id: 1
})
create (mon2:Monument {
  id: 2
})

create (status:HeritageStatus {
  name: 'Каменные памятники'
})

create (im1:Image {
  id: 1,
  fileid: '1',
  description: 'Оружие из кургана',
  date: '14.07.2010',
  x: 10,
  y: 10
})
create (im2:Image {
  id: 2,
  fileid: '2',
  description: 'Украшения царя',
  date: '14.07.2005',
  x: 10,
  y: 10
})	
create (im3:Image {
  id: 3,
  fileid: '3',
  description: 'Внутри гробницы',
  date: '14.07.2005',
  x: 10,
  y: 10
})	
create (im4:Image {
  id: 4,
  fileid: '4',
  description: 'Вход в курган',
  date: '14.07.2010',
  x: 10,
  y: 10
})	
create (im5:Image {
  id: 5,
  fileid: '5',
  description: 'Раскопки гробницы',
  date: '14.07.2005',
  x: 10,
  y: 10
})	
create (im6:Image {
  id: 6,
  fileid: '6',
  description: 'Раскопки кургана',
  date: '14.07.2010',
  x: 10,
  y: 10
})


// Фото авторов
create (im7:Image {
  id: 7,
  fileid: '7'
})
create (im8:Image {
  id: 8,
  fileid: '8'
})
create (im9:Image {
  id: 9,
  fileid: '9'
})


create (pub1:Publisher {
  id:1,
  name: 'Болгар-арт'
})
create (pub2:Publisher {
  id:2,
  name: 'Рускарт'
})

create (org1:Organization {
  id:1,
  name: 'Сообщество копателей'
})
create (org2:Organization {
  id:2,
  name: 'Ассоциация археологов Татарстана'
})
create (org3:Organization {
  id:3,
  name: 'Питерский музей'
})

create (stor1:StorageInterval {
  period: [2005, 2012]
})
create (stor2:StorageInterval {
  period: [2005]
})
create (stor3:StorageInterval {
  period: [2005]
})
create (stor4:StorageInterval {
  period: [2010, 2012]
})
create (stor5:StorageInterval {
  period: [2010]
})
create (stor6:StorageInterval {
  period: [2010]
})
create (stor7:StorageInterval {
  period: [2012]
})
create (stor8:StorageInterval {
  period: [2012]
})

create (ref1:ShortBibliographicRef {
  pages: [14, 15],
  number: 'Карта №3',
  comment: 'Карта местности кургана'
})
create (ref2:ShortBibliographicRef {
  pages: [33, 35],
  number: 'Опись',
  comment: 'Все найденные артефакты'
})
create (ref3:ShortBibliographicRef {
  pages: [8, 9],
  number: '3',
  comment: 'Поиск кургана'
})

create (arti1:Artifact {
  id: 1,
  name: 'Железный меч',
  description: 'Железный меч',
  year: '2000'
})
create (arti2:Artifact {
  id: 2,
  name: 'Часть деревянного щита',
  description: 'Часть деревянного щита',
  year: '2000'
})
create (arti3:Artifact {
  id: 3,
  description: 'Плащ',
  name: 'Плащ',
  year: '2000'
})
create (arti4:Artifact {
  id: 4,
  description: 'Золотое кольцо',
  name: 'Золотое кольцо',
  year: '2000'
})
create (arti5:Artifact {
  id: 5,
  name: 'Картина с котятами',
  description: 'Картина с котятами',
  year: '2000'
})
create (arti6:Artifact {
  id: 6,
  name: 'Сапфировое ожерелье',
  description: 'Сапфировое ожерелье',
  year: '2000'
})

create (r1)-[:has]->(rt1)
create (r2)-[:has]->(rt2)
create (r3)-[:has]->(rt3)

create (au1)-[:has]->(job1)
create (au2)-[:has]->(job2)
create (au3)-[:has]->(job3)
create (au3)-[:has]->(job4)

create (au1)-[:has]->(im7)
create (au2)-[:has]->(im8)
create (au3)-[:has]->(im9)

create (job1)-[:belongsto]->(org2)
create (job2)-[:belongsto]->(org2)
create (job3)-[:belongsto]->(org2)
create (job4)-[:belongsto]->(org1)

create (org1)-[:has]->(bolgar)
create (org2)-[:has]->(kazan)
create (org3)-[:has]->(piter)

create (r2)-[:hasauthor]->(au1)
create (r3)-[:hasauthor]->(au1)
create (r1)-[:hasauthor]->(au2)
create (r1)-[:hascoauthor]->(au1)

create (rep2)-[:hasauthor]->(au1)
create (rep3)-[:hasauthor]->(au1)
create (rep1)-[:hasauthor]->(au2)

create (r1)-[:has]->(an)
create (r2)-[:has]->(surv)
create (r3)-[:has]->(exc)

create (r1)-[:has]->(rep1)
create (r2)-[:has]->(rep2)
create (r3)-[:has]->(rep3)

create (exc)-[:belongsto]->(mon1)
create (surv)-[:belongsto]->(mon2)
create (an)-[:belongsto]->(mon1)

create (exc)-[:found]->(arti1)
create (exc)-[:found]->(arti2)
create (exc)-[:found]->(arti3)
create (r1)-[:used]->(arti1)
create (r1)-[:used]->(arti2)
create (r1)-[:used]->(arti3)
create (surv)-[:found]->(arti4)
create (surv)-[:found]->(arti5)
create (surv)-[:found]->(arti6)

create (exc)-[:has_monument_photo]->(im4)
create (an)-[:has_monument_photo]->(im4)
create (exc)-[:has_photo]->(im6)
create (surv)-[:has_monument_photo]->(im3)
create (surv)-[:has_photo]->(im5)

create (exc)-[:has]->(tri)
create (exc)-[:has]->(cir1)
create (an)-[:has]->(tri)
create (an)-[:has]->(cir1)
create (surv)-[:has]->(square)
create (surv)-[:has]->(cir2)

create (mon1)-[:has]->(middle_age)
create (mon2)-[:has]->(iron_age)

create (surv)-[:has]->(fin)
create (exc)-[:has]->(mongol)
create (an)-[:has]->(tatar)

create (arti1)-[:has]->(im1)
create (arti2)-[:has]->(im1)
create (arti3)-[:has]->(im1)
create (arti4)-[:has]->(im2)
create (arti5)-[:has]->(im2)
create (arti6)-[:has]->(im2)

create (arti1)-[:has]->(weapon)
create (arti2)-[:has]->(armor)
create (arti3)-[:has]->(armor)
create (arti4)-[:has]->(jewelry)
create (arti5)-[:has]->(jewelry)
create (arti6)-[:has]->(jewelry)

create (arti1)-[:has]->(metal)
create (arti1)-[:has]->(wood)
create (arti2)-[:has]->(wood)
create (arti2)-[:has]->(metal)
create (arti3)-[:has]->(fabric)
create (arti4)-[:has]->(metal)
create (arti5)-[:has]->(fabric)
create (arti5)-[:has]->(wood)
create (arti6)-[:has]->(gems)
create (arti6)-[:has]->(metal)

create (arti4)-[:has]->(stor1)
create (arti4)-[:has]->(stor7)
create (arti5)-[:has]->(stor2)
create (arti6)-[:has]->(stor3)
create (arti1)-[:has]->(stor4)
create (arti1)-[:has]->(stor8)
create (arti2)-[:has]->(stor5)
create (arti3)-[:has]->(stor6)

create (stor4)-[:belongsto]->(org3)
create (stor5)-[:belongsto]->(org3)
create (stor6)-[:belongsto]->(org3)
create (org2)-[:has]->(col1)
create (org1)-[:has]->(col2)

create (stor1)-[:belongsto]->(col1)
create (stor2)-[:belongsto]->(col1)
create (stor3)-[:belongsto]->(col1)
create (stor7)-[:belongsto]->(col2)
create (stor8)-[:belongsto]->(col2)

create (pub1)-[:has]->(jour)
create (pub1)-[:has]->(dig)
create (pub1)-[:has]->(mono1)
create (pub1)-[:has]->(mono2)
create (pub2)-[:has]->(map)

create (map)-[:has]->(publ4)
create (mono1)-[:has]->(publ1)
create (mono2)-[:has]->(publ1)
create (dig)-[:has]->(publ3)
create (jour)-[:has]->(publ2)

create (dig)-[:has]->(art2)
create (jour)-[:has]->(art1)

create (mono1)-[:from]->(ref1)-[:to]->(map)
create (jour)-[:from]->(ref2)-[:to]->(mono1)
create (mono2)-[:from]->(ref3)-[:to]->(mono1)

create (mono1)-[:hasauthor]->(au1)
create (mono2)-[:hasauthor]->(au2)
create (mono2)-[:hascoauthor]->(au1)
create (map)-[:hasauthor]->(au1)
create (map)-[:hascoauthor]->(au2)
create (jour)-[:hasauthor]->(au3)
create (dig)-[:hasauthor]->(au3)

create (mon1)-[:has]->(status)

create (mon1)-[:has]->(mound)
create (mon2)-[:has]->(tomb)

create (pub1)-[:has]->(kazan)
create (pub2)-[:has]->(piter)

create (arti1)-[:has]->(big)
create (arti2)-[:has]->(big)
create (arti3)-[:has]->(yellow)
create (arti4)-[:has]->(yellow)
create (arti5)-[:has]->(funny)
create (arti6)-[:has]->(big)