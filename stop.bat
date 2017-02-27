ps -ef | grep ArchGo | awk '{print $2}' | xargs kill
