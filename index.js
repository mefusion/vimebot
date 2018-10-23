//Бот создан "супер-крутым" программистом PHPMaster'ом
//                                 И да, я программист 

//Инициализация переменных
var fs = require('fs');
const Discord = require('discord.js');
const Bot = new Discord.Client();
var config = JSON.parse(fs.readFileSync('configs.json', 'utf8'));
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var server = {
	"name": "",
	"id": ""
}

//Авторизация бота через аккаунт
Bot.login("NTA0MzIwNjQzMjExMTk4NDY3.DrDVfQ.nMshv3uRVGjLAjWNcR_I1Q947Tw");

//Cобытие начала бота
Bot.on('ready', () => {
    var servs = 0;
    for(i in config) {
        servs += 1;
    }
	//Установка статуса бота
    Bot.user.setActivity('!help/!info', {type: "STREAMING"});
    //Лог в консоль о работе бота
    console.log('Bot started successful');
});

//Событие подключения нового члена гильдии
Bot.on('guildMemberAdd', async (member) => {
    var msg = `Здравствуй, <@${member.id}>! Для вывода списка команд используй: ${config[member.guild.id].prefix}help`;
    if (config[member.guild.id].botchannel != "*") return member.guild.channels.find("id", String(config[member.guild.id].botchannel)).send(msg);
    else return member.guild.channels.first().send(msg);
});

