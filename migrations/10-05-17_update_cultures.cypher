LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1kfqQnxDrNLCkoAwQChycZABW3OhO8cx7VIInRejo6cU/pub?gid=0&single=true&output=csv" AS line
match (c:Culture {name: line.name})
set c.name = line.new_name,
    c.en_name = line.new_en_name
with c
match (c)-[:translation {lang: "ru"}]-(l1)
set l1.name = c.name
with c
match (c)-[:translation {lang: "en"}]-(l2)
set l2.name = c.en_name;