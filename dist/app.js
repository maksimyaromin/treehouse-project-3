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
    /* Placeholders activating for text fields.
    Whether JavaScript is disabled CSS will set placeholders 
    to its place.		   
    */
    $("[data-active-placeholder=\"true\"]").each(function (index, elemetnt) {
      activePlaceholder($(elemetnt));
    });
    /* Scripts for Basic */

    var basicContext = $(".basic-info"); // Hide other job role field

    var otherInputContainer = basicContext.find("input[name=\"other\"]").closest(".form__control-container").hide();
    var jobRoleSelect = basicContext.find("select[name=\"jobRole\"]"); // To focus on name field I used HTML5 attribute autofocus.

    /* function, which makes other job role field visible
    depending on job role select.		   
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
    }; // Change event-handler on job role select


    jobRoleSelect.on("change", function (e) {
      return toggleOther($(e.target));
    });
    /* Just in case while initializing an application start selected job role check function. 
    (in case Other in a default value) 
    */

    toggleOther(jobRoleSelect);
    /* Scripts for T-Shirt */
    // Choose elements which we need for work. 

    var tShirtContext = $(".t-shirt-info");
    var colorSelect = tShirtContext.find("select[name=\"color\"]");
    var colorSelectContainer = colorSelect.closest(".form__control-container").hide();
    var colors = colorSelect.find("option");
    var themeSelect = tShirtContext.find("select[name=\"design\"]");
    /* function which is responsible for color select content and its visibility
       depending on T-shirt design selected. 
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
    }; // Change event-handler for T-shirt design select.


    themeSelect.on("change", function (e) {
      return toggleColor($(e.target));
    });
    /* Just in case while initializing an application start color availability check function 
       (in case when default design is selected) 
    */

    toggleColor(themeSelect);
    /* Scripts for Activities */
    // Choose elements which we need for work

    var activitiesContext = $(".activities-info");
    var totalElement = $("\n            <div class=\"activities-total-cost\">\n                <span>Total: </span>\n                <span class=\"cost\"></span>\n            </div>\n        ").appendTo(activitiesContext).hide();
    var total = 0; // Enable or disable field with total sum on selected activities 

    var toggleTotal = function toggleTotal() {
      var totalCost = totalElement.find(".cost");
      totalCost.text("$".concat(total));
      total ? totalElement.show() : totalElement.hide();
    }; // Choosing check-boxes from DOM and change event handler


    var activities = activitiesContext.find("input[type=\"checkbox\"]");
    activities.on("change", function (e) {
      var target = $(e.target);
      var isChecked = target.prop("checked");
      var cost = target.data("cost");
      isChecked ? total += cost : total -= cost;
      toggleTotal(); // Disable activities which are time-crossing with another selected activities. 

      var time = target.data("time");
      activities.each(function (item, element) {
        element = $(element);

        if (!element.is(target) && element.data("time") === time) {
          element.prop("disabled", isChecked);
        }
      });
    });
    /* Scripts for Payment */
    // Choose elements which we need for work

    var paymentContext = $(".payment-info");
    var methods = paymentContext.find(".info").hide();
    var methdosSelect = paymentContext.find("select[name=\"paymentMethod\"]"); // Choose payment method 

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
    toggleMethodInfo(methdosSelect); // Add special validation methods on form fields

    var form = $("#registerForm"); // VALIDATOR: Choice obligation, is performed by field value featuring

    var required = function required(input) {
      var messenge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Field is required";
      return input.val() ? {
        errorName: "required"
      } : {
        messenge: messenge,
        errorName: "required"
      };
    }; // VALIDATOR: e-mail address, is performed by regular expressions


    var email = function email(input) {
      var regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
      return regex.test(input.val().toLowerCase()) ? {
        errorName: "email"
      } : {
        messenge: "expamle@treehouse.com",
        errorName: "email"
      };
    }; // VALIDATOR: card number, zip code and cvv, is performed by regular expressions


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
    }; // SPECIAL VALDATOR of selected activities 


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
    /* Generic method which displays or hides error message 
       depending on validation result 
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
      }; // If an element is disabled (hidden) - there is no validation


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
    }; // Move to the fist error 


    var scrollToFirstError = function scrollToFirstError() {
      $("html, body").animate({
        scrollTop: $(".form__control-validation-messenge").eq(0).offset().top - 70
      }, 500);
    };
    /* Validation is used for all fields required by task : i.e.,
       e-mail addresses, card numbers, zip codes and cvv, activities and also one not required by task field 
       - whether the payment method is selected?
       All validations work online as well as on send button click.
       Button is triggered by trick with data-attribute. Validation is being set in specified place
       for easy transfer to  sure plugins in case of real usage to avoid reinventing a wheel.
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
      var valid = true; // All required for validation fields where marked with special data-attribute

      form.find("[data-val=\"true\"]").each(function (idx, element) {
        element = $(element);
        var validator = element.data("custom-validation");

        if (typeof validator === "function") {
          if (!validator(element)) {
            valid = false;
          }
        }
      }); // If the form is valid

      if (valid) {
        // send the form
        form.submit();
      } else {
        // if not valid - scroll to the first error 
        scrollToFirstError();
      }
    });
  });
}