//Событие отправки сообщения
Bot.on('message', async (message) => {
	//Получение данных от текущего сервера
	server.name = message.guild.name;
    server.id = message.guild.id;
    if (!config[server.id]) {
        config[server.id] = new Object;
        config[server.id].prefix = "!";
        config[server.id].botchannel = "*";
        fs.writeFileSync('configs.json', JSON.stringify(config));
        message.channel.send("Похоже, этого бота ранее не было на вашем сервере. Были установлены параметры по умолчанию. Для помощи - !help");
    }
    //Создание переменных команды и аргументов команды
    var prefix = config[server.id].prefix;
    var channel = config[server.id].botchannel;
    var msg = message.content.slice(prefix.length);
    var args = msg.split(' ');
    //Проверка на сообщение
    if (message.author.bot || !message.guild || !message.content.startsWith(prefix)) return false;
    if (String(message.channel.id) != config[server.id].botchannel && config[server.id].botchannel != "*") {
        message.reply("Вы пишите не в том текстовом канале. Лучше перейдите в <#" + config[server.id].botchannel + ">");
        return false;
    }
    //Доступные команды:
    switch (msg) {
    	//Команда помощи
        case "help":
            message.channel.send(`
\`Команды бота:\`\n
\`\`\`Основное:\n
• info - показывает информацию о боте\n
• online - показывает модеров онлайн\n
VimeWorld:\n
• players - показывает всех игроков онлайн\n
• streams - показывает список стримов на vimeworld\n
• stats [игрок] - показывает данные игрока\n
• guild [название] - поиск гильдии\n
• leaderboard [название] - показывает список лучших игроков\n
Администраторам:\n
• prefix set|remove <значение> - установка префикса для команд\n
• channel <ссылка на канал> - установка канала бота (* - все каналы по умолчанию)\n
Другое:\n
• server - выводит информацию о сервере
\`\`\``);
            break;
        //Команда информации
        case "info":
            message.channel.send(`
\`\`Сделан Пхпмастером, для Юти.\n
Я робот, у меня нет эмоций :robot:.\`\``);
            break;
        case "server":
            message.channel.send("Информация о сервере " + server.name + "\nID: " + server.id + "\nУчастников сервера: " + message.guild.memberCount);
            break;
        case "online":
            var req = new XMLHttpRequest();
            var moders = '';
            req.open('GET', 'https://api.vime.world/online/staff', false);   
            req.send();  
            if(req.status == 200)  
                var data = JSON.parse(req.responseText);
            for (var i = 0; i < data.length; i++) {
                if (i == data.length - 1)
                    moders += '`' + data[i].username + '`.';
                else
                    moders += '`' + data[i].username + '`, ';
            }
            var cd = 'Всего модераторов онлайн ' /* дальше будут показыватся модеры и их кол-во */ + data.length + ';\n' + moders;
            message.channel.send(cd);
            break;
        case "streams":
            var req = new XMLHttpRequest(); 
            var streams = '';
            req.open('GET', 'https://api.vime.world/online/streams', false);   
            req.send();  
            if(req.status == 200)  
                var data = JSON.parse(req.responseText);
            for (var i = 0; i < data.length; i++) {
                if (i == data.length - 1)
                    streams += '**' + data[i].title + '**.';
                else
                    streams += '**' + data[i].title + '**, ';
            }
            var cd = 'Всего стримов онлайн ' /* дальше будут показыватся стримы и их кол-во */ + data.length + ';\n' + streams;
            message.channel.send(cd);
            break;
        case "players":
            var req = new XMLHttpRequest(); 
            var streams = '';
            req.open('GET', 'https://api.vime.world/online', false);   
            req.send();  
            if(req.status == 200)  
                var data = JSON.parse(req.responseText);
            var s = data.separated;
            var online = new Discord.RichEmbed()
            .setTitle("Всего игроков онлайн: " + data.total, ".", true)
            .setColor("#00bfff")
            .addField("BedWars", s.bw, true)
            .addField("SkyWars", s.sw, true)
            .addField("Annihilation", s.ann, true)
            .addField("BuildBattle", s.bb, true)
            .addField("GunGame", s.gg, true)
            .addField("MobWars", s.mw, true)
            .addField("KitPVP", s.kpvp, true)
            .addField("DeathRun", s.dr, true)
            .addField("BlockParty", s.bp, true)
            .addField("HungerGames", s.hg, true)
            .setFooter("Игроков в лобби: " + s.lobby);
            message.channel.send(online);
            break;
        case "invite":
            const variants = [
                "Бери: https://discordapp.com/api/oauth2/authorize?client_id=455673715242303499&permissions=2048&scope=bot !",
                "Лови: https://discordapp.com/api/oauth2/authorize?client_id=455673715242303499&permissions=2048&scope=bot",
                "Дарю :gift:: https://discordapp.com/api/oauth2/authorize?client_id=455673715242303499&permissions=2048&scope=bot",
                "**ERROR №505 BAD GATEWAY**, ха шутка, бери: https://discordapp.com/api/oauth2/authorize?client_id=455673715242303499&permissions=2048&scope=bot.",
                "Ничего не дам",
                "Чо нада ?",
                "로봇 은 잘 작동합니다!"

            ];
            const rand = Math.round(Math.random() * variants.length);
            message.channel.send(variants[rand]);
        	break;
    }
    if (msg.startsWith('stats')) {
        args[1] = args.splice(1).join(' ');
        var req = new XMLHttpRequest(); 
        req.open('GET', 'http://api.vime.world/user/name/' + args[1], false);
        req.send();
        if(req.status == 200) 
            var data = JSON.parse(req.responseText)[0];
        if(!data) {
            message.channel.send("Игрок не найден :(");
            return false;
        }
        var req = new XMLHttpRequest(); 
        req.open('GET', 'http://api.vime.world/user/' + data.id + '/session', false);
        req.send();
        if(req.status == 200) 
            var data1 = JSON.parse(req.responseText);
        message.channel.send("Ник: [`" + data.rank + "`] `" + data.username + "`\nУровень: " + data.level + "\n" + (data.guild ? "Состоит в гильдии " + data.guild.name : "Не состоит в гильдии") + "\nСыграно около " + Math.round(data.playedSeconds / 60 / 60 / 24) + " дней\n\n" + (data1.online.value ? "Игрок онлайн. " + data1.online.message : data1.online.message));
    }
    else if (msg.startsWith('guild')) {
        args[1] = args.splice(1).join(' ');
        var req = new XMLHttpRequest();
        req.open('GET', 'http://api.vime.world/guild/get?name=' + encodeURIComponent(args[1]), false);
        req.send();
        if(req.status == 200) 
            var data = JSON.parse(req.responseText);
        var perks = "";
        var pls = "";
        for(i in data.perks) {
            perks += data.perks[i].name + ": " + data.perks[i].level + ", ";
        }
        message.channel.send("Название: `" + data.name + "`\nУровень: " + data.level + "\n\nПрокачка: \n\n" + perks + "\n\nТег: " + (data.tag ? data.tag : "Отсутствует") + "\nЦвет тега: " + (data.tag ? data.color : "Тег отсутствует") + "\n\nИгроков всего: " + data.members.length + ".");
    }
    else if (msg.startsWith('leaderboard')) {
        args[1] = args.splice(1).join(' ');
        var req = new XMLHttpRequest(); 
        req.open('GET', 'http://api.vime.world/leaderboard/list', false);
        req.send();
        if(req.status == 200) 
            var data = JSON.parse(req.responseText);
        for (i in data) {
            if (args[1] == data[i].type) {
                break;
            }else if (i == data.length - 1) {
                message.channel.send("Неизвестное название");
                return false;
            }
        }
        var req = new XMLHttpRequest(); 
        req.open('GET', 'http://api.vime.world/leaderboard/get/' + args[1] + "?size=10", false);
        req.send();
        if(req.status == 200)
            var data = JSON.parse(req.responseText);
        var rs = "";
        if (args[1] == "guild") {
            for (i in data.records) {
                rs += "`" + data.records[i].name + "`, ";
            }
        }
        else if (args[1] == "user") {
            for (i in data.records) {
                rs += "`" + data.records[i].username + "`, ";
            }
        }
        else {
            for (i in data.records) {
                rs += "`" + data.records[i].user.username + "`, ";
            }
        }

        message.channel.send(args[1] != "guild" ? ("Топ 10 лучших игроков" + (args[1] != "user" ? " " + args[1] : "") + ":\n" + rs) : ("Топ 10 лучших гильдий:\n" + rs));
    }
    else if (msg.startsWith('prefix')) {
        if (!message.member.hasPermission("ADMINISTRATOR") && message.author.id != 396921754536247306) return message.reply("У вас недостаточно прав для совершения этого действия!");
    	if (!args[1]) {
    		message.reply("Префиксом бота в данный момент является \"" + prefix + "\"");
    		return false;
    	}
    	switch(args[1]) {
    		case "set":
    			config[server.id].prefix = args[2];
    			prefix = config[server.id].prefix;
    			fs.writeFileSync('configs.json', JSON.stringify(config));
                message.channel.send("Префикс бота для сервера " + server.name + " [" + server.id + "] был успешно изменён на \"" + args[2] + "\"");
                break;
    		case "remove":
    			config[server.id].prefix = "";
    			prefix = config[server.id].prefix;
    			fs.writeFileSync('configs.json', JSON.stringify(config));
                message.channel.send("Префикс бота был успешно сброшен");
                break;
    	}
    }
    else if (msg.startsWith("channel")) {
        if (!message.member.hasPermission("ADMINISTRATOR") && message.author.id != 396921754536247306) return message.reply("У вас недостаточно прав для совершения этого действия!");
        if (args[1] == "*") {
            config[server.id].botchannel = "*";
        }else{
            config[server.id].botchannel = message.mentions.channels.first().id;
        }
        channel = config[server.id].botchannel;
        fs.writeFileSync('configs.json', JSON.stringify(config));
        message.channel.send("Канал бота для сервера " + server.name + " [" + server.id + "] был успешно изменён на \"" + args[1] + "\"");
    }
});
//P. S. Ютя не гей :D
// Spuz gay
