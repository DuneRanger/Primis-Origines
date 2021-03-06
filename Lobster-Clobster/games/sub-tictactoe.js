const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require("../auth.json");
const fs = require('fs');

let Leaderboard = require("../leaderboards/leaderboard-tictactoe.json");

let bool = false;
let Init = false;
let player1 = {username: "", id: "", wins: 0, gamesPlayed: 0, input: 0}, player2 = {username: "", id: "", wins: 0, gamesPlayed: 0, input: 0};
let turn = "player1";
let Exp = (new RegExp(/^ *[123] +[123] *$/));
let board = [];
let checkBoard = [];
let round = 0;
let totRounds = 0;
let confirmQ = [false, ""];
let inpMethod0 = "row first, then column";
let inpMethod1 = "column first, then row";

module.exports = function tictactoe(msg, command, arg1, client) {
    if (command == "changeinput") {
        if (!Leaderboard.hasOwnProperty(msg.author.id)) return msg.channel.send("You need to finish at least 1 game to change your input method");
        else {
            if (Leaderboard[msg.author.id].input) Leaderboard[msg.author.id].input = 0;
            else Leaderboard[msg.author.id].input = 1;
            return msg.channel.send("Your input method has been changed to " + eval("inpMethod" + Leaderboard[msg.author.id].input));
        }
    }
    if (command == "leaderboard") return msg.channel.send(writeLeaderboard(msg.author.id));
    if (command == "myrank") return msg.channel.send(writeOwnPosition(msg.author.id));
    if (command == "getrank") return msg.channel.send(writePosition(arg1));
    if (msg.channel.name != "tic-tac-toe") {
        return msg.channel.send("Please play tic tac toe in a channel named ```tictactoe```");
    }
    //Checks if a game is already in progress
    if (bool) return Init ? msg.channel.send("A game is already in progress") : msg.channel.send("A game is already being registered");
    bool = true;
    msg.channel.send("Each player must send a message with their username to start the game");
    let listen = message => {
        if (message.channel.id != msg.channel.id || message.author.bot) return;
        //cancel before both players registration
        if (message.content.toLowerCase() == "cancel") {
            if (player2.username.length < 1) {
                message.channel.send("Game canceled");
                endGame(client, listen);   
            }
            else message.channel.send("A game has already been registered");
        }
        //This is for getting the other players confirmation to end a registered game
        if (confirmQ[0]) {
            if (message.author.username == eval(confirmQ[1] + ".username") && message.content.toLowerCase() == "confirm") {
                message.channel.send("Game ended early\nEach players wins and games played will still be added to the leaderboard");
                endGame(client, listen);
            }
            else {
                message.channel.send("Confirmation message wasn't sent, the game will continue");
                confirmQ = [false, ""];
                return;
            }
        }
        //This is for ending the game after it has been initialised, requires both players confirmation
        else if (message.content.toLowerCase() == "end game"  && player2.username.length > 1) {
            confirmQ[0] = true;
            if (message.author.username == player1.username) {
                confirmQ[1] = "player2";
                message.channel.send(player2.username + ", please write `confirm` to end the game"); 
            }
            else if (message.author.username == player2.username) {
                confirmQ[1] = "player1";
                message.channel.send(player1.username + ", please write `confirm` to end the game");
            }
            return;
        }
        //Requirements for a game to start
        if (!Init) {
            //Makes the player write their username to make sure they are a player
            //Registers player 1 and sends their input method
            if (message.content == message.author.username && player1.username.length < 1){
                player1.username = message.author.username;
                player1.id = message.author.id;
                str = "Player 1 has been registered as " + player1.username + "\nYour current input method is ";
                if (Leaderboard.hasOwnProperty(player1.id)) {
                    player1.input = Leaderboard[player1.id].input;
                    str += eval("inpMethod" + Leaderboard[player1.id].input);
                }
                else str += inpMethod0 + "You can change your input method with the command: !tictactoe ChangeInput";
                message.channel.send(str);
            }
            //Registers player 2 and sends their input method
            else if (message.content == message.author.username) {
                player2.username = message.author.username;
                player2.id = message.author.id;
                str = "Player 2 has been registered as " + player2.username + "\nYour current input method is ";
                if (Leaderboard.hasOwnProperty(player2.id)) {
                    player2.input = Leaderboard[player1.id].input;
                    str += eval("inpMethod" + Leaderboard[player2.id].input);
                }
                else str += inpMethod0 + "You can change your input method with the command: !tictactoe ChangeInput"; 
                message.channel.send(str);
                message.channel.send("Now please enter the amount of rounds you will play");
            }
            //A bit long, but I'm not sure how else to do it
            //Lets either player set the round amount
            else if (player2.username.length > 1 && /^ *\d+ *$/.test(message.content) && (message.author.username == player2.username || message.author.username == player1.username)) {
                if (message.content > 50 && message.content != 69) return message.channel.send("Please enter a number that is 50 or smaller");
                totRounds = message.content;
                Initialisation(message.channel);
            }
        }
        //Checks that the game has started; It's else if, so that 1 player games work
        else if (Init) {
            //stops processing if the author isn't the current player
            if (message.author.username != eval(turn + ".username")) return;
            //Checks for correct formatting
            if (!Exp.test(message.content)) {
                message.channel.send("Please enter a valid format, for example: ```1 3```(With 1 or more spaces seperating the numbers)");
                return;
            }
            //Checks for a valid move and splits the message
            let args = message.content.trim().split(/ +/);
            if (eval(turn + ".input")) args.reverse();
            if (board[args[0]-1][args[1]-1] != ":blue_square:") {
                return message.channel.send("Please enter a valid square\n", writeBoardState(message.channel));
            }
            //Calls the suitable player function
            else eval(turn + "Turn(message.channel, args)");

            winCheck(message, client, listen);
        }   
    }
    client.on("message", listen);
}


