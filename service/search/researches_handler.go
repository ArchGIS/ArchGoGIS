package search

const researchesCypher = "MATCH (a:Author)" +
	"MATCH (r:Research)" +
	"MATCH (a)-[:Created]->(r)" +
	"WHERE r.year = {year} AND a.name STARTS WITH {name}" +
	"RETURN r"
