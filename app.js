const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");


// Populate dropdowns
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "PKR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Update country flags when currency changes
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// Fetch exchange rate and update UI
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

    try {
        let response = await fetch(URL);
        let json = await response.json();
        let rate = json[fromCurr.value.toLowerCase()]?.[toCurr.value.toLowerCase()];

        if (!rate) {
            msg.innerText = "Exchange rate not available.";
            return;
        }

        let convertedAmount = (amtVal * rate).toFixed(2);
        msg.innerText = `${amtVal} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
        
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        msg.innerText = "Something went wrong. Please try again.";
    }
});
