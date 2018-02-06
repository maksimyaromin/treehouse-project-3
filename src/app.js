const activePlaceholder = (element) => {
    const action = () => {
        if(element.val()) {
            element.addClass("form__input_fill");
        } else {
            element.removeClass("form__input_fill");
        }
    };
    element.on("blur", action).addClass("active");
};

{
    $(document).ready(() => {

        /* Включение активных плэйсхолдеров для текстовых полей. 
           Если ДжаваСкрипт отключен, то плэйсхолдеры будут помещены
           на свое место при помощий CSS 
        */
        $(`[data-active-placeholder="true"]`).each((index, elemetnt) => {
            activePlaceholder($(elemetnt));
        });

        /* Скрипты для Basic */
        const basicContext = $(".basic-info");
        // Скрыть поле иной джоб роли
        const otherInputContainer = basicContext.find(`input[name="other"]`)
            .closest(".form__control-container")
            .hide();
        const jobRoleSelect = basicContext.find(`select[name="jobRole"]`);

        // ВАЖНО: для автофокуса на поле имя я использовал HTML5 атрибут autofocus.
        // Если вы не жалуете HTML5, то прошу меня помиловать за то, что не бегу
        // за мастерами по пятам, а раскомментировать нижепредставленную строчку
        // джаваскрипта и удалить autofocus из разметки. Но если королям не снизойти
        // до плебса, то так и быть - отвергните мой проект и я сделаю это для вас
        // basicContext.find(`[name="name"]`).focus();

        /* Функция, которая отвечает за видимость поля иной джоб роли в зависимости от выбора
           в джоб роль селект
        */
        const toggleOther = (element) => {
            /*
                Full Stack JS Developer = 1
                Front End Developer = 2
                Back End Developer = 3
                Designer = 4
                Student = 5
                Other = 6
            */
            const role = parseInt(element.val(), 10);
            if(role === 6) {
                otherInputContainer.show();
            } else {
                otherInputContainer.hide();
            }
        };
        // Обработчик события чэндж на джоб роль селекте
        jobRoleSelect.on("change", e => toggleOther($(e.target)));
        /* На всякий случай при инициализации приложения вызвать функцию
           проверки выбранной роли (если вдруг значение Озер будет по 
           умолчанию) 
        */
        toggleOther(jobRoleSelect);

        /* Скрипты для T-Shirt */
        // Выбираем необходимые для работы элементы
        const tShirtContext = $(".t-shirt-info");
        const colorSelect = tShirtContext.find(`select[name="color"]`);
        const colorSelectContainer = colorSelect.closest(".form__control-container")
            .hide();
        const colors = colorSelect.find("option");
        const themeSelect = tShirtContext.find(`select[name="design"]`);
        
        /* Функция, которая отвечает за наполнения колор селекта и его видимость
           в зависимости от выбора дизайна футболки 
        */
        const toggleColor = (element) => {
            /*
                Theme - JS Puns = 1
                Theme - I love JS = 2
            */
            const theme = parseInt(element.val(), 10);
            if(theme) {
                const options = colors.filter((idx, option) => {
                    const optionsTheme = $(option).data("theme");
                    return optionsTheme === "all" 
                        || optionsTheme === theme;
                });
                colorSelect.html(options);
                colorSelect.val("");
                colorSelectContainer.show();
            } else {
                const options = colors.filter((idx, option) => {
                    return $(option).data("theme") === "empty";
                });
                colorSelect.html(options);
                colorSelectContainer.hide();
            }
        };
        // Обработчик события чэндж для селекта дизайна футболки
        themeSelect.on("change", e => toggleColor($(e.target)));
        /* На всякий случай при инициализации приложения вызвать функцию
           проверки доступности цветов (если вдруг по умолчанию будет выбран
           какой-то дизайн) 
        */
        toggleColor(themeSelect);

        /* Скрипты для Activities */
        // Выбираем необходимые для работы элементы
        const activitiesContext = $(".activities-info");
        const totalElement = $(`
            <div class="activities-total-cost">
                <span>Total: </span>
                <span class="cost"></span>
            </div>
        `).appendTo(activitiesContext).hide();
        let total = 0;

        // Выводим или скрываем поле с общей суммой на выбранные активитис
        const toggleTotal = () => {
            const totalCost = totalElement.find(".cost");
            totalCost.text(`$${total}`);
            total 
                ? totalElement.show()
                : totalElement.hide();
        };

        // Выбор чекбоксов из ДОМ и обработка события чэндж
        const activities = activitiesContext.find(`input[type="checkbox"]`);
        activities.on("change", (e) => {
            const target = $(e.target);
            const isChecked = target.prop("checked");
            
            const cost = target.data("cost");
            isChecked 
                ? total += cost
                : total -= cost; 
            toggleTotal();

            // Если активити пересекается по времени с другими активити то их задизэйблить
            const time = target.data("time");
            activities.each((item, element) => {
                element = $(element);
                if(!element.is(target) && element.data("time") === time) {
                    element.prop("disabled", isChecked);
                }
            });
        });

        /* Скрипты для Payment */
        // Выбираем необходимые для работы элементы
        const paymentContext = $(".payment-info");
        const methods = paymentContext.find(".info").hide();
        const methdosSelect = paymentContext.find(`select[name="paymentMethod"]`);

        // Выбираем метод оплаты
        const toggleMethodInfo = (element) => {
            /*
                Credit Card = 1
                PayPal = 2
                Bitcoin = 3
            */
            const method = parseInt(element.val(), 10);
            methods.each((idx, info) => {
                info = $(info);
                info.data("method") === method
                    ? info.show()
                    : info.hide();
            });
        };
        methdosSelect.on("change", e => toggleMethodInfo($(e.target)));
        toggleMethodInfo(methdosSelect);

        // Дабавление специальных методов валидации на поля формы
        const form = $("#registerForm");
        // ВАЛИДАТОР: обязательность выбора, осуществляется по наличию у поля значения
        const required = (input, messenge = "Field is required") => {
            return input.val() 
                ? {
                    errorName : "required"
                }
                : { 
                    messenge, 
                    errorName : "required" 
                };
        };
        // ВАЛИДАТОР: адрес электронной почты, осуществляется по регулярному выражению
        const email = (input) => {
            var regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
            return regex.test(input.val().toLowerCase()) 
                ? {
                    errorName: "email"
                }
                : {
                    messenge: "expamle@treehouse.com",
                    errorName: "email"
                };
        };
        // ВАЛИДАТОРЫ: номер карты, индекс и свв, осуществляется по регулярному выражению
        const cardNumber = (input) => {
            var regex = /^[0-9]{13,16}$/;
            return regex.test(input.val().toLowerCase()) 
                ? {
                    errorName: "card-number"
                }
                : {
                    messenge: "digits fron 13 to 16",
                    errorName: "card-number"
                };
        };
        const zip = (input) => {
            var regex = /^[0-9]{5}$/;
            return regex.test(input.val()) 
                ? {
                    errorName: "zip"
                }
                : {
                    messenge: "5 digits",
                    errorName: "zip"
                };
        };
        const cvv = (input) => {
            var regex = /^[0-9]{3}$/;
            return regex.test(input.val()) 
                ? {
                    errorName: "cvv"
                }
                : {
                    messenge: "3 digits",
                    errorName: "cvv"
                };
        };
        // СПЕЦИАЛЬНЫЙ ВАЛИДАТОР выбронных активити
        const checkActivities = (container) => {
            let valid = false;
            activities.each((idx, checkbox) => {
                if($(checkbox).is(":checked")) {
                    valid = true;
                }
            });
            if(valid) {
                container.removeClass("state_error");
                container.find(`.form__control-validation-messenge`)        .remove();
            } else if(!container.hasClass("state_error")) {
                container.addClass("state_error");
                container.prepend(
                    `<div class="form__control-validation-messenge">
                        <span>Select activities</span>
                    </div>`
                );
            }
            return valid;
        };
        /* Универсальный метод, который отображает или скрывает ошибку
           в зависимости от результатов валидатора
        */
        const toggleError = (input, { messenge, errorName }) => {
            const container = input.closest(".form__control-container");
            const clear = (all = true) => {
                input.removeClass("state_error");
                input.data("error", false);
                container.find(`.form__control-validation-messenge${all ? "" : `.error_${errorName}`}`).remove();
            };
            // Если элемент не видим (скрыт) - то валидировать не нужно
            if(!input.is(":visible")) {
                clear();
                return true;
            }
            if(!messenge) { 
                clear(false);
                return true;
            } else if(input.data("error") !== errorName) {
                clear();
                input.addClass("state_error");
                input.data("error", errorName);
                container.append(
                    `<div class="form__control-validation-messenge error_${errorName}">
                        <span>${messenge}</span>
                    </div>`
                );
            } 
            return false;
        };
        // Переместиться на первую ошибку
        const scrollToFirstError = () => {
            $("html, body").animate({
                scrollTop: $(".form__control-validation-messenge").eq(0).offset().top - 70
            }, 500);
        };

        /* Установка валидаций на все заявленные по условиям задачи поля: а именно имени,
           адреса электронной почты, номера карты, индекса и свв, активитис а так же одного 
           не заявленного поля - выбран ли метод оплаты?
           Все валидаторы работают как после нажатия кнопки отправить, так и в режиме реального времени.
           Для срабатывания по кнопке используется трюк с data-атрибутом. Валидаторы навешиваются в конкретном
           месте для того, чтобы в случае реального использования легко можно было бы перейти на проверенный
           плагин валидации, а не использовать велосипед.
        */
        form.find(`[name="name"]`).on("input", e => {
            const input = $(e.target);
            toggleError(input, required(input));
        }).data("custom-validation", input => toggleError(input, required(input)));

        form.find(`[name="email"]`).on("input", e => {
            const input = $(e.target);
            toggleError(input, required(input)) 
            && toggleError(input, email(input));
        }).data("custom-validation", input => toggleError(input, required(input)) && toggleError(input, email(input)));

        form.find(`[name="cardNumber"]`).on("input", e => {
            const input = $(e.target);
            toggleError(input, cardNumber(input));
        }).data("custom-validation", input => toggleError(input, cardNumber(input)));

        form.find(`[name="cardZipCode"]`).on("input", e => {
            const input = $(e.target);
            toggleError(input, zip(input));
        }).data("custom-validation", input => toggleError(input, zip(input)));

        form.find(`[name="cardCVV"]`).on("input", e => {
            const input = $(e.target);
            toggleError(input, cvv(input));
        }).data("custom-validation", input => toggleError(input, cvv(input)));

        form.find(`[name="paymentMethod"]`).on("input", e => {
            const input = $(e.target);
            toggleError(input, required(input, "Please, select payment method."));
        }).data("custom-validation", input => toggleError(input, required(input, "Please, select payment method.")));

        form.find(`[name*="activity-"]`).on("change", () => {
            checkActivities(activitiesContext);
        });
        activitiesContext.data("custom-validation", checkActivities);

        $("#btnRegister").on("click", e => {
            e.preventDefault();
            let valid = true;

            // На все обязательные для проверки поля в разметке был навешен специальный data-атрибут
            form.find(`[data-val="true"]`).each((idx, element) => {
                element = $(element);
                const validator = element.data("custom-validation");
                if(typeof validator === "function") {
                    if(!validator(element)) { valid = false; }
                }
            });

            // Если форма валидна
            if(valid) {
                // отправить форму
                form.submit();
            } else {
                // если не валидна - скролл на первую ошибку
                scrollToFirstError();
            }
        });
    });
}