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
  name: 'Курган'
})
create (tomb:MonumentType {
  name: 'Гробница'
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



create (rt1:ResearchType {
  id: 1,
  name: 'Аналитическое'
})
create (rt2:ResearchType {
  id: 2,
  name: 'Раскопки'
})
create (rt3:ResearchType {
  id: 3,
  name: 'Разведка'
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



create (pub1:Publisher {
  name: 'Болгар-арт'
})
create (pub2:Publisher {
  name: 'Рускарт'
})



create (org1:Organization {
  name: 'Сообщество копателей'
})
create (org2:Organization {
  name: 'Ассоциация археологов Татарстана'
})
create (org3:Organization {
  name: 'Питерский музей'
})



create (store1:Storage {
  address: 'Где-то в Питере'
})
create (store2:Storage {
  address: 'Музей Казани'
})
create (store3:Storage {
  address: 'Казанское хранилище'
})




create (org1)-[:has]->(bolgar)
create (org2)-[:has]->(kazan)
create (org3)-[:has]->(piter)

create (org2)-[:has]->(store3)
create (org2)-[:has]->(store2)
create (org3)-[:has]->(store1)

create (pub1)-[:has]->(kazan)
create (pub2)-[:has]->(piter)

create (store2)-[:has]->(kazan)
create (store3)-[:has]->(kazan)
create (store1)-[:has]->(piter)