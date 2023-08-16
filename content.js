const body = document.getElementsByTagName("body")[0];

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
  if (selectedText) {
    try {
      const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${selectedText}`;
      const response = await fetch(url);
      const [data] = await response.json();

      //making selected texts firs letter capital
      selectedText =
        selectedText.charAt(0).toUpperCase() + selectedText.slice(1);

      const popupcontent = `<div class="word"><h1>${selectedText}</h1></div>
                              <div class="content">
                                <ul class="list"></ul>
                              </div>`;

      const popup = document.createElement("div");
      popup.classList.add("popup");
      popup.innerHTML = popupcontent;
      body.appendChild(popup);

      const list = document.querySelector(".list");
      console.log(list);

      for (let i = 0; i < data.meanings.length; i++) {
        const meanings = data.meanings[i];
        const partOfSpeech = meanings.partOfSpeech;
        const definitions = meanings.definitions[0].definition;
        const example = meanings.definitions[0].example;

        const listItem = `<li><span class="partOfSpeech">${partOfSpeech}</span> ${definitions} <span class="example">"${example}"</span></li>`;

        list.innerHTML += listItem;
      }

      popup.innerHTML = popupcontent;

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
};

document.onmouseup = doSomethingWithSelectedText;
document.onkeyup = doSomethingWithSelectedText;
