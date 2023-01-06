let socket = io();

const timer_container = document.querySelector('.timer_bar');
const timer_delay = document.querySelector('.timer_delay');
const stop_color_svg_red = document.getElementById('crash_line_top');

const text_element = document.querySelector('.text_element');
const div_coins_content_svg = document.querySelector('.width_rand');

const left_chart_nums = document.querySelector('.left_chart_nums');
const down_chart_nums = document.querySelector('.down_chart_nums');

const stop_game = document.getElementById('stop_game');

/* admin calculator start */

const amount_number_input = document.querySelector('.amount_input');
const amount_number_button = document.querySelector('.amount_btn');
const amount_number_text = document.querySelector('.amount_number');

let amount_numbers = 0;
socket.on('amount_number', (data) => {
    amount_numbers = data;
    amount_number_text.innerText = amount_numbers.toFixed(2);
});

let number_and_text_boolean = false;

amount_number_input.value.oninput = () => {
    let numbers_validation = /[0-9]/g;
    if (amount_number_input.value.match(numbers_validation)) {
        number_and_text_boolean = true;
    } else {
        number_and_text_boolean = false;
    }
}

amount_number_button.addEventListener('click', function() {
    let numbers_validation = /[0-9]/g;
    if (amount_number_input.value.match(numbers_validation)) {

        amount_number_input.type = "number";

        if (amount_numbers < 1000000) {
            amount_numbers += Number(amount_number_input.value);
            if (amount_numbers > 1000000) {
                amount_numbers = 1000000;
                amount_number_text.innerText = amount_numbers;
            }
            amount_number_text.innerText = amount_numbers;
            socket.emit('amount_number', amount_numbers);
            amount_number_input.value = '';
        } else {
            alert("Не может быть больше 1000000 чисел ! ! !");
        }


    } else {
        amount_number_input.style.color = "red";
        setTimeout(function() {
            amount_number_input.style.color = "white";
            setTimeout(function() {
                amount_number_input.style.color = "red";
                setTimeout(function() {
                    amount_number_input.style.color = "white";
                    setTimeout(function() {
                        amount_number_input.style.color = "red";
                        setTimeout(function() {
                            amount_number_input.style.color = "white";
                            setTimeout(function() {
                                if (number_and_text_boolean) {
                                    amount_number_input.value = "";
                                } else {
                                    /* Ok input coins true */
                                }
                            }, 1000);
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        }, 100);
    }
    amount_number_input.type = "text";
});

stop_game.addEventListener('click', function() {
    if (stop_admin_game) {
        stop_admin_game = false;
        socket.emit('random_start_numbers', 0);
    }
});

let timer_delay_nums = 0;
let timer_max_nums = 10;
let start_nums = 1;
let nums_fixed = null;

let left_press_number_min = 400;
let left_press_numbers = 4000;
let left_press_number_max = 4000;

let left_press_speed = 0.5;
let random_stop_nums = null;

left_chart_nums.style.cssText = `height: ${left_press_numbers}px;`;

let start_nums_speed = 0.001;
let stop_admin_game = false;

socket.on('random_stop_nums', (data) => {
    random_stop_nums = data;
});

socket.on('number_fixed', (data) => {
    text_element.innerText = `${data}x`;
});

socket.on('left_press_numbers', (data) => {
    left_chart_nums.style.cssText = `height: ${data}px;`;
});

socket.on('start_number', (data) => {

    start_nums = data;
    if (start_nums < random_stop_nums) {

        stop_admin_game = true;
        text_element.style.cssText = `color: #fff;`;
        timer_container.style.cssText = `display: none`;
        stop_color_svg_red.setAttribute('fill', '#ff65fa85');

    } else {

        stop_admin_game = false;
        text_element.style.cssText = `color: red;`;
        stop_color_svg_red.setAttribute('fill', 'red');

    }

});

socket.on('fuchsia_svg_width', (data) => {
    div_coins_content_svg.style.cssText = `width: ${data}%`;
});

socket.on('timer_number', (data) => {

    timer_max_nums = data.toFixed(1);
    if (timer_max_nums > timer_delay_nums) {

        timer_delay.innerText = timer_max_nums;
        timer_container.style.cssText = `display: flex; justify-content: center;`;
        text_element.style.cssText = `display: none;`;

    } else {

        setTimeout(function() {

            div_coins_content_svg.style.cssText = `width: ${start_nums}%`;
            timer_delay.innerText = '10';

            timer_container.style.cssText = `display: none`;
            stop_color_svg_red.setAttribute('fill', '#ff65fa85');

            text_element.style.cssText = `display: block;`;

        }, 1000);

    }

});

socket.on('story', (data) => {

    down_chart_nums.innerText = '';

    data.forEach(arrays => {

        let li = document.createElement('li');
        li.classList.add("nums_line_bottom");

        li.innerText = arrays.istoriya_number;
        li.style.cssText = arrays.istoriya_colors;

        down_chart_nums.appendChild(li);

    });

});