//Officially starts the game by resetting the board and sending a message
let Initialisation = function(channel) {
    round++;
    Init = true;
    checkBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    board = [[":blue_square:", ":blue_square:", ":blue_square:"], [":blue_square:", ":blue_square:", ":blue_square:"], [":blue_square:", ":blue_square:", ":blue_square:"]]
    if (round == 1) channel.send("Game registered");
    channel.send(`Round ${round} out of ${totRounds} has started:\n${player1.username} goes first`);
    writeBoardState(channel);
}

//Literally just 1 line to send a message with the board
let writeBoardState = function(channel) {
    channel.send(board.join("\n"));
}

//resets variables and turns of the listener
let endGame = function(client, listen) {
    bool = false;
    Init = false;
    LeaderboardUpdate(player1);
    LeaderboardUpdate(player2);
    player1 = {username: "", id: "", wins: 0, gamesPlayed: 0};
    player2 = {username: "", id: "", wins: 0, gamesPlayed: 0};
    turn = "player1";
    totRounds = 0;
    round = 0;
    client.off("message", listen);
}

//Processes player 1's turn
let player1Turn = function(channel, args) {
    board[args[0]-1][args[1]-1] = ":regional_indicator_x:";
    checkBoard[args[0]-1][args[1]-1] = 1;
    writeBoardState(channel);
    turn = "player2";
    
}

//Processes player 2's turn
let player2Turn = function(channel, args) {
    board[args[0]-1][args[1]-1] = ":regional_indicator_o:";
    checkBoard[args[0]-1][args[1]-1] = 4;
    writeBoardState(channel);
    turn = "player1";
}


//Checks for winning boards
let winCheck = function(message, client, listen) {
    let Sums = [0, 0, 0, 0] //Sum of rows; Sum of columns; Sum of left diagonal; Sum of right diagonal
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            Sums[0] += checkBoard[x][y];
            Sums[1] += checkBoard[y][x];
        }
        Sums[2] += checkBoard[x][x];
        Sums[3] += checkBoard[x][2-x];
        //Checks if someone won with rows or columns
        if (Sums[0] == 3 || Sums[1] == 3) return winnerAnn(message, player1, client, listen);
        else if (Sums[0] == 12 || Sums[1] == 12) return winnerAnn(message, player2, client, listen);
        Sums[0] = 0;
        Sums[1] = 0;
    }
    //Checks if someone won with diagonals
    if (Sums[2] == 3 || Sums[3] == 3) return winnerAnn(message, player1, client, listen);
    else if (Sums[2] == 12 || Sums[3] == 12) return winnerAnn(message, player2, client, listen);
    //Checks for when the board is full
    else if (board.every(x => x.every(y => y != ":blue_square:"))) return winnerAnn(message, player1, client, listen, true);

    //Writes whose turn it is; Moved here from playerXTurn, so that it won't be written after the games finishes
    else message.channel.send(`It is now **${eval(turn + ".username")}'s** turn`);
}


