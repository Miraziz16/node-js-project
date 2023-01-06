let express = require('express');
let app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 8000;

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

/* Casino Crash Game Start Project Express Js, Socket IO */

let amount_numbers = 3000;
let timer_delay_nums = 0;
let timer_max_nums = 10;
let start_nums = 1;
let nums_fixed = null;

let left_press_number_min = 400;
let left_press_numbers = 4000;
let left_press_number_max = 4000;
let All_Array_Istoriya = [];

let left_press_speed = 1;
let random_stop_nums = null;

let start_nums_speed = 0.005;
let stop_admin_game = false;

function Global_Function() {

    random_stop_nums = Math.random() * 50;
    io.emit('random_stop_nums', random_stop_nums);

    Inner_Global_Number();

    function Inner_Global_Number() {

        if (start_nums < random_stop_nums) {

            stop_admin_game = true;

            start_nums += start_nums_speed;
            io.emit('start_number', start_nums);
            io.emit('random_stop_nums', random_stop_nums);
            nums_fixed = start_nums.toFixed(2);
            let svg_width_100 = (start_nums - 1) * 40;

            if (start_nums > 4) {
                start_nums_speed = 0.015;
            } else {
                start_nums_speed = 0.005;
            }

            if (svg_width_100 <= 100) {

                /* Svg Content Width min 0, max 100 */
                io.emit('fuchsia_svg_width', svg_width_100);
                /* Svg Content Width min 0, max 100 */

            } else {
                io.emit('fuchsia_svg_width', 100);
            }
            if (svg_width_100 > 80) {

                if (left_press_numbers >= left_press_number_min) {

                    left_press_numbers -= left_press_speed;

                    /* Left Content Numbers Press */
                    io.emit('left_press_numbers', left_press_numbers);

                }
            }

            /* Start Number Function 25.53x */
            io.emit('number_fixed', nums_fixed);
            /* Start Number Function 13.27x */

            setTimeout(() => {
                Inner_Global_Number();
            }, 1);

        } else {

            io.emit('start_number', start_nums);

            stop_admin_game = false;
            stop_btn_boolean = false;

            let random_color_istoria = Math.floor(Math.random() * 360);
            let colors = `color: hsl(${random_color_istoria}, 100%, 50%); text-shadow: 0px 1px 9px hsl(${random_color_istoria}, 100%, 50%)`;

            All_Array_Istoriya.push({
                istoriya_number: `${nums_fixed}x`,
                istoriya_colors: colors
            });

            if (All_Array_Istoriya.length > 9) {
                All_Array_Istoriya.splice(0, 1);
            }

            io.emit('story', All_Array_Istoriya);

            setTimeout(() => {
                nums_fixed = 1;

                Global_Timer_Function();
                left_press_numbers = left_press_number_max;

            }, 2000);

        }

    }

}

Global_Timer_Function();

function Global_Timer_Function() {
    if (timer_max_nums > timer_delay_nums) {

        timer_max_nums -= 0.1;
        io.emit('timer_number', timer_max_nums);

        setTimeout(() => {
            Global_Timer_Function();
        }, 100);

    } else {
        setTimeout(() => {

            start_nums = 1;
            timer_max_nums = 10;
            io.emit('fuchsia_svg_width', 0);
            io.emit('left_press_numbers', left_press_numbers);

            Global_Function();

        }, 1000);

    }
}

/* Casino Crash Game END Project Express Js, Socket IO */



io.on('connection', function(socket) {

    io.emit('story', All_Array_Istoriya);
    io.emit('amount_number', amount_numbers);
    socket.on('amount_number', function(data) {
        amount_numbers = data;
        io.emit('amount_number', amount_numbers);
    });
    socket.on('random_start_numbers', function(data) {
        random_stop_nums = data;
        io.emit('random_stop_nums', random_stop_nums);
    });

    socket.on('disconnect', function() {});

});

http.listen(port, function() {
    console.log(`Server localhost: ${port}`);
});