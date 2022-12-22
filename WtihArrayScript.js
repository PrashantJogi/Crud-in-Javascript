let table = document.querySelector("table");
let thead = document.querySelector("thead");
let tbody = document.querySelector("tbody");

let inputValues = document.querySelectorAll("input");
let fields = document.getElementsByClassName("inputFields");

// Storing Data Array
let entries = [];

function submit() {
  let inputFields = {};

  inputValues.forEach((e) => {
    inputFields[e.name] = e.value;
  });

  if (fields[0].id !== "") {
    let tableRows = document.querySelectorAll("tr[id]");

    for (let i = 0; i < tableRows.length; i++) {
      if (tableRows[i].id == fields[0].id) {
        updateEntry(tableRows[i], inputFields);
        // replaceChild(newchild,oldchild);
      }
    }
    fields[0].id = "";
  } else if (inputValues && fields[0].id === "") {
    entries.push(inputFields);

    table.removeAttribute("style");

    cleanTbody();
    tableBody(entries);
    clean();
  }
}

//to clean table for new entries
function cleanTbody() {
  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }
}

//to change existing entry
function updateEntry(oldEntry, newEntry) {
  let dataValue = [];

  dataValue = Object.values(newEntry);
  let row = document.createElement("tr");
  row.id = oldEntry.id;

  for (let tdName of dataValue) {
    let cell = document.createElement("td");

    cell.innerText = tdName;
    row.appendChild(cell);
  }
  row.insertCell().innerHTML =
    "<button onclick='update(this)'>Update</button>" +
    "<button onclick='del(this)'>Delete</button>";
  tbody.replaceChild(row, oldEntry);

  // table.appendChild(tbody);
}

//for generating unique id
let guid = () => {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
};

//for append data in table
function tableBody(data) {
  let dataValue;
  for (let item of data) {
    dataValue = Object.values(item);
    let row = document.createElement("tr");
    row.setAttribute("id", guid());
    
    for (let tdName of dataValue) {
      let cell = document.createElement("td");

      cell.innerText = tdName;
      row.appendChild(cell);
    }
    row.insertCell().innerHTML =
      "<button onclick='update(this)'>Update</button>" +
      "<button onclick='del(this)'>Delete</button>";
    tbody.appendChild(row);
  }
  table.appendChild(tbody);
}

//for cleaning input fields after submitting data
function clean() {
  inputValues.forEach((element) => {
    element.value = "";
  });
  // fields[0].id = "";
}

//for update entry
function update(element) {
  let targetElement = element.parentElement.parentElement;
  let id = element.parentElement.parentElement.id;

  console.log(entries);

  targetElement.childNodes.forEach((e) => {
    inputValues.value = e.innerText;
  });
  for (i = 0; i < targetElement.childNodes.length - 1; i++) {
    console.log(targetElement.childNodes[i].innerText);
    inputValues[i].value = targetElement.childNodes[i].innerText;
  }
  inputValues[0].parentElement.id = id;
}

//for delete entry
function del(element) {
  let id = element.parentElement.parentElement;
  let table = document.getElementById("tbody");
  if (confirm("This entry will be deleted !") === true) {
    console.log(entries, "entries");

    id.remove();
    entries.splice(id.id, 1);
  }

  console.log(table.childNodes.length, "table.childNodes.length");
  if (table.childNodes.length <= 0) {
    console.log("matched");
    document.querySelector("table").setAttribute("style", "display:none");
  }
}

//validation code
function validateForm() {
  let allFields = document.querySelectorAll("input");
  let error = [];
  let dataArr = [];

  allFields.forEach((field) => {
    checkValidation(field, dataArr, error);
  });

  //   console.log(error.length>0 ? error : "empty", "error");
  if (error.length === 0) {
    submit();
  }
}

function checkValidation(field, dataArr, error) {
  if (field.dataset.validation) {
    let isInvalid = false;
    const validationRules = field.dataset.validation.split("|");
    validationRules.map((validation) => {
      // debugger;
      if (!isInvalid) {
        if (validation === "required") {
          let isValidMessage;
          if (field.type.includes("checkbox") || field.type.includes("radio")) {
            isValidMessage = validateCheckBox_And_RadioBtn(field.name);
          } else {
            isValidMessage = validateRequired(field.value, field.name);
          }
          if (isValidMessage) {
            document.getElementById(`${field.name}Err`).innerHTML =
              isValidMessage;
            error.push(field.name);
            isInvalid = true;
          } else {
            document.getElementById(`${field.name}Err`).innerHTML = "";
            // showData({[field.name]:field.value})
          }
        } else if (validation.includes("min:")) {
          const isValidMessage = validateMin(
            field.value,
            validation,
            field.name
          );
          if (isValidMessage) {
            document.getElementById(`${field.name}Err`).innerHTML =
              isValidMessage;
            error.push(field.name);
            isInvalid = true;
          } else {
            document.getElementById(`${field.name}Err`).innerHTML = "";
          }
        } else if (validation.includes("max:")) {
          const isValidMessage = validateMax(
            field.value,
            validation,
            field.name
          );
          if (isValidMessage) {
            document.getElementById(`${field.name}Err`).innerHTML =
              isValidMessage;
            error.push(field.name);
            isInvalid = true;
          } else {
            document.getElementById(`${field.name}Err`).innerHTML = "";
          }
          // logic for max validation
        } else if (validation.includes("regex:")) {
          // logic for regex validation
          const isValidMessage = validateRegex(
            field.value,
            validation,
            field.name
          );
          if (isValidMessage) {
            document.getElementById(`${field.name}Err`).innerHTML =
              isValidMessage;
            error.push(field.name);
            isInvalid = true;
          } else {
            // debugger;

            document.getElementById(`${field.name}Err`).innerHTML = "";
          }
        }
      }
    });
    dataArr.push({ [field.name]: field.value });
  }
}

function validateRequired(value, fieldName) {
  if (!value || value === "" || value.trim() === "") {
    return `${fieldName} is required.`;
  }
  return undefined;
}

function validateMin(value, validationRule, fieldName) {
  const [rule, param] = validationRule.split(":");

  if (
    fieldName === "Age"
      ? parseInt(value) < parseInt(param)
      : !value || parseInt(value.length) < parseInt(param)
  ) {
    if (fieldName === "Age") {
      return `${fieldName} must not les than ${param}.`;
    } else {
      return `${fieldName} must not contain less than ${param} characters.`;
    }
  }
  return undefined;
}

function validateMax(value, validationRule, fieldName) {
  const [rule, param] = validationRule.split(":");

  if (
    fieldName === "Age"
      ? parseInt(value) > parseInt(param)
      : !value || parseInt(value.length) > parseInt(param)
  ) {
    if (fieldName === "Age") {
      return `${fieldName} must not more than ${param}.`;
    } else {
      return `${fieldName} must not contain more than ${param} characters.`;
    }
  }
  return undefined;
}

function validateRegex(value, validationRule, fieldName) {
  const [rule, param] = validationRule.split(":");
  const regex = new RegExp(param);
  if (regex.test(value) === false) {
    return `Please enter a valid ${fieldName} `;
  }
  return undefined;
}
