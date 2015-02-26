function init() {
    canvas = document.getElementById('game_canvas');

    if (canvas.getContext) {
        context = canvas.getContext('2d');
        img = new Image();
        img.src = 'pacman10-hp-sprite.png'

        img.onload = function(){
            context.drawImage(img, 322, 0, 464, 140, 0, 0, 464, 140);
            context.drawImage(img, 100, 0, 20, 20, 2, 5, 20, 20);
        }; 
    }
    else {
        alert('Sorry, canvas is not supported on your browser!');
    }  
}     
