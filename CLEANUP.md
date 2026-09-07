# Ting som kan fjernes:
 - ~~[Redirect util](src/utils/Redirect/Redirect.tsx)~~
 - ~~[Encryption util](src/utils/encryption/encrypt.ts)~~
 - ~~CryptoJS (brukes bare i encryption util greia)~~
 - ~~[Alert context](src/contexts/AlertContext.ts) (antar det var ment for typ toasts? Bruker nå sonner)~~
 - ~~[Travis ci greier](.travis.yml) (brukte travis for ci før, bruker github actions nå)~~
 - ~~[deploy_key.enc](deploy_key.enc)? Tror den ble brukt sammen med travis før~~
 - ~~[Stylelint rc](.stylelintrc.json) (brukes ikke for linting)~~
 - ~~[eslint rc](.eslintrc.json) (eslint bruker [eslint.config.js](eslint.config.js) nå)~~
 - ~~ALT (bortsett fra AuthToken) inni [interfaces](src/interfaces/) mappen. Auth token er legit også bare et object med en string inni, så jeg foreslår å slette hele interfaces mappen og så flytte auth token interfacet til [AuthApi.ts](src/utils/api/AuthApi.ts), som er det eneste stedet den blir brukt.~~
 - ~~.vscode mappen gjør ingenting annet enn å sette formatOnSave~~

# Annet
 - Flytt [FormContext.ts](src/utils/form/FormContext.ts) fra utils til contexts mappen, sammen med alle andre contexts
 - Oppdater README til å inneholde faktisk informasjon
 - Legg til `bun.lock` i gitignore