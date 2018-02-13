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

        /* Placeholders activating for text fields.
		   Whether JavaScript is disabled CSS will set placeholders 
		   to its place.		   
        */
        $(`[data-active-placeholder="true"]`).each((index, elemetnt) => {
            activePlaceholder($(elemetnt));
        });

        /* Scripts for Basic */
        const basicContext = $(".basic-info");
        // Hide other job role field
        const otherInputContainer = basicContext.find(`input[name="other"]`)
            .closest(".form__control-container")
            .hide();
        const jobRoleSelect = basicContext.find(`select[name="jobRole"]`);

        // To focus on name field I used HTML5 attribute autofocus.
      
        /* function, which makes other job role field visible
		   depending on job role select.		   
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
        // Change event-handler on job role select
        jobRoleSelect.on("change", e => toggleOther($(e.target)));
        /* Just in case while initializing an application start selected job role check function. 
		  (in case Other in a default value) 
        */
        toggleOther(jobRoleSelect);

        /* Scripts for T-Shirt */
        // Choose elements which we need for work. 
        const tShirtContext = $(".t-shirt-info");
        const colorSelect = tShirtContext.find(`select[name="color"]`);
        const colorSelectContainer = colorSelect.closest(".form__control-container")
            .hide();
        const colors = colorSelect.find("option");
        const themeSelect = tShirtContext.find(`select[name="design"]`);
        
        /* function which is responsible for color select content and its visibility
           depending on T-shirt design selected. 
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
        // Change event-handler for T-shirt design select.
        themeSelect.on("change", e => toggleColor($(e.target)));
        /* Just in case while initializing an application start color availability check function 
           (in case when default design is selected) 
        */
        toggleColor(themeSelect);

        /* Scripts for Activities */
        // Choose elements which we need for work
        const activitiesContext = $(".activities-info");
        const totalElement = $(`
            <div class="activities-total-cost">
                <span>Total: </span>
                <span class="cost"></span>
            </div>
        `).appendTo(activitiesContext).hide();
        let total = 0;

        // Enable or disable field with total sum on selected activities 
        const toggleTotal = () => {
            const totalCost = totalElement.find(".cost");
            totalCost.text(`$${total}`);
            total 
                ? totalElement.show()
                : totalElement.hide();
        };

        // Choosing check-boxes from DOM and change event handler
        const activities = activitiesContext.find(`input[type="checkbox"]`);
        activities.on("change", (e) => {
            const target = $(e.target);
            const isChecked = target.prop("checked");
            
            const cost = target.data("cost");
            isChecked 
                ? total += cost
                : total -= cost; 
            toggleTotal();

            // Disable activities which are time-crossing with another selected activities. 
            const time = target.data("time");
            activities.each((item, element) => {
                element = $(element);
                if(!element.is(target) && element.data("time") === time) {
                    element.prop("disabled", isChecked);
                }
            });
        });

        /* Scripts for Payment */
        // Choose elements which we need for work
        const paymentContext = $(".payment-info");
        const methods = paymentContext.find(".info").hide();
        const methdosSelect = paymentContext.find(`select[name="paymentMethod"]`);

        // Choose payment method 
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

        // Add special validation methods on form fields
        const form = $("#registerForm");
        // VALIDATOR: Choice obligation, is performed by field value featuring
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
        // VALIDATOR: e-mail address, is performed by regular expressions
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
        // VALIDATOR: card number, zip code and cvv, is performed by regular expressions
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
        // SPECIAL VALDATOR of selected activities 
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
        /* Generic method which displays or hides error message 
           depending on validation result 
        */
        const toggleError = (input, { messenge, errorName }) => {
            const container = input.closest(".form__control-container");
            const clear = (all = true) => {
                input.removeClass("state_error");
                input.data("error", false);
                container.find(`.form__control-validation-messenge${all ? "" : `.error_${errorName}`}`).remove();
            };
            // If an element is disabled (hidden) - there is no validation
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
        // Move to the fist error 
        const scrollToFirstError = () => {
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

            // All required for validation fields where marked with special data-attribute
            form.find(`[data-val="true"]`).each((idx, element) => {
                element = $(element);
                const validator = element.data("custom-validation");
                if(typeof validator === "function") {
                    if(!validator(element)) { valid = false; }
                }
            });

            // If the form is valid
            if(valid) {
                // send the form
                form.submit();
            } else {
                // if not valid - scroll to the first error 
                scrollToFirstError();
            }
        });
    });
}