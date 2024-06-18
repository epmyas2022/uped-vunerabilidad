import puppeteer from "puppeteer";
import fs from "fs";
console.log("scrapt.js loaded");

const dicElements = {
  "#ctl00_lalumno": {
    name: "Nombre",
    type: "text",
  },
  /*   "#ctl00_alumno": {
    name: "Foto",
    type: "src",
  }, */
};

const elementsExpendiente = {
  "#ctl00_ContentPlaceHolder1_dciclo_ing": {
    name: "ciclo",
    type: "select",
  },
  "#ctl00_ContentPlaceHolder1_carnet": {
    name: "carnet",
    type: "input",
  },
  'input[name="ctl00$ContentPlaceHolder1$nombres"]': {
    name: "nombres",
    type: "input",
  },
  'input[name="ctl00$ContentPlaceHolder1$apellidos"]': {
    name: "apellidos",
    type: "input",
  },
  'textarea[name="ctl00$ContentPlaceHolder1$direccion"]': {
    name: "direccion",
    type: "text",
  },

  'input[name="ctl00$ContentPlaceHolder1$correoi"]': {
    name: "correo",
    type: "input",
  },

  'input[name="ctl00$ContentPlaceHolder1$fecha_ingreso"]': {
    name: "fecha_ingreso",
    type: "input",
  },

  'input[name="ctl00$ContentPlaceHolder1$fecha_nac"]': {
    name: "fecha_nacimiento",
    type: "input",
  },
  'select[name="ctl00$ContentPlaceHolder1$tpingreso"]': {
    name: "tipo_ingreso",
    type: "select",
  },
};

const resquestInfo = async ({
  dicElements,
  url,
  codigo,
  user,
  close = true,
  viewport = null,
  domain,
  headless,
}) => {
  console.log("scrapt.js running");
  const args = process.env.ARGS.split(",");
  const browser = await puppeteer.launch({
    headless,
    ignoreHTTPSErrors: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", ...args],
  });
  try {
    const [page] = await browser.pages();
    const cookies = [
      {
        name: ".ASPXAUTH",
        value: process.env.ASPXAUTH,
        domain,
      },
      {
        name: "ASP.NET_SessionId",
        value: process.env.SESSION_ID,
        domain,
      },
      { name: "CodigoUsuario", value: codigo, domain },
      { name: "usuario", value: user, domain },
    ];

    if (viewport) await page.setViewport(viewport);
    await page.setCookie(...cookies);

    await page.goto(url, {
      timeout: 3000000,
      waitUntil: ["domcontentloaded", "networkidle2"],
    });

    const keysTags = Object.keys(dicElements);

    const data = {};

    for (let i = 0; i < keysTags.length; i++) {
      const key = keysTags[i];
      const value = dicElements[key]["name"];
      const element = await page.$(key);

      const type = dicElements[key]["type"];

      const result = await page
        .evaluate(
          (element, type) => {
            if (type === "text") {
              return element.textContent.replace("Bienvenido", "").trim();
            } else if (type === "src") {
              return element.src;
            } else if (type === "select") {
              return element.options[element.selectedIndex].text;
            } else if (type === "input") {
              return element.value.trim();
            }
          },
          element,
          type
        )
        .catch((e) => {
          console.log(e);
          return false;
        });

      if (!result) return await browser.close();
      data[value] = result;
    }

    if (close) await browser.close();

    return data;
  } catch (e) {
    console.log(e);
    await browser.close();
  }
};

const infoGeneral = async (min = 1, max, headless = true) => {
  const allData = [];
  const date = new Date();
  const time = date.getTime();
  for (let i = min; i < max; i++) {
    console.log(`Haciendo scrapt al codigo ${i}`);
    const data = await resquestInfo({
      dicElements: elementsExpendiente,
      url: "https://myappcloud.net/uped/portal_estudiante/expediente_new.aspx",
      codigo: String(i),
      user: "UPED-ESTUDIANTE",
      domain: "myappcloud.net",
      headless: headless,
    });

    if (i % 100 === 0) {
      fs.writeFile(
        `data/data${time}.json`,
        JSON.stringify(allData),
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );
    }
    if (!data) continue;

    data["codigo"] = i;
    allData.push(data);
  }
};

//  "https://myappcloud.net/uped/portal_estudiante/externa.aspx"

const openSession = async (user, codigo, url, domain) => {
  await resquestInfo({
    dicElements: [],
    close: false,
    viewport: {
      width: 1000,
      height: 600,
    },
    headless: false,
    domain,
    url,
    codigo,
    user,
  });
};

const commands = {
  general: () =>
    infoGeneral(process.argv[3], process.argv[4], process.argv[5] === "true"),
  session: () =>
    openSession(
      process.argv[3],
      process.argv[4],
      "https://myappcloud.net/uped/portal_estudiante/externa.aspx",
      "myappcloud.net"
    ),
  pagos: () =>
    openSession(
      process.argv[3],
      process.argv[4],
      "https://saas.spsoftware.net/uped_pagos/pagos_linea_alu.aspx",
      "saas.spsoftware.net"
    ),
};

commands[process.argv[2]]();
