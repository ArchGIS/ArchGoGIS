var epochs = {
	"paleolit" 		: "Палеолит",
	"mezolit" 		: "Мезолит",
	"neolit" 		: "Неолит",
	"eneolit" 		: "Энеолит",
	"bronze" 		: "Бронзовый век",
	"iron" 			: "Ранний железный век",
	"resettlement" 	: "Великое переселение народов",
	"middle" 		: "Средневековье",
	"new" 			: "Новое время"
}

var monumentTypes = {
	"archMon"		: "Архитектурный памятник",
	"settlement"	: "Городище",
	"groundBurial"	: "Грунтовый могильник",
	"moundBurial"	: "Курганный могильник",
	"mound"			: "Курган",
	"treasure"		: "Клад",
	"workshop"		: "Мастерскя",
	"location"		: "Местонахождение",
	"burial"		: "Могильник",
	"entombment"	: "Погребение",
	"village"		: "Селище",
	"camp"			: "Стоянка"
}

var spatialReference = {	//  Основание пространственной привязки
	"remoteSensing" 	: "Данные дистанционного зондирования",
	"topogPlan"			: "Топографический план",
	"textDescription"	: "Текстовое описание"
}

// create (a1:Author {label: "Искандер", id: "iskander"})
var authors = [
	{label: "Искандер", id: "iskander"},
	{label: "Максим", id: "maxim"},
	{label: "Делюс", id: "delus"},
	{label: "Леонид Вязов", id: "vyazov"},
	{label: "Начальник с ноутбуком", id: "notebook"},
	{label: "Админ", id: "admin"}
]

var maxim = [
	{label: "Ефимов (1999)", id: "r1"},
	{label: "Ефимов (1234)", id: "r2"},
	{label: "Ефимов (1998)", id: "r3"},
]

var iskander = [
	{label: "Шарипов (2012)", id: "r4"},
	{label: "Шарипов (2011)", id: "r5"},
	{label: "Шарипов (2013)", id: "r6"},
]

var r1 = [
	{label: "Казанский курган", id: "m1"},
	{label: "Могила хана", id: "m2"},
	{label: "Древний склеп", id: "m3"}
]

var r3 = [
	{label: "Старгородское клабище", id: "m4"},
	{label: "Поле битвы", id: "m5"},
	{label: "Мавзолей", id: "m6"}
]

var cultures = {
	"tatar" 	: "Татарская",
	"rus"		: "Русская"
}

var documentTypes = {
	"archive"	: "Архивный документ",
	"liter"		: "Литература"
}

var publisher = {
	"alphaMaps" 	: "Альфа карт",
	"akBarsMaps" 	: "Ак Барс карт",
	"standartMaps" 	: "Карты русского стандарта"
}

var pubPlace = {
	"moscow" 	: "Москва",
	"piter"		: "Санкт-Петербург",
	"kazan"		: "Казань"
}

var pubType = {
	"mono" 		: "Монография",
	"journal"	: "Статья в журнале",
	"digest" 	: "Статья в сборнике",
	"map" 		: "Археологическая карта"
}
