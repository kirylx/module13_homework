/* 
Картинки берем из https://jsonplaceholder.typicode.com/photos. Там их 5000 штук.
Сначала отправляем запрос через API JSON placeholder, получаем массив с объектами картинок.
После загрузки страницы и окончания запроса, показываем картинку номер 1. ID -> URL. 
Кнопки назад - вперед изменяют ID картинки. Логика привязана к длине массива 
и не зависит от количества картинок.
После нажатия на кнопку и изменения ID картинки читаем ее URL и изменяем элемент img.src
Ну и поле caption, чтобы видеть как меняется ID. 

Что не нравится: 
Мне кажется, я не совсем правильно использовал связки async/await + .then. 
Мне кажется, можно это сделать как-то более оптимально. 
Если сразу показывать div с каруселью еще до получения ответа от JSON placeholder, 
то на секунду после загрузки страницы появляется пустой div с надписью Not found (img.alt).
Поэтому сделал его невидимым до момента загрузки первой картинки. Хотя мне снова кажется,
что есть опция сделать это более правильно (оптимальнее). 
*/

// C async/await и коллбэками всё в порядке - всё сделано вполне оптимально и правильно. Единственное, что мне не нравится в вашем коде - это функция imageSearch. Она при каждом переключении слайда перебирает целый массив с 5000 картинок, хотя в этом нет никакой необходимости - мы точно знаем номер картинки, которую хотим получить. Стоило завязаться не на id картинок, а на порядковый номер, тогда будет легко найти изображение в массиве по индексу и не перебирать целый массив.
// carouselContainer.style.display = "block"; - вот этот момент можно чуть улучшить, добавляя и убирая класс (например, у элемента изначально будет класс .is-hidden, который его скрывает, а при загрузке вы этот класс уберете) вместо прямого исправления свойства display. Дело в том, что вы не знаете, какое значение display должно быть у слайдера по умолчанию, может, это будет не block, а flex? В таком случае  display: block поломает верстку. С классом всё проще, потому что когда вы уберете "скрывающий класс", значение display вернется к значению по умолчанию.
// Других проблем в коде не вижу, всё аккуратно и делу, слайдер работает правильно. Хорошая работа :)

// FIND ELEMENTS

const buttonBack = document.querySelector(".back");
const buttonForward = document.querySelector(".forward");
const carouselImg = document.querySelector("#img");
const carouselCaption = document.querySelector(".caption");
const carouselContainer = document.querySelector(".container");

// FETCH DATA FROM JSONPLACEHOLDER

async function getImages() {
    try {
        const getImagesResponse = await fetch(
            "https://jsonplaceholder.typicode.com/photos"
        );

        if (!getImagesResponse.ok) {
            throw new Error(getImagesResponse.status);
        } else {
            const images = await getImagesResponse.json();
            return images;
        }
    } catch (error) {
        console.log(
            `Error occurred while getting images from json placeholder. ${error}`
        );
    }
}

// WHEN PROMISE IS RESOLVED, LOAD IMAGE

getImages().then((images) => {
    console.log(images);

    let imageId = 1;
    carouselContainer.style.display = "block";

    function imageSearch(imageId) {
        images.map((image) => {
            if (image.id === imageId) {
                carouselImg.src = image.url;
                carouselCaption.innerHTML = image.id;
            }
        });
    }

    // BUTTON CALLBACKS (HANDLERS)

    const goBack = () => {
        if (imageId === 1) {
            imageId = images.length;
            imageSearch(imageId);
        } else {
            imageId--;
            imageSearch(imageId);
        }
    };
    const goForward = () => {
        if (imageId === images.length) {
            imageId = 1;
            imageSearch(imageId);
        } else {
            imageId++;
            imageSearch(imageId);
        }
    };

    // ASSIGN BUTTON LISTENERS

    buttonBack.addEventListener("click", goBack);
    buttonForward.addEventListener("click", goForward);

    // SHOW FIRST IMAGE (INITIAL PAGE LOAD)
    imageSearch(imageId);
});
