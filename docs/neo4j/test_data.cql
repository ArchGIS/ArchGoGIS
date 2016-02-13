create (m1:Monument {
    type_name: 'Городище', epoch_name: 'I тыс. н.э.', x: 4.5, y: 6.4
})
create (m2:Monument {
    type_name: 'Городище', epoch_name: 'I тыс. н.э.', x: 5.6, y: 59.3
})
create (m3:Monument {
    type_name: 'Селище', epoch_name: 'Средневековье', x: 4.6, y: 9.3
})
create (m4:Monument {
    type_name: 'Городище', epoch_name: 'I тыс. н.э.', x: 2.4, y: 1.4
})

create (a1:Author {name: 'Халикова Е.А.'})
create (a2:Author {name: 'Жиромский Б.Б.'})
create (a3:Author {name: 'Спицын А.А.'})

create (r1:Research {type_name: 'Разведки', year: 1961})
create (r2:Research {year: 1954})
create (r3:Research {type_name: 'Разведки', year: 1916})

create (h1:HeritageObject {name: 'Балымерское городище'})
create (h2:HeritageObject {name: 'Урнякское городище'})
create (h3:HeritageObject {name: 'Курган Шолом'})

create (r1)-[r1m1:Assigns {
    name: 'Балымерское II городище (Турецкая крепость)',
    type_name: 'Осмотр'
}]->(m1)

create (r3)-[r3m1:Assigns {
    name: 'Городище 4-х в. от с. Балымера',
    type_name: 'Осмотр'
}]->(m1)
