"use strict";

const inputField = document.querySelector(".input");
const select = document.querySelector(".select");
const repoList = document.querySelector(".repos-list");
let newDataArray = new Array();
let optionsList = new Array();
let closeButtons = new Array();

const getInputValue = function () {
	return document.querySelector(".input").value;
};

const clearInputValue = function () {
	document.querySelector(".input").value = "";
	document.querySelector(".input").focus();
	select.classList.add("select--hidden");
};

const debounce = (fn, debounceTime) => {
	let timer;
	return function (...args) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(this, args);
		}, debounceTime);
	};
};

const apiData = async function (input) {
	const data = await fetch(
		`https://api.github.com/search/repositories?q=${input}`
	);
	const result = await data.json();
	return result.items;
};

const renderSearchResultItem = function (array) {
	array.forEach((item) => {
		const renderedItem = `<div class="option" id="${item.id}">${item.name}</div>`;
		select.insertAdjacentHTML("beforeend", renderedItem);
	});
};

const renderRepoListItem = function (info) {
	const repoListItem = `<li class="repos-list__item">
          <div class="repos-list__content">
            <ul class="item-list">
              <li class="item-list__item">
                <span class="item-list__title">Name:&nbsp;</span>
                <span class="item-list__text">${info.name}</span>
              </li>
              <li class="item-list__item">
                <span class="item-list__title">Owner:&nbsp;</span>
                <span class="item-list__text">${info.owner.login}</span>
              </li>
              <li class="item-list__item">
                <span class="item-list__title">Stars:&nbsp;</span>
                <span class="item-list__text">${info.stargazers_count}</span>
              </li>
            </ul>
            <button class="button">
              <svg width="46" height="42" viewBox="0 0 46 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 40.5L44 2" stroke="#FF0000" stroke-width="4" />
                <path d="M44 40.5L2 2" stroke="#FF0000" stroke-width="4" />
              </svg>
            </button>
          </div>
        </li>`;
	repoList.insertAdjacentHTML("beforeend", repoListItem);
};

const choseElement = function (e) {
	newDataArray.filter((item) => {
		if (item.id == e.target.id) {
			renderRepoListItem(item);
		}
	});
	closeButtons = document.querySelectorAll(".button");
	closeButtons.forEach((button) => {
		button.addEventListener("click", function () {
			this.closest(".repos-list__item").remove();
		});
	});
	clearInputValue();
};

const getApiData = async function () {
	try {
		const inputValue = await getInputValue();
		if (inputValue === "undefined" || inputValue[0] === " ") {
			select.classList.add("select--hidden");
			throw new Error("Некорректные данные");
		} else if (!inputValue) {
			select.classList.add("select--hidden");
		}

		try {
			const result = await apiData(inputValue);
			newDataArray = result.splice(0, 5);
		} catch (err) {
			throw new Error(
				"Количество запросов к серверу превышено. Повторите попытку позже."
			);
		}

		optionsList.forEach((item) => item.remove());
		select.classList.remove("select--hidden");
		newDataArray.forEach((element) => {
			const renderedItem = `<div class="option" id="${element.id}">${element.name}</div>`;
			select.insertAdjacentHTML("beforeend", renderedItem);
		});
		optionsList = document.querySelectorAll(".option");
		select.addEventListener("click", choseElement);
	} catch (err) {
		alert(err);
		console.error(err);
	}
};

inputField.addEventListener("keyup", debounce(getApiData, 400));
