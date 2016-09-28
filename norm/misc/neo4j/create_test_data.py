#!/usr/bin/env python3

MONUMENT_COUNT = 600
RESEARCH_COUNT = 4000
KNOWLEDGE_COUNT = 6000
OBJECTS_COUNT = 1000

MONUMENT_FILENAME = "create_monuments.cypher"
RESEARCH_FILENAME = "create_researches.cypher"
KNOWLEDGE_FILENAME = "create_knowledges.cypher"
OBJECTS_FILENAME = "create_objects.cypher"

file = open(MONUMENT_FILENAME, "a")
string = "create"

for i in range(MONUMENT_COUNT):
  file.write(string + "\n")