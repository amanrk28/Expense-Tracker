//Tracker class : to instantiate
class Tracker {
  constructor(text, transaction) {
    this.text = text;
    this.transaction = transaction;
    this.income;
    this.expense;
    if (transaction > 0) {
      this.income = transaction;
      this.expense = 0;
    } else {
      this.income = 0;
      this.expense = transaction;
    }
  }
}

//Storage class
class Store {
  static getTracker() {
    let tracker;
    if (localStorage.getItem("tracker") === null) {
      tracker = [];
    } else {
      tracker = JSON.parse(localStorage.getItem("tracker"));
    }
    return tracker;
  }
  static getBalance() {
    let balance;
    if (localStorage.getItem("balance") === null) {
      balance = { totIncome: 0.0, totExpense: 0.0 };
    } else {
      balance = JSON.parse(localStorage.getItem("balance"));
    }
    return balance;
  }
  static addTracker(track) {
    const tracker = Store.getTracker();
    tracker.push(track);
    localStorage.setItem("tracker", JSON.stringify(tracker));
  }
  static updBalance(balance) {
    localStorage.setItem("balance", JSON.stringify(balance));
    setTimeout(()=>{
      location.reload()
    },1);
    }
  static removeTracker(el) {
    const tracker = Store.getTracker();
    tracker.forEach((track, index) => {
      if (track.text === el) {
        tracker.splice(index, 1);
      }
    });
    localStorage.setItem("tracker", JSON.stringify(tracker));
  }
}

//UI class
class UI {
  static displayTracker() {
    const tracker = Store.getTracker();
    const balance = Store.getBalance();
    UI.displayBalance(balance);
    tracker.forEach((track) => UI.addToHistory(track));
  }
  static addToHistory(track) {
    const tbody = document.querySelector("#tbody");
    const tr = document.createElement("tr");
    if (track.transaction > 0) {
      tr.className = "table-success";
      tr.innerHTML = `
        <tr>
        <td class='text-dark'>${track.text}</td>
        <td class='text-dark'>${track.transaction}</td>
        <td><button class='btn btn-sm btn-danger' id='delete'>Remove</button></td>
        </tr>
        `;
    } else {
      tr.className = "table-danger";
      tr.innerHTML = `
        <tr>
        <td class='text-dark'>${track.text}</td>
        <td class='text-dark'>${track.transaction}</td>
        <td><button class='btn btn-sm btn-danger' id='delete'>Remove</button></td>
        </tr>
        `;
    }
    tbody.appendChild(tr);

    UI.clearFields();
  }

  static displayBalance(balance) {
    document.querySelector("#balance").innerHTML =
      balance.totIncome + balance.totExpense + ".00";
    document.querySelector("#income").innerHTML = balance.totIncome + ".00";
    document.querySelector("#expense").innerHTML = -balance.totExpense + ".00";
  }
  static removeFromBalance(amt) {
    const balance = Store.getBalance();
    if (amt > 0) {
      balance.totIncome -= amt;
    } else {
      balance.totExpense -= amt;
    }
    UI.displayBalance(balance);
    Store.updBalance(balance);
  }

  //Deleting Transactions
  static removeHistory(amt, el) {
    const tbody = document.querySelector("#tbody");
    const y = tbody.children;

    for (let i = 0; i < y.length; i++) {
      if (y[i].children[0].innerHTML === el) {
        tbody.removeChild(y[i]);
      }
    }
    UI.removeFromBalance(amt);
    Store.removeTracker(el);
  }
  //Clearing the input fields
  static clearFields() {
    document.querySelector("#text").value = "";
    document.querySelector("#transaction").value = "";
  }
}

//Loading default on loading
document.addEventListener("DOMContentLoaded", UI.displayTracker());

//Event : On click of add transaction button
document.querySelector("#add").addEventListener("click", () => {
  const text = document.querySelector("#text").value;
  const transaction = parseInt(document.querySelector("#transaction").value);
  if (text === "" || transaction === "") {
    alert("Please fill all inputs");
  } else {
    const tracker = new Tracker(text, transaction);

    //Adding to UI
    UI.addToHistory(tracker);
    Store.addTracker(tracker);

    const balance = Store.getBalance();
    balance.totIncome += tracker.income;
    balance.totExpense += tracker.expense;
    UI.displayBalance(balance);
    Store.updBalance(balance);
  }
});

//Event : On click of delete button
const del = document.querySelectorAll("#delete");
del.forEach((d) => {
  d.addEventListener("click", (e) => {
    const amt = parseInt(
      e.target.parentElement.previousElementSibling.innerHTML
    );
    UI.removeHistory(
      amt,
      e.target.parentElement.previousElementSibling.previousElementSibling
        .innerHTML
    );
  });
});
