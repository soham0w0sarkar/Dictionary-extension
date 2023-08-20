const body = document.getElementsByTagName("body")[0];
const history = [];

const getSelectedText = () => {
  var text = "";
  if (typeof window.getSelection != "undefined") {
    text = window.getSelection().toString();
  } else if (
    typeof document.selection != "undefined" &&
    document.selection.type == "Text"
  ) {
    text = document.selection.createRange().text;
  }
  return text;
};

const doSomethingWithSelectedText = async () => {
  var selectedText = getSelectedText();
  if (selectedText && !history.includes(selectedText)) {
    try {
      history.push(selectedText);

      const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${selectedText}`;
      const response = await fetch(url);
      const [data] = await response.json();

      //making selected texts firs letter capital
      selectedText =
        selectedText.charAt(0).toUpperCase() + selectedText.slice(1);

      const popupcontent = `  <button class="close">X</button>
                              <div class="popup__title"><h1 class="word">${selectedText}</h1></div>
                                <div class="content">
                                <ul class="list"></ul>
                              </div>`;

      const popup = document.createElement("div");
      popup.classList.add("popup");
      popup.innerHTML = popupcontent;
      body.appendChild(popup);

      const list = document.querySelector(".list");

      for (let i = 0; i < data.meanings.length; i++) {
        const meanings = data.meanings[i];
        const partOfSpeech = meanings.partOfSpeech;
        const definitions = meanings.definitions[0].definition
          ? meanings.definitions[0].definition
          : "No definition found";
        const example = meanings.definitions[0].example
          ? meanings.definitions[0].example
          : "No example found";

        const listItem = `<li class ="content"><div class="partOfSpeech">${partOfSpeech}</div>Definition: ${definitions} <div class="example">Example: ${example}</div></li>`;

        list.innerHTML = listItem;

        const close = document.querySelector(".close");

        close.addEventListener("click", () => {
          popup.remove();
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

document.onmouseup = doSomethingWithSelectedText;
document.onkeyup = doSomethingWithSelectedText;