//Announces the winner, possibly start the next round and at the end of a multi-round game, sends a stat report
let winnerAnn = function(message, player, client, listen, isTie) {
    if (!isTie) {
    message.channel.send("Congratulations **" + player.username + "**! You won!");
    player.wins += 1;
    }
    else message.channel.send("The board is now full and no one won, so this round ends as a **tie**!");
    if (round < totRounds) {
        message.channel.send("This round has now finished")
        turn = "player1";
        let temp = player1;
        player1 = player2;
        player2 = temp;
        Initialisation(message.channel);
    }
    else {
        //Sends the final winner from a multi round game
        if (totRounds > 1) {
            message.channel.send(`\n**${player1.username}** won **${player1.wins}** out of **${totRounds}** rounds
**${player2.username}** won **${player2.wins}** out of **${totRounds}** rounds`);
            if (player1.wins < player2.wins) message.channel.send(`That means that **${player2.username}** won the game!`);
            else if (player1.wins > player2.wins) message.channel.send(`That means that **${player1.username}** won the game!`);
            else message.channel.send("That means that the game ends as a **tie**!");
        }
        message.channel.send("```Game finished```");
        endGame(client, listen)
    }
    //Games played only goes up once a games has finished
    player1.gamesPlayed += 1;
    player2.gamesPlayed += 1;
}


//That's a lot of Leaderboard
//Either enters a new player, or updates an existing player in the leaderboard
//Also stops people from farming wins by playing by themselves
let LeaderboardUpdate = function(player) {
    if (player1.id == player2.id) return;
    else if (Leaderboard.hasOwnProperty(player.id)){
        let temp = Leaderboard.scores.indexOf(Leaderboard[player.id].wins)
        Leaderboard[player.id].wins +=  player.wins;
        Leaderboard.scores[temp] = Leaderboard[player.id].wins;
        Leaderboard.scores.sort();
        Leaderboard[player.id].gamesPlayed += player.gamesPlayed;
        return;
    }
    else {
        Leaderboard.scores.push(player.wins);
        Leaderboard.scores.sort();
        Leaderboard[player.id] = Object.create(Leaderboard.Player);
        Leaderboard[player.id].wins = player.wins;
        Leaderboard[player.id].gamesPlayed = player.gamesPlayed;
    }
    Leaderboard[player.id].username = player.username;
    Leaderboard[player.id].rank = Leaderboard.scores.indexOf(Leaderboard[player.id].wins) + 1;
    fs.writeFileSync("./leaderboard-tictactoe.json", JSON.stringify(Leaderboard));
}


//Sorts array of scores and updates every players rank
let RankingUpdate = function() {
    Leaderboard.scores.sort((a, b) => b - a);
    for (x in Leaderboard) {
        if (typeof Leaderboard[x] == "object") Leaderboard[x].rank = Leaderboard.scores.indexOf(Leaderboard[x].wins) + 1;
    }
    fs.writeFileSync("./leaderboard-tictactoe.json", JSON.stringify(Leaderboard));
}


//Returns a formatted string containing the top 10 and the message author's position on the leaderboard
let writeLeaderboard = function(id) {
    RankingUpdate();
    let arr = [];
    let str = "";
    for (x in Leaderboard) {
        if (x != "Player" && !(Leaderboard[x] instanceof Array)) {
            arr.push([Leaderboard[x].rank, Leaderboard[x].username, Leaderboard[x].wins, Leaderboard[x].gamesPlayed])
        }
    }
    arr.sort((a, b) => a[0] - b[0]);
    for (let x = 0; x < 10 && x < arr.length; x++) {
        str += "**" + arr[x][1] + "**: \`rank " + arr[x][0] + "\`\nWins: " + arr[x][2] + ", Games played: " + arr[x][3] + "\n"
    }
    if (Leaderboard.hasOwnProperty(id)) str += "\nYou are currently \`rank " + Leaderboard[id].rank + "\`\nWins: " + Leaderboard[id].wins + ", Games played: " + Leaderboard[id].gamesPlayed;
    else str += "You are not on the leaderboard. If you think this is a mistake, please DM Dune Ranger#4123";
    return str;
}


//Returns a formatted string containing the position of a person on the leaderboard 
let writePosition = function(id) {
    let str = "";
    if (Leaderboard.hasOwnProperty(id)) str += Leaderboard[id].username + " is \`rank " + Leaderboard[id].rank + "\`\nWins: " + Leaderboard[id].wins + ", Games played: " + Leaderboard[id].gamesPlayed;
    else str += "This person is not on the leaderboard. If you think this is a mistake, please DM Dune Ranger#4123";
    return str;
}


//Returns a formatted string containing the message author's position on the leaderboard
let writeOwnPosition = function(id) {
    RankingUpdate();
    let str = "";
    if (Leaderboard.hasOwnProperty(id)) str += "You are currently \`rank " + Leaderboard[id].rank + "\`\nWins: " + Leaderboard[id].wins + ", Games played: " + Leaderboard[id].gamesPlayed;
    else str += "You are not on the leaderboard. If you think this is a mistake, please DM Dune Ranger#4123";
    return str;
}