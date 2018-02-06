var activePlaceholder = function activePlaceholder(element) {
  var action = function action() {
    if (element.val()) {
      element.addClass("form__input_fill");
    } else {
      element.removeClass("form__input_fill");
    }
  };

  element.on("blur", action).addClass("active");
};

{
  $(document).ready(function () {
    /* Включение активных плэйсхолдеров для текстовых полей. 
       Если ДжаваСкрипт отключен, то плэйсхолдеры будут помещены
       на свое место при помощий CSS 
    */
    $("[data-active-placeholder=\"true\"]").each(function (index, elemetnt) {
      activePlaceholder($(elemetnt));
    });
    /* Скрипты для Basic */

    var basicContext = $(".basic-info"); // Скрыть поле иной джоб роли

    var otherInputContainer = basicContext.find("input[name=\"other\"]").closest(".form__control-container").hide();
    var jobRoleSelect = basicContext.find("select[name=\"jobRole\"]"); // ВАЖНО: для автофокуса на поле имя я использовал HTML5 атрибут autofocus.
    // Если вы не жалуете HTML5, то прошу меня помиловать за то, что не бегу
    // за мастерами по пятам, а раскомментировать нижепредставленную строчку
    // джаваскрипта и удалить autofocus из разметки. Но если королям не снизойти
    // до плебса, то так и быть - отвергните мой проект и я сделаю это для вас
    // basicContext.find(`[name="name"]`).focus();

    /* Функция, которая отвечает за видимость поля иной джоб роли в зависимости от выбора
       в джоб роль селект
    */

    var toggleOther = function toggleOther(element) {
      /*
          Full Stack JS Developer = 1
          Front End Developer = 2
          Back End Developer = 3
          Designer = 4
          Student = 5
          Other = 6
      */
      var role = parseInt(element.val(), 10);

      if (role === 6) {
        otherInputContainer.show();
      } else {
        otherInputContainer.hide();
      }
    }; // Обработчик события чэндж на джоб роль селекте


    jobRoleSelect.on("change", function (e) {
      return toggleOther($(e.target));
    });
    /* На всякий случай при инициализации приложения вызвать функцию
       проверки выбранной роли (если вдруг значение Озер будет по 
       умолчанию) 
    */

    toggleOther(jobRoleSelect);
    /* Скрипты для T-Shirt */
    // Выбираем необходимые для работы элементы

    var tShirtContext = $(".t-shirt-info");
    var colorSelect = tShirtContext.find("select[name=\"color\"]");
    var colorSelectContainer = colorSelect.closest(".form__control-container").hide();
    var colors = colorSelect.find("option");
    var themeSelect = tShirtContext.find("select[name=\"design\"]");
    /* Функция, которая отвечает за наполнения колор селекта и его видимость
       в зависимости от выбора дизайна футболки 
    */

    var toggleColor = function toggleColor(element) {
      /*
          Theme - JS Puns = 1
          Theme - I love JS = 2
      */
      var theme = parseInt(element.val(), 10);

      if (theme) {
        var options = colors.filter(function (idx, option) {
          var optionsTheme = $(option).data("theme");
          return optionsTheme === "all" || optionsTheme === theme;
        });
        colorSelect.html(options);
        colorSelect.val("");
        colorSelectContainer.show();
      } else {
        var _options = colors.filter(function (idx, option) {
          return $(option).data("theme") === "empty";
        });

        colorSelect.html(_options);
        colorSelectContainer.hide();
      }
    }; // Обработчик события чэндж для селекта дизайна футболки


    themeSelect.on("change", function (e) {
      return toggleColor($(e.target));
    });
    /* На всякий случай при инициализации приложения вызвать функцию
       проверки доступности цветов (если вдруг по умолчанию будет выбран
       какой-то дизайн) 
    */

    toggleColor(themeSelect);
    /* Скрипты для Activities */
    // Выбираем необходимые для работы элементы

    var activitiesContext = $(".activities-info");
    var totalElement = $("\n            <div class=\"activities-total-cost\">\n                <span>Total: </span>\n                <span class=\"cost\"></span>\n            </div>\n        ").appendTo(activitiesContext).hide();
    var total = 0; // Выводим или скрываем поле с общей суммой на выбранные активитис

    var toggleTotal = function toggleTotal() {
      var totalCost = totalElement.find(".cost");
      totalCost.text("$".concat(total));
      total ? totalElement.show() : totalElement.hide();
    }; // Выбор чекбоксов из ДОМ и обработка события чэндж


    var activities = activitiesContext.find("input[type=\"checkbox\"]");
    activities.on("change", function (e) {
      var target = $(e.target);
      var isChecked = target.prop("checked");
      var cost = target.data("cost");
      isChecked ? total += cost : total -= cost;
      toggleTotal(); // Если активити пересекается по времени с другими активити то их задизэйблить

      var time = target.data("time");
      activities.each(function (item, element) {
        element = $(element);

        if (!element.is(target) && element.data("time") === time) {
          element.prop("disabled", isChecked);
        }
      });
    });
    /* Скрипты для Payment */
    // Выбираем необходимые для работы элементы

    var paymentContext = $(".payment-info");
    var methods = paymentContext.find(".info").hide();
    var methdosSelect = paymentContext.find("select[name=\"paymentMethod\"]"); // Выбираем метод оплаты

    var toggleMethodInfo = function toggleMethodInfo(element) {
      /*
          Credit Card = 1
          PayPal = 2
          Bitcoin = 3
      */
      var method = parseInt(element.val(), 10);
      methods.each(function (idx, info) {
        info = $(info);
        info.data("method") === method ? info.show() : info.hide();
      });
    };

    methdosSelect.on("change", function (e) {
      return toggleMethodInfo($(e.target));
    });
    toggleMethodInfo(methdosSelect); // Дабавление специальных методов валидации на поля формы

    var form = $("#registerForm"); // ВАЛИДАТОР: обязательность выбора, осуществляется по наличию у поля значения

    var required = function required(input) {
      var messenge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Field is required";
      return input.val() ? {
        errorName: "required"
      } : {
        messenge: messenge,
        errorName: "required"
      };
    }; // ВАЛИДАТОР: адрес электронной почты, осуществляется по регулярному выражению


    var email = function email(input) {
      var regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
      return regex.test(input.val().toLowerCase()) ? {
        errorName: "email"
      } : {
        messenge: "expamle@treehouse.com",
        errorName: "email"
      };
    }; // ВАЛИДАТОРЫ: номер карты, индекс и свв, осуществляется по регулярному выражению


    var cardNumber = function cardNumber(input) {
      var regex = /^[0-9]{13,16}$/;
      return regex.test(input.val().toLowerCase()) ? {
        errorName: "card-number"
      } : {
        messenge: "digits fron 13 to 16",
        errorName: "card-number"
      };
    };

    var zip = function zip(input) {
      var regex = /^[0-9]{5}$/;
      return regex.test(input.val()) ? {
        errorName: "zip"
      } : {
        messenge: "5 digits",
        errorName: "zip"
      };
    };

    var cvv = function cvv(input) {
      var regex = /^[0-9]{3}$/;
      return regex.test(input.val()) ? {
        errorName: "cvv"
      } : {
        messenge: "3 digits",
        errorName: "cvv"
      };
    }; // СПЕЦИАЛЬНЫЙ ВАЛИДАТОР выбронных активити


    var checkActivities = function checkActivities(container) {
      var valid = false;
      activities.each(function (idx, checkbox) {
        if ($(checkbox).is(":checked")) {
          valid = true;
        }
      });

      if (valid) {
        container.removeClass("state_error");
        container.find(".form__control-validation-messenge").remove();
      } else if (!container.hasClass("state_error")) {
        container.addClass("state_error");
        container.prepend("<div class=\"form__control-validation-messenge\">\n                        <span>Select activities</span>\n                    </div>");
      }

      return valid;
    };
    /* Универсальный метод, который отображает или скрывает ошибку
       в зависимости от результатов валидатора
    */


    var toggleError = function toggleError(input, _ref) {
      var messenge = _ref.messenge,
          errorName = _ref.errorName;
      var container = input.closest(".form__control-container");

      var clear = function clear() {
        var all = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        input.removeClass("state_error");
        input.data("error", false);
        container.find(".form__control-validation-messenge".concat(all ? "" : ".error_".concat(errorName))).remove();
      }; // Если элемент не видим (скрыт) - то валидировать не нужно


      if (!input.is(":visible")) {
        clear();
        return true;
      }

      if (!messenge) {
        clear(false);
        return true;
      } else if (input.data("error") !== errorName) {
        clear();
        input.addClass("state_error");
        input.data("error", errorName);
        container.append("<div class=\"form__control-validation-messenge error_".concat(errorName, "\">\n                        <span>").concat(messenge, "</span>\n                    </div>"));
      }

      return false;
    }; // Переместиться на первую ошибку


    var scrollToFirstError = function scrollToFirstError() {
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


    form.find("[name=\"name\"]").on("input", function (e) {
      var input = $(e.target);
      toggleError(input, required(input));
    }).data("custom-validation", function (input) {
      return toggleError(input, required(input));
    });
    form.find("[name=\"email\"]").on("input", function (e) {
      var input = $(e.target);
      toggleError(input, required(input)) && toggleError(input, email(input));
    }).data("custom-validation", function (input) {
      return toggleError(input, required(input)) && toggleError(input, email(input));
    });
    form.find("[name=\"cardNumber\"]").on("input", function (e) {
      var input = $(e.target);
      toggleError(input, cardNumber(input));
    }).data("custom-validation", function (input) {
      return toggleError(input, cardNumber(input));
    });
    form.find("[name=\"cardZipCode\"]").on("input", function (e) {
      var input = $(e.target);
      toggleError(input, zip(input));
    }).data("custom-validation", function (input) {
      return toggleError(input, zip(input));
    });
    form.find("[name=\"cardCVV\"]").on("input", function (e) {
      var input = $(e.target);
      toggleError(input, cvv(input));
    }).data("custom-validation", function (input) {
      return toggleError(input, cvv(input));
    });
    form.find("[name=\"paymentMethod\"]").on("input", function (e) {
      var input = $(e.target);
      toggleError(input, required(input, "Please, select payment method."));
    }).data("custom-validation", function (input) {
      return toggleError(input, required(input, "Please, select payment method."));
    });
    form.find("[name*=\"activity-\"]").on("change", function () {
      checkActivities(activitiesContext);
    });
    activitiesContext.data("custom-validation", checkActivities);
    $("#btnRegister").on("click", function (e) {
      e.preventDefault();
      var valid = true; // На все обязательные для проверки поля в разметке был навешен специальный data-атрибут

      form.find("[data-val=\"true\"]").each(function (idx, element) {
        element = $(element);
        var validator = element.data("custom-validation");

        if (typeof validator === "function") {
          if (!validator(element)) {
            valid = false;
          }
        }
      }); // Если форма валидна

      if (valid) {
        // отправить форму
        form.submit();
      } else {
        // если не валидна - скролл на первую ошибку
        scrollToFirstError();
      }
    });
  });
}