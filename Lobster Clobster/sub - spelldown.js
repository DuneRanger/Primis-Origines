
let vowels = ["A", "E", "I", "O", "A", "E", "I", "O", "U"];
let consonants = ["B", "C", "D", "B", "C", "D","F", "G", "H", "H", "J", "K", "L", "M", "N", "L", "M", "N", "L", "P", "Q", "R", "S", "R", "S", "R", "S", "T", "T", "V", "W", "X", "Y", "Z"];
let choice = [];

module.exports = function spelldown(msg, vows = 3, cons = 3, client) {
    choice = [];
    for (;vows > 0; vows--) {
        choice.push(vowels[Math.floor(Math.random()*9)])
    }
    while (choice.length < 9) {
        choice.push(consonants[Math.floor(Math.random()*34)])
    }
    
    msg.channel.send("This is the letter choice:\n```" + choice.join("  ") + "```\nYou now have 35 seconds to send your longest word");

    setTimeout(function() {
        msg.channel.send("Time is up");
    }, 35000);
}