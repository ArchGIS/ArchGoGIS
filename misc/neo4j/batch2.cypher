create (o1:Organization {id:1, name:'Best org'})
create (o2:Organization {id:2, name:'Вторяки'})
create (o3:Organization {id:3, name:'ОООрганизация'})

create (a1:Author {id:1, name:'Первый', year:1950})
create (a2:Author {id:2, name:'Первый с конца', year:1965})
create (a3:Author {id:3, name:'Второй', year:1970})
create (a4:Author {id:4, name:'Третий', year:1949})

create (r1:Research {id:1, year: 1999, description: 'r1', type: 'Неразрушающее'})
create (r2:Research {id:2, year: 1999, description: 'r2', type: 'Аналитическое'})
create (r3:Research {id:3, year: 2000, description: 'r3', type: 'Аналитическое'})
create (r4:Research {id:4, year: 2000, description: 'r4', type: 'Неразрушающее'})
create (r5:Research {id:5, year: 2001, description: 'r5', type: 'Вскрытие культурного слоя'})

create (k1:Knowledge {id:1, name:'Памятник one', culture: 'Пеленгская'})
create (k2:Knowledge {id:2, name:'Городище777', culture: 'Малокская'})
create (k3:Knowledge {id:3, name:'Памятное место', culture: 'Фэянская'})
create (k4:Knowledge {id:4, name:'Золотая жила', culture: 'Страндрипская'})
create (k5:Knowledge {id:5, name:'Могилище2', culture: 'Культура-7'})
create (k6:Knowledge {id:6, name:'Первый памятник', culture: 'Supox93'})

create (m1:Monument {id:1, x:1, y:2, type: 'могильник', epoch: 'средневековье'})
create (m2:Monument {id:2, x:3, y:5, type: 'городище', epoch: 'новое время'})
create (m3:Monument {id:3, x:5, y:2, type: 'могильник', epoch: 'палеолит'})
create (m4:Monument {id:4, x:6, y:8, type: 'могильник', epoch: 'бронзовый век'})
create (m5:Monument {id:5, x:7, y:4, type: 'курганный могильник', epoch: 'мезолит'})

create (obj1:Object {id:1, type:'Могила'})
create (obj2:Object {id:2, type:'Могила'})
create (obj3:Object {id:3, type:'Крыша от мавзолея'})

create (art1:Artifact {
  id:1, weight:1.4, names:['Кости', 'Груда костей']
})
create (art2:Artifact {
  id:2, weight:1.5, names:['Корона']
})
create (art3:Artifact {
  id:3, weight:20.4, names:['Останки', 'Скелет']
})
create (art4:Artifact {
  id:4, weight:3.0, names:['Гниль', 'Мох']
})
create (art5:Artifact {
  id:5, weight:19.3, names:['Камни']
})

create (m1)-[:Contains]->(obj1)
create (m1)-[:Contains]->(obj2)
create (m1)-[:Contains]->(obj3)

create (obj1)-[:Contains]->(art1)
create (obj2)-[:Contains]->(art2)
create (obj2)-[:Contains]->(art3)
create (obj3)-[:Contains]->(art4)
create (obj3)-[:Contains]->(art5)

create (a1)-[:WorkedIn {since: 1980, position: 'Археолог'}]->(o1)
create (a1)-[:WorkedIn {since: 1983, position: 'Старший науч. сотрудник'}]->(o2)
create (a2)-[:WorkedIn {since: 1989, position: 'Археолог'}]->(o2)
create (a3)-[:WorkedIn {since: 2000, position: 'Уборщик'}]->(o3)
create (a4)-[:WorkedIn {since: 1967, position: 'Младший науч. сотрудник'}]->(o1)
create (r1)-[:Contains]->(k1)
create (r2)-[:Contains]->(k2)
create (r3)-[:Contains]->(k3)
create (r4)-[:Contains]->(k4)
create (r5)-[:Contains]->(k5)
create (r3)-[:Contains]->(k6)
create (k1)-[:Describes]->(m1)
create (k2)-[:Describes]->(m2)
create (k3)-[:Describes]->(m3)
create (k4)-[:Describes]->(m4)
create (k5)-[:Describes]->(m5)
create (k6)-[:Describes]->(m1)
create (a1)-[:Created]->(r1)
create (a1)-[:Created]->(r2)
create (a1)-[:Created]->(r3)
create (a2)-[:HelpedToCreate]->(r1)
create (a3)-[:Created]->(r4)
create (a4)-[:Created]->(r5